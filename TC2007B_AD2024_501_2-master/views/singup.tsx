import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from './authentication';
import { getAuth } from 'firebase/auth';

const SignUp = () => {
  const authContext = useContext(AuthContext);
  const auth = authContext ? authContext.auth : getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    if (!email) {
      Alert.alert("Error", "Email is required!");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email format!");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Password is required!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long!");
      return;
    }

    // Let Firebase handle further validation like weak password, already registered, etc.
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed up: " + userCredential.user.email);
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          Alert.alert("Error", "That password is too weak!");
        } else if (error.code === "auth/email-already-in-use") {
          Alert.alert("Error", "This email is already registered!");
        } else {
          Alert.alert("Error", error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text>Sign Up</Text>
      <TextInput
        style={styles.inputField}
        keyboardType="email-address"
        placeholder="Correo"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inputField: {
    margin: 5,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    width: 200,
    borderColor: 'grey',
  },
});

export default SignUp;
