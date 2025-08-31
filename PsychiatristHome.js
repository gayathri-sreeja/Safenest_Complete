import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { supabase } from '../utils/supabaseClient';

const { width } = Dimensions.get('window');

const PsychiatristHome = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

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
  }, []);

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
      <ScrollView contentContainerStyle={{ backgroundColor: '#F8F3D9' }}>
        <View style={{ position: 'relative' }}>
          {renderGradientWave()}
          {renderBrownWave()}
          <Image
            source={require('../design/icons/safenest-logo.png')}
            style={styles.logo}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Welcome to SafeNest </Text>
            <Text style={styles.subHeaderText}>
              {userName ? `Hello, Dr. ${userName}` : 'Loading...'}
            </Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ScheduleCallScreen')}
          >
            <Text style={styles.buttonText}>View Scheduled Calls</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PsychiatristHome;

const COLORS = {
  background: '#F8F3D9',
  primary: '#A76545',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logo: {
    position: 'absolute',
    top: 25,
    left: 5,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    zIndex: 2,
  },
  headerTextContainer: {
    position: 'absolute',
    top: 40,
    left: 100,
    right: 10,
    zIndex: 1,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'Tagesschrift',
  },
  subHeaderText: {
    fontSize: 20,
    color: COLORS.primary,
    marginTop: 2,
  },
  bodyContainer: {
    padding: 24,
    marginTop: 200,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#A76545', // Changed to primary color for button
    paddingVertical: 18, // Increased padding for a bigger button
    paddingHorizontal: 40,
    borderRadius: 15,
    width: width * 0.8, // 80% of screen width for larger button
    alignItems: 'center',
    elevation: 3, // Shadow effect for the button
    marginTop:'-100'
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18, // Larger font size for button text
  },
});
