import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/UserScheduledCallStyle';


const UserScheduledCallScreen = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScheduledCalls = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User fetch error:', userError);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('calls')
      .select('id, name, message, scheduled_time, room_link, psychiatrist:psychiatrist_id(name, role)')
      .eq('user_id', user.id)
      .not('scheduled_time', 'is', null)
      .order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching user calls:', error);
    } else {
      setCalls(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchScheduledCalls();
  }, []);

  const handleJoinCall = async (item) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Failed to get user info:', userError);
      Alert.alert('Error', 'Could not identify user.');
      return;
    }

    // ✅ Fetch name and role from profiles using user ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      Alert.alert('Error', 'Could not retrieve user profile.');
      return;
    }

    const { error: insertError } = await supabase.from('call_participants').insert({
      call_id: item.id,
      user_id: user.id,
      name: profile.name,
      role: profile.role,
    });

    if (insertError) {
      console.error('Error logging participant:', insertError);
    } else {
      console.log(`🟢 User ${profile.name} (${profile.role}) joined call ${item.id}`);
    }

    const fullLink = item.room_link.startsWith('http')
      ? item.room_link
      : `https://meet.jit.si/${item.room_link}#config.disableDeepLinking=true`;

    Linking.openURL(fullLink);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Scheduled Calls</Text>
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const content = (
            <>
              <Text style={styles.label}>Psychiatrist:</Text>
              <Text style={styles.value}>
                {item.psychiatrist?.name || 'N/A'} ({item.psychiatrist?.role || 'Unknown'})
              </Text>

              <Text style={styles.label}>Message:</Text>
              <Text style={styles.value}>{item.message}</Text>

              <Text style={styles.label}>Scheduled Time:</Text>
              <Text style={styles.value}>
                {item.scheduled_time
                  ? new Date(item.scheduled_time).toLocaleString()
                  : 'Not Scheduled'}
              </Text>

              {item.room_link ? (
                <Text style={styles.link}>Tap to Join Video Call</Text>
              ) : (
                <Text style={styles.pending}>Waiting for room link...</Text>
              )}
            </>
          );

          return item.room_link ? (
            <TouchableOpacity style={styles.card} onPress={() => handleJoinCall(item)}>
              {content}
            </TouchableOpacity>
          ) : (
            <View style={[styles.card, styles.disabledCard]}>{content}</View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No scheduled calls found.</Text>}
      />
    </View>
  );
};
export default UserScheduledCallScreen;

