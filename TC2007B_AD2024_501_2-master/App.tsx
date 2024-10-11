import React from 'react';
import { View, StyleSheet } from 'react-native';
import Authentication from '././views/authentication';
import SignUp from './views/singup';

export default function App() {
  return (
    <Authentication>
      <View style={styles.container}>
        <SignUp />
      </View>
    </Authentication>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
