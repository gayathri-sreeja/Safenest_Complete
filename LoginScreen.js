import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import { signIn, fetchProfileByEmail } from '../utils/authService';
import styles from '../styles/loginstyle';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data: authData, error: authError } = await signIn(email, password);

    if (authError) {
      Alert.alert('Login Error', authError.message);
      return;
    }

    if (!authData.user.email_confirmed_at) {
      Alert.alert('Email not confirmed');
      return;
    }

    const { data: profile, error: profileError } = await fetchProfileByEmail(email);

    if (profileError || !profile) {
      Alert.alert('Login Error', 'User profile not found');
      return;
    }

    if (profile.role === 'user') {
      navigation.navigate('Drawer'); // ✅ Navigate to the Drawer, not UserHome directly
    } else if (profile.role === 'psychiatrist') {
      navigation.navigate('PsychiatristHome');
    } else {
      Alert.alert('Login Error', 'Unknown user role');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} style={styles.input} />
      
      {/* Custom Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}
