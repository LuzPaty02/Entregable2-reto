import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUp from '../views/singup';
import { AuthContext } from '../views/authentication';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Alert } from 'react-native';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'test-uid', email: 'test@example.com' }
  })),
  createUserWithEmailAndPassword: jest.fn(), // Mocking this function
  onAuthStateChanged: jest.fn((auth, callback) => callback(null)),
}));

describe('SignUp Component', () => {
  const mockAuth = {};

  beforeAll(() => {
    // Mock Alert.alert
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  // Test case 1: Successful sign-up
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

  // Test case 2: Weak password
  it('should show an alert for a weak password', async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce({
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
    fireEvent.changeText(passwordInput, 'weakpassword'); // Weak password
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'That password is too weak!');
    });
  });

  // Test case 3: Missing email input
  it('should display alert for missing email input', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <AuthContext.Provider value={{ auth: mockAuth }}>
        <SignUp />
      </AuthContext.Provider>
    );

    const passwordInput = getByPlaceholderText('Contraseña');
    const signUpButton = getByRole('button', { name: /Sign Up/i });

    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Email is required!');
    });
  });

  // Test case 4: Missing password input
  it('should display alert for missing password input', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <AuthContext.Provider value={{ auth: mockAuth }}>
        <SignUp />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Correo');
    const signUpButton = getByRole('button', { name: /Sign Up/i });

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Password is required!');
    });
  });

  // Test case 5: Invalid email format
  it('should display alert for invalid email format', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <AuthContext.Provider value={{ auth: mockAuth }}>
        <SignUp />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Correo');
    const passwordInput = getByPlaceholderText('Contraseña');
    const signUpButton = getByRole('button', { name: /Sign Up/i });

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid email format!');
    });
  });

  // Test case 6: Password shorter than 6 characters
  it('should display alert for password shorter than 6 characters', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <AuthContext.Provider value={{ auth: mockAuth }}>
        <SignUp />
      </AuthContext.Provider>
    );

    const emailInput = getByPlaceholderText('Correo');
    const passwordInput = getByPlaceholderText('Contraseña');
    const signUpButton = getByRole('button', { name: /Sign Up/i });

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '123'); // Short password
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Password must be at least 6 characters long!');
    });
  });

  // Test case 7: Already registered email
  it('should display alert for already registered email', async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: 'auth/email-already-in-use',
      message: 'The email address is already in use by another account.',
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
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'This email is already registered!');
    });
  });

  // Test case 8: Invalid email format (before Firebase is called)
  it('should display alert when email format is invalid before calling Firebase', async () => {
    // Mock createUserWithEmailAndPassword, though it should not be called here
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

    fireEvent.changeText(emailInput, 'invalid-email'); // Invalid email format
    fireEvent.changeText(passwordInput, 'validPassword123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      // Ensure Firebase was never called due to email validation failing
      expect(mockCreateUser).not.toHaveBeenCalled();
      // Expect the correct alert to be shown
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid email format!');
    });
  });
});
