import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { UserHomeStyles as styles } from '../styles/UserHomeStyles';
import { supabase } from '../utils/supabaseClient';
import legalQuestions from '../utils/legalQuestions';

const { width } = Dimensions.get('window');

const UserHome = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError?.message);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
      } else {
        setUserName(profile.name);
      }
    };

    fetchUserName();

    // Pick a random question of the day
    const randomIndex = Math.floor(Math.random() * legalQuestions.length);
    setQuestionData(legalQuestions[randomIndex]);
  }, []);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setAnswered(true);
    const isCorrect = option === questionData.answer;

    Alert.alert(
      isCorrect ? 'Correct Answer 🎉' : 'Wrong Answer ❌',
      isCorrect
        ? 'Well done! You selected the right answer.'
        : `Oops! The correct answer is: ${questionData.answer}`
    );

    if (isCorrect) {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('Error fetching user:', userError?.message);
          return;
        }

        // Log user ID for debugging purposes
        console.log('Incrementing score for user ID:', user.id);

        const { error: updateError } = await supabase.rpc('increment_score', {
          user_id: user.id,
          increment_value: 3,
        });

        if (updateError) {
          console.error('Failed to increment score:', updateError.message);
        } else {
          console.log('Score successfully incremented!');
        }
      } catch (err) {
        console.error('Unexpected error incrementing score:', err.message);
      }
    }
  };

  const renderGradientWave = () => (
    <Svg height="273" width={width} viewBox={`0 0 ${width} 273`}>
      <Defs>
        <LinearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#AFDDFF" />
          <Stop offset="25%" stopColor="#FF6B6B" />
          <Stop offset="50%" stopColor="#FFD166" />
          <Stop offset="75%" stopColor="#B5EAD7" />
          <Stop offset="100%" stopColor="#CBAACB" />
        </LinearGradient>
      </Defs>
      <Path
        d={`M0 0 
            L0 213 
            C ${width * 0.25} 313, ${width * 0.75} 113, ${width} 213 
            L${width} 0 
            Z`}
        fill="url(#waveGradient)"
        opacity="0.55"
      />
    </Svg>
  );

  const renderBrownWave = () => (
    <Svg
      height="250"
      width={width}
      viewBox={`0 0 ${width} 250`}
      style={{ position: 'absolute', top: 0 }}
    >
      <Path
        d={`M0,130 
          C${width * 0.25},250 ${width * 0.75},50 ${width},130 
          L${width},0 
          L0,0 
          Z`}
        fill="#F8F3D9"
        opacity="0.8"
      />
    </Svg>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: '#F8F3D9',
          paddingBottom: 10,
          flexGrow: 1,
        }}
      >
        <View style={{ position: 'relative' }}>
          {renderGradientWave()}
          {renderBrownWave()}
          <Image
            source={require('../design/icons/safenest-logo.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Welcome to SafeNest</Text>
          <Text style={styles.subHeaderText}>
            {userName ? `Hello, ${userName}!` : 'Loading...'}
          </Text>
        </View>

        <View style={styles.hamburgerContainer}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Feather name="menu" size={28} color="#A76545" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeading}>Explore</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.chatbotButton]}
            onPress={() => navigation.navigate('MentalHealthChatbot')}
          >
            <Image
              source={require('../design/icons/chatbot-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Chatbot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sosButton]}
            onPress={() => navigation.navigate('SOSScreen')}
          >
            <Image
              source={require('../design/icons/sos-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>SOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.challengeButton]}
            onPress={() => navigation.navigate('DailyChallengeScreen')}
          >
            <Image
              source={require('../design/icons/challenge-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Daily Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.storyButton]}
            onPress={() => navigation.navigate('StoryScreen')}
          >
            <Image
              source={require('../design/icons/story-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Storytelling</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.scheduleButton]}
            onPress={() => navigation.navigate('UserScheduledCallScreen')}
          >
            <Image
              source={require('../design/icons/call-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>View Scheduled Calls</Text>
          </TouchableOpacity>
        </View>

        {questionData && (
          <View style={styles.qotdContainer}>
            <Image source={require('../design/icons/quiz.png')} 
              style={styles.qotdIcon} 
            />
            <Text style={styles.sectionHeading}>Question of the Day</Text>
            <Text style={styles.qotdQuestion}>{questionData.question}</Text>
            {questionData.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.qotdOption,
                  selectedOption === option && {
                    backgroundColor:
                      option === questionData.answer ? '#B5EAD7' : '#FFCCCC',
                  },
                ]}
                onPress={() => handleOptionSelect(option)}
                disabled={answered}
              >
                <Text style={styles.qotdOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionHeading}>Articles</Text>

        <View style={styles.gridContainer}>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.squareButton}
              onPress={() => navigation.navigate('MeditationArticle')}
            >
              <Image
                source={require('../design/icons/meditation.png')}
                style={styles.gridImage}
              />
              <Text style={styles.gridText}>Meditation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.squareButton}
              onPress={() => navigation.navigate('SleepArticle')}
            >
              <Image
                source={require('../design/icons/sleeping.png')}
                style={styles.gridImage}
              />
              <Text style={styles.gridText}>Sleep</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.squareButton}
              onPress={() => navigation.navigate('HabitArticle')}
            >
              <Image
                source={require('../design/icons/daily-tasks.png')}
                style={styles.gridImage}
              />
              <Text style={styles.gridText}>Habit Building</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.squareButton}
              onPress={() => navigation.navigate('SocialArticle')}
            >
              <Image
                source={require('../design/icons/social-media.png')}
                style={styles.gridImage}
              />
              <Text style={styles.gridText}>Social Connection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserHome;
