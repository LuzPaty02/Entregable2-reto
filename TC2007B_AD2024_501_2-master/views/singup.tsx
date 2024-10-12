import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '././authentication';
import { getAuth } from 'firebase/auth';

const SignUp = () => {
  const authContext = useContext(AuthContext);
  const auth = authContext ? authContext.auth : getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed up: " + userCredential.user.email);
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("That password is too weak!");
        }
        console.log("Error: " + error.message);
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