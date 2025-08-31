import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/ScheduleCallStyle';


const ScheduleCallScreen = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCallId, setSelectedCallId] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const fetchCalls = async () => {
    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User error:', userError);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('psychiatrist_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching calls:', error);
    } else {
      setCalls(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const handleSetDateTime = (callId) => {
    setSelectedCallId(callId);
    setPickerVisible(true);
  };

  const handleConfirm = async (date) => {
    setPickerVisible(false);
    setPickerDate(date);

    if (!selectedCallId) {
      console.error('No call selected for scheduling');
      return;
    }

    const { data, error } = await supabase
      .from('calls')
      .update({ scheduled_time: date.toISOString() })
      .eq('id', selectedCallId)
      .select();

    if (error || !data || data.length === 0) {
      console.error('❌ Error updating scheduled_time:', error);
      Alert.alert('Update failed', 'Could not update scheduled time.');
      return;
    }

    const call = data[0];
    const generatedRoomLink = `https://meet.jit.si/call_${call.id}`;

    const { error: linkError } = await supabase
      .from('calls')
      .update({ room_link: generatedRoomLink })
      .eq('id', call.id);

    if (linkError) {
      console.error('❌ Error setting room link:', linkError);
      Alert.alert('Failed to set room link');
    } else {
      console.log('✅ Room link set:', generatedRoomLink);
      Alert.alert('Success', 'Scheduled time and room link updated!');
      fetchCalls(); // refresh the call list
    }
  };

  const handleCancel = () => {
    setPickerVisible(false);
  };

  const handleJoinRoom = async (callId, roomLink) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('❌ Error getting user:', error);
      Alert.alert('User error', 'Could not get current user.');
      return;
    }

    // Fetch user's name and role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('email', user.email)
      .single();

    if (profileError || !profile) {
      console.error('❌ Error fetching profile:', profileError);
      Alert.alert('Error', 'Could not fetch user profile.');
      return;
    }

    const { error: insertError } = await supabase
      .from('call_participants')
      .insert({
        call_id: callId,
        user_id: user.id,
        name: profile.name,
        role: profile.role,
      });

    if (insertError) {
      console.error('❌ Error inserting call participant:', insertError);
      Alert.alert('Error', 'Could not save call participation.');
      return;
    }

    const fullLink = roomLink.startsWith('http')
      ? roomLink
      : `https://meet.jit.si/${roomLink}`;

    Linking.openURL(fullLink);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduled Calls</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={calls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>User: {item.name}</Text>
              <Text>Message: {item.message}</Text>
              <Text>
                Scheduled Time:{' '}
                {item.scheduled_time
                  ? new Date(item.scheduled_time).toLocaleString()
                  : 'Not Scheduled'}
              </Text>

              {item.room_link ? (
                <TouchableOpacity
                  onPress={() => handleJoinRoom(item.id, item.room_link)}
                >
                  <Text style={styles.link}>Join Room</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.pending}>Room link not generated</Text>
              )}

              <Button
                title="Set Date & Time"
                onPress={() => handleSetDateTime(item.id)}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No scheduled calls yet.</Text>
          }
        />
      )}

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        date={pickerDate}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default ScheduleCallScreen;


