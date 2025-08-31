import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import { database } from '../utils/firebaseConfig';
import { ref, set, onValue } from 'firebase/database';
import { supabase } from '../utils/supabaseClient';
import SOSStyle from '../styles/SOSStyle';

const SOSScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState('');
  const [locationWatcher, setLocationWatcher] = useState(null);
  const [userId, setUserId] = useState(null);
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        loadContactsFromFirebase(data.user.id);
      } else {
        console.log('Error fetching Supabase user:', error);
      }
    };
    fetchUser();
  }, []);

  const loadContactsFromFirebase = (uid) => {
    const contactsRef = ref(database, `trusted_contacts/${uid}`);
    onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Array.isArray(data)) {
        setContacts(data);
      }
    });
  };

  const saveContactsToFirebase = async (updatedContacts) => {
    if (!userId) return;
    await set(ref(database, `trusted_contacts/${userId}`), updatedContacts);
  };

  const addContact = () => {
    if (newContact.trim() !== '' && validatePhoneNumber(newContact.trim())) {
      const updated = [...contacts, newContact.trim()];
      setContacts(updated);
      saveContactsToFirebase(updated);
      setNewContact('');
    } else {
      Alert.alert('Invalid Contact', 'Please enter a valid 10-digit phone number.');
    }
  };

  const removeContact = (index) => {
    const updated = [...contacts];
    updated.splice(index, 1);
    setContacts(updated);
    saveContactsToFirebase(updated);
  };

  const validatePhoneNumber = (number) => /^[0-9]{10}$/.test(number);

  const sendSOS = async () => {
    if (!userId) {
      Alert.alert('User not authenticated');
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    let locationData = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = locationData.coords;

    await set(ref(database, `live_locations/${userId}`), {
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    });

    const watcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        setLocation({ latitude, longitude });
        set(ref(database, `live_locations/${userId}`), {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        });
      }
    );

    setLocationWatcher(watcher);
    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const message = `🚨 I need help! SOS alert.\nLive location: ${locationUrl}\nTrack: https://safenest-6d30a.web.app?id=${userId}`;
    const phoneNumbers = contacts.join(',');
    const smsUrl = `sms:${phoneNumbers}?body=${encodeURIComponent(message)}`;

    Linking.openURL(smsUrl).catch((err) =>
      Alert.alert('Error', 'Could not open SMS app: ' + err.message)
    );

    setTimeout(() => {
      Linking.openURL('tel:+91100');
    }, 3000);

    setTracking(true);
  };

  const stopTracking = () => {
    if (locationWatcher) {
      locationWatcher.remove();
      setLocationWatcher(null);
      setTracking(false);
      console.log('Tracking stopped');
    }
  };

  useEffect(() => {
    return () => {
      if (locationWatcher) locationWatcher.remove();
    };
  }, [locationWatcher]);

  return (
    <View style={SOSStyle.container}>
      <Text style={SOSStyle.title}>Trusted Contacts</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={SOSStyle.contactItem}>
            <Text style={SOSStyle.contactText}>{item}</Text>
            <TouchableOpacity onPress={() => removeContact(index)}>
              <Text style={SOSStyle.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={SOSStyle.sosButton}
        onPress={sendSOS}
        disabled={contacts.length === 0}
      >
        <Text style={SOSStyle.sosButtonText}>Send SOS</Text>
      </TouchableOpacity>

      <TextInput
        style={SOSStyle.input}
        placeholder="Add contact number"
        keyboardType="phone-pad"
        value={newContact}
        onChangeText={setNewContact}
      />
      <TouchableOpacity style={SOSStyle.addButton} onPress={addContact}>
        <Text style={SOSStyle.addButtonText}>Add Contact</Text>
      </TouchableOpacity>

      {tracking && (
        <TouchableOpacity style={SOSStyle.stopButton} onPress={stopTracking}>
          <Text style={SOSStyle.stopButtonText}>Stop Tracking</Text>
        </TouchableOpacity>
      )}

      <View style={SOSStyle.locationContainer}>
        {location && (
          <Text style={SOSStyle.locationText}>
            Current Location: Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SOSScreen;
