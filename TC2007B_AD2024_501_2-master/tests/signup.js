import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUp from './SignUp';
import { AuthContext } from '././authentication';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Mock the Firebase auth function
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

describe('SignUp Component', () => {
  const mockAuth = {}; // Mock authentication object

  it('should sign up a user with valid email and password', async () => {
    // Mock the resolved value of createUserWithEmailAndPassword
    const mockCreateUser = createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: 'test@example.com' },
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={{ auth: mockAuth }}>
        <SignUp />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByText('Sign Up');

    // Simulate user input
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    // Verify the createUserWithEmailAndPassword function was called correctly
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123');
    });
  });

  it('should show an alert for a weak password', async () => {
    // Mock the rejection of createUserWithEmailAndPassword for a weak password
    const mockCreateUser = createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: 'auth/weak-password',
      message: 'The password is too weak.',
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={{ auth: mockAuth }}>
        <SignUp />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByText('Sign Up');

    // Simulate user input
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(signUpButton);

    // Verify the alert is shown for a weak password
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('That password is too weak!');
    });
  });
});
