import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../utils/supabaseClient';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) {
      Alert.alert('Error fetching profile');
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('email', profile.email);

    if (error) {
      Alert.alert('Error updating profile');
    } else {
      Alert.alert('Profile updated');
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Navigate to login screen if needed
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#A76545" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {['name', 'email', 'phone', 'age', 'gender', 'role'].map((field) => (
        <View key={field}>
          <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
          <TextInput
            style={styles.input}
            value={String(profile[field])}
            editable={editing && field !== 'email' && field !== 'role'}
            keyboardType={field === 'age' ? 'numeric' : 'default'}
            onChangeText={(text) =>
              setProfile({ ...profile, [field]: field === 'age' ? parseInt(text) : text })
            }
          />
        </View>
      ))}

      <View style={styles.buttonContainer}>
        {editing ? (
          <>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => setEditing(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.buttonPrimary} onPress={() => setEditing(true)}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.buttonDanger} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F3D9', // background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5A3B28', // text
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#5A3B28', // text
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF', // white
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    borderColor: '#E0D6C3', // border
    borderWidth: 1,
    marginTop: 5,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  buttonPrimary: {
    backgroundColor: '#A76545', // primary
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#D8BFAA', // accent
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonDanger: {
    backgroundColor: '#D9534F', // danger
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF', // white
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
