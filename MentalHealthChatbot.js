import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { getGeminiResponse, classifyMessageWithGemini } from '../utils/gemini';
import { supabase } from '../utils/supabaseClient';
import axios from 'axios';
import { chatbotStyles as styles } from '../styles/ChatbotStyles';

const API_URL = 'http://192.168.43.237:5000/api/messages'; // Your backend URL

const MentalHealthChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('english');
  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        const history = await fetchMessages(data.user.id);
        setMessages(history);
      }
    };
    fetchUserAndMessages();
  }, []);

  const saveMessage = async (message) => {
    try {
      const response = await axios.post(`${API_URL}/send`, message);
      return response.data;
    } catch (error) {
      console.error('Failed to save message:', error);
      throw error;
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage = {
      userId: user.id,
      from: 'user',
      text: input,
    };

    console.log('🟢 User input:', input);

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    await saveMessage(userMessage);

    try {
      const category = await classifyMessageWithGemini(input);
      console.log('🔵 Classified as:', category);

      if (category === 'emergency') {
        console.log('⚠️ Emergency detected. Calling 14416');
        const emergencyMsg = language === 'tamil'
          ? '⚠️ இது அவசர நிலை போன்றதாக தெரிகிறது. உடனடி உதவிக்காக 14416 எண்ணை அழைக்கிறோம்...'
          : '⚠️ This seems like an emergency. Calling 14416 for immediate help...';

        const botMessage = {
          userId: user.id,
          from: 'bot',
          text: emergencyMsg,
        };
        setMessages((prev) => [...prev, botMessage]);
        await saveMessage(botMessage);
        Linking.openURL('tel:14416');
      } else if (category === 'distress') {
        console.log('🟡 Distress detected. Scheduling call...');
        const { data: psychiatrists, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'psychiatrist')
          .limit(1);

        if (fetchError || !psychiatrists?.length) {
          throw new Error('No psychiatrist available.');
        }

        const psychiatrist = psychiatrists[0];
        const userName = user?.user_metadata?.name || (language === 'tamil' ? 'பயனர்' : 'User');

        const { error: insertError } = await supabase.from('calls').insert([{
          user_id: user.id,
          name: userName,
          message: input,
          psychiatrist_id: psychiatrist.id,
          psychiatrist_name: psychiatrist.name,
          psychiatrist_phone: psychiatrist.phone,
        }]);

        if (insertError) throw insertError;

        const responseMessage = language === 'tamil'
          ? `📞 டாக்டர் ${psychiatrist.name} (${psychiatrist.phone}) உடன் ஒரு அழைப்பு ஏற்பாடு செய்யப்பட்டுள்ளது. தயவுசெய்து பொறுமையாக இருங்கள் – நீங்கள் தனியாக இல்லை.`
          : `📞 A call has been scheduled with Dr. ${psychiatrist.name} (${psychiatrist.phone}). Please stay calm – you are not alone.`;

        const botMessage = {
          userId: user.id,
          from: 'bot',
          text: responseMessage,
        };
        setMessages((prev) => [...prev, botMessage]);
        await saveMessage(botMessage);
      } else {
        const fullChat = [...messages, userMessage]
          .map((msg) => `${msg.from === 'user' ? (language === 'tamil' ? 'பயனர்' : 'User') : 'Bot'}: ${msg.text}`)
          .join('\n');

        const prompt = language === 'tamil'
          ? `தயவுசெய்து இந்த உரையாடலைத் தொடர்ந்து மனிதனை அனுதாபத்துடன், தெளிவாகவும், தமிழ் மொழியில் பதிலளி:\n\n${fullChat}\n\nபொறுத்தமான பதிலை தமிழில் அளி.`
          : `Please respond to this conversation with empathy and clarity in English:\n\n${fullChat}\n\nGive a helpful and supportive response.`;

        const botReply = await getGeminiResponse(prompt);
        console.log('🤖 Gemini Reply:', botReply);

        const botMessage = {
          userId: user.id,
          from: 'bot',
          text: botReply,
        };
        setMessages((prev) => [...prev, botMessage]);
        await saveMessage(botMessage);
      }
    } catch (error) {
      console.error('❌ Error sending message:', error.message);
      const errorMessage = {
        userId: user.id,
        from: 'bot',
        text: language === 'tamil'
          ? '❌ மன்னிக்கவும், ஏதோ தவறு ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
          : '❌ Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await axios.delete(`${API_URL}/clear?userId=${user.id}`);
      setMessages([]);
      alert(language === 'tamil' ? 'உங்கள் உரையாடல் அழிக்கப்பட்டது.' : 'Your chat has been cleared.');
    } catch (err) {
      console.error(err.message);
      alert(language === 'tamil' ? 'உரையாடலை அழிக்க முடியவில்லை.' : 'Failed to clear chat.');
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'english' ? 'tamil' : 'english'));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <View style={styles.container}>
            <View style={styles.topButtons}>
              <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>
                  {language === 'tamil' ? 'உரையாடலை அழிக்கவும்' : 'Clear Chat'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
                <Text style={styles.languageButtonText}>
                  {language === 'tamil' ? 'English' : 'தமிழ்'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 80 }}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    msg.from === 'user' ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              ))}
              {loading && (
                <View style={styles.botBubble}>
                  <ActivityIndicator size="small" color="#333" />
                </View>
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={language === 'tamil' ? 'உங்களது உணர்வுகளை பதிவு செய்யுங்கள்...' : 'Express your feelings...'}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>
                  {language === 'tamil' ? 'அனுப்பு' : 'Send'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default MentalHealthChatbot;
