import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUp from '../views/singup';
import { AuthContext } from '../views/authentication';
import { createUserWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'test-uid', email: 'test@example.com' }
  })),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => callback(null)),
}));

describe('SignUp Component', () => {
  const mockAuth = {}; 

  beforeAll(() => {
    global.alert = jest.fn();  
  });

  it('should sign up a user with valid email and password', async () => {
    const mockCreateUser = createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: 'test@example.com' },
    });

    const { getByPlaceholderText, getByRole } = render(
      <AuthContext.Provider value={{ auth: mockAuth }}>
        <SignUp />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Correo');
    const passwordInput = getByPlaceholderText('Contraseña');
    const signUpButton = getByRole('button', { name: /Sign Up/i });


    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123');
    });
  });

  it('should show an alert for a weak password', async () => {
    const mockCreateUser = createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: 'auth/weak-password',
      message: 'The password is too weak.',
    });

    const { getByPlaceholderText, getByRole } = render(
      <AuthContext.Provider value={{ auth: mockAuth }}>
        <SignUp />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Correo');
    const passwordInput = getByPlaceholderText('Contraseña');
    const signUpButton = getByRole('button', { name: /Sign Up/i });

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('That password is too weak!');
    });
  });
});