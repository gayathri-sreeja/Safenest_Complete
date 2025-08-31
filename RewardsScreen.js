import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { supabase } from '../utils/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';

// Import icons
import ScoreIcon from '../design/icons/score.png';
import LevelIcon from '../design/icons/level.png';
import BadgeIcon from '../design/icons/badge.png';

const RewardsScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plantKey, setPlantKey] = useState(0); // To replay animation

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('score, level, badge, plants')
        .eq('id', userId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const getPlantAnimation = (score) => {
    if (score < 1) return null;
    if (score < 3) return require('../assets/plants/plant-1.json');
    if (score < 6) return require('../assets/plants/plant-2.json');
    if (score < 9) return require('../assets/plants/plant-3.json');
    if (score < 12) return require('../assets/plants/plant-4.json');
    return require('../assets/plants/plant-5.json');
  };

  const updateProfile = async (score, plants, userId) => {
    let level = 'Beginner';
    let badge = 'Newcomer';

    if (score >= 3 && score < 6) {
      level = 'Intermediate';
      badge = 'Novice';
    } else if (score >= 6 && score < 9) {
      level = 'Advanced';
      badge = 'Pro';
    } else if (score >= 9) {
      level = 'Expert';
      badge = 'Master';
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ level, badge, score, plants })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error.message);
      return;
    }

    setProfile((prev) => ({
      ...prev,
      level,
      badge,
      score,
      plants,
    }));

    console.log('Profile updated successfully:', data);
  };

  const handleHarvest = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) return;

    if ((profile?.score || 0) < 12) {
      Alert.alert("Plant Not Ready", "🌱 Your plant isn't ready to be harvested yet. Keep going!");
      return;
    }

    const newPlantCount = (profile?.plants || 0) + 1;
    const newScore = 0;

    await updateProfile(newScore, newPlantCount, userId);
    Alert.alert('Success', '🎉 Plant harvested successfully!');
  };

  const handleReplayAnimation = () => {
    setPlantKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD166" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const animation = getPlantAnimation(profile?.score || 0);

  return (
    <LinearGradient colors={['#FFF0F5', '#FFE8D6']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>🌱 Your Rewards</Text>

        <View style={[styles.rewardCard, { backgroundColor: '#E8F3C1' }]}>
          <View style={styles.cardContent}>
            <Image source={ScoreIcon} style={styles.icon} />
            <View>
              <Text style={styles.rewardLabel}>Score</Text>
              <Text style={styles.rewardValue}>{profile?.score ?? 0}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.rewardCard, { backgroundColor: '#DDEB9D' }]}>
          <View style={styles.cardContent}>
            <Image source={LevelIcon} style={styles.icon} />
            <View>
              <Text style={styles.rewardLabel}>Level</Text>
              <Text style={styles.rewardValue}>{profile?.level ?? 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.rewardCard, { backgroundColor: '#C6D38D' }]}>
          <View style={styles.cardContent}>
            <Image source={BadgeIcon} style={styles.icon} />
            <View>
              <Text style={styles.rewardLabel}>Badge</Text>
              <Text style={styles.rewardValue}>{profile?.badge ?? 'None'}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.rewardCard, { backgroundColor: '#B0BC7D' }]}>
          <View style={styles.cardContent}>
            <Text style={[styles.icon, { fontSize: 28 }]}>🌱</Text>
            <View>
              <Text style={styles.rewardLabel}>Plants Grown</Text>
              <Text style={styles.rewardValue}>{profile?.plants ?? 0}</Text>
            </View>
          </View>
        </View>

        <View style={styles.plantContainer}>
          <Text style={styles.plantLabel}>Your Plant Growth</Text>
          {animation ? (
            <TouchableOpacity onPress={handleReplayAnimation}>
              <LottieView
                key={plantKey}
                source={animation}
                autoPlay
                loop={false}
                style={styles.lottie}
              />
            </TouchableOpacity>
          ) : (
            <Text style={styles.seedText}>🌱 Plant a seed and start your journey!</Text>
          )}
          <TouchableOpacity style={styles.harvestButton} onPress={handleHarvest}>
            <Text style={styles.harvestText}>🌾 Harvest Plant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 25,
    textAlign: 'center',
  },
  rewardCard: {
    width: '80%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 42,
    height: 42,
    marginRight: 12,
  },
  rewardLabel: {
    fontSize: 20,
    color: '#555',
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  plantContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  plantLabel: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  lottie: {
    width: 220,
    height: 220,
  },
  seedText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#555',
    marginVertical: 20,
  },
  harvestButton: {
    backgroundColor: '#FFD166',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  harvestText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default RewardsScreen;
