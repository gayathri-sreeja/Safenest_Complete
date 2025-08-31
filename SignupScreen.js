import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { signUp } from '../utils/authService';
import styles from '../styles/SignupStyle';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('user'); // default

  const handleSignup = async () => {
    const metaData = { name, phone, age, gender, role };
    console.log('Metadata being sent to Supabase:', metaData);

    const { data, error } = await signUp(email, password, metaData);

    if (error) {
      Alert.alert('Signup Error', error.message);
    } else {
      Alert.alert('Signup Successful', 'Please verify your email');
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />
      <TextInput
        placeholder="Name"
        onChangeText={setName}
        value={name}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        onChangeText={setPhone}
        value={phone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Age"
        onChangeText={setAge}
        value={age}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Gender"
        onChangeText={setGender}
        value={gender}
        style={styles.input}
      />

      <Text style={styles.label}>Select Role</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Psychiatrist" value="psychiatrist" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
