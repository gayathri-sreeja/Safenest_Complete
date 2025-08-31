import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from "react-native";
import { ref, set, push } from "firebase/database";
import { auth, db } from "../utils/firebaseConfig";

const TrustedContactsScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contacts, setContacts] = useState([]);

  const addContact = async () => {
    if (!name || !phone) {
      Alert.alert("Please enter both name and phone");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("User not authenticated");
      return;
    }

    const newContact = { name, phone };
    setContacts((prev) => [...prev, newContact]);

    try {
      const userContactsRef = ref(db, `trusted_contacts/${user.uid}`);
      const newContactRef = push(userContactsRef);
      await set(newContactRef, newContact);

      setName("");
      setPhone("");
      Alert.alert("Contact saved successfully!");
    } catch (error) {
      Alert.alert("Error saving contact", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Trusted Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Contact Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="Add Contact" onPress={addContact} />

      <Text style={styles.subheading}>Saved Contacts:</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => `${item.phone}_${index}`}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.phone}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subheading: { fontSize: 18, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default TrustedContactsScreen;
