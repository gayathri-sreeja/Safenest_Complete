import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../utils/supabaseClient';
import moment from 'moment';
import styles from '../styles/dailyChallengeStyle';

const DailyChallengeScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState('');
  const [target, setTarget] = useState('');
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setUserId(data.user?.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchChallenges();
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('realtime:challenges')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges',
          filter: `userid=eq.${userId}`,
        },
        () => fetchChallenges()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchChallenges = async () => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('userid', userId)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching challenges:', error.message);
    } else {
      setChallenges(data);
    }
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('score, level, badge')
      .eq('id', userId)
      .single();

    if (error?.message?.includes('no rows')) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, score: 0, level: 0, badge: '' }]);

      if (insertError) {
        console.error('Error creating profile:', insertError.message);
        setLoadingProfile(false);
        return;
      }

      setProfile({ score: 0, level: 0, badge: '' });
    } else if (error) {
      console.error('Error fetching profile:', error.message);
    } else {
      setProfile(data);
    }

    setLoadingProfile(false);
  };

  const updateScore = async (newScore) => {
    const newLevel = Math.floor(newScore / 10);
    let newBadge = '';
    if (newScore >= 100) newBadge = 'Master';
    else if (newScore >= 50) newBadge = 'Expert';
    else if (newScore >= 25) newBadge = 'Intermediate';
    else if (newScore >= 10) newBadge = 'Beginner';
    else newBadge = 'Novice';

    const { error } = await supabase
      .from('profiles')
      .update({
        score: newScore,
        level: newLevel,
        badge: newBadge,
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating score:', error.message);
      Alert.alert('Error', 'There was an issue updating your score.');
    } else {
      setProfile({ score: newScore, level: newLevel, badge: newBadge });
    }
  };

  const addChallenge = async () => {
    if (!newChallenge.trim()) return;

    const { error } = await supabase.from('challenges').insert({
      userid: userId,
      challenge: newChallenge,
      target: target || null,
      streak: 0,
      lastcompleteddate: null,
    });

    if (error) {
      console.error('Error adding challenge:', error.message);
      Alert.alert('Error', 'There was an issue adding the challenge.');
    } else {
      setNewChallenge('');
      setTarget('');
      fetchChallenges();
    }
  };

  const toggleComplete = async (challenge) => {
    const today = moment().format('YYYY-MM-DD');
    const lastCompleted = challenge.lastcompleteddate
      ? moment(challenge.lastcompleteddate).format('YYYY-MM-DD')
      : null;

    if (lastCompleted === today) {
      Alert.alert('Already completed', 'You have already completed this challenge today.');
      return;
    }

    // Increase the streak by 1
    let newStreak = challenge.streak + 1;

    const updatedChallenges = challenges.map((item) =>
      item.id === challenge.id
        ? { ...item, streak: newStreak, lastcompleteddate: today }
        : item
    );
    setChallenges(updatedChallenges);

    const { error: updateError } = await supabase
      .from('challenges')
      .update({ lastcompleteddate: today, streak: newStreak })
      .eq('id', challenge.id);

    if (updateError) {
      console.error('Error updating challenge:', updateError.message);
      Alert.alert('Error', 'There was an issue updating the challenge.');
      return;
    }

    // Update the score by 1
    const newScore = profile.score + 1;
    await updateScore(newScore);

    fetchProfile();
  };

  const deleteChallenge = async (id) => {
    const { error } = await supabase.from('challenges').delete().eq('id', id);
    if (error) {
      console.error('Error deleting challenge:', error.message);
      Alert.alert('Error', 'There was an issue deleting the challenge.');
    } else {
      fetchChallenges();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.challengeItem}>
      <Text style={styles.challengeText}>{item.challenge}</Text>
      <Text>Streak: {item.streak}</Text>
      <Text>Target: {item.target || 'N/A'}</Text>
      <Text>Last Done: {item.lastcompleteddate || 'Never'}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.challengeItemButton}
          onPress={() => toggleComplete(item)}
        >
          <Text style={styles.challengeItemButtonText}>Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.challengeItemButton}
          onPress={() => deleteChallenge(item.id)}
        >
          <Text style={[styles.challengeItemButtonText, { color: 'red' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loadingProfile || profile === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD166" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.header}>Daily Challenges</Text>

      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Your current level: {profile.level}</Text>
        <Text style={styles.scoreText}>Score: {profile.score}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{profile.badge || 'No Badge'}</Text>
        </View>
      </View>

      <FlatList
        data={challenges}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <TextInput
        style={styles.input}
        placeholder="New challenge"
        value={newChallenge}
        onChangeText={setNewChallenge}
      />
      <TextInput
        style={styles.input}
        placeholder="Target (optional)"
        value={target}
        onChangeText={setTarget}
      />
      <TouchableOpacity style={styles.addButton} onPress={addChallenge}>
        <Text style={styles.addButtonText}>Add Challenge</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('QuizScreen')}
      >
        <Text style={styles.addButtonText}>Get Personalized Challenges</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default DailyChallengeScreen;
