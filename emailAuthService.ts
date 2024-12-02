import { User } from '../types';
import { AuthResponse } from '../types/auth';
import { getUsers, saveUsers, saveVerificationCode, getVerificationCode, removeVerificationCode } from '../utils/storage';
import { persistUser } from '../utils/auth';
import { validateEmail, validatePassword, validateName } from '../utils/validation';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  if (!validateEmail(email) || !validatePassword(password)) {
    return { success: false, error: 'Invalid email or password format' };
  }

  const users = getUsers();
  const user = users[email.toLowerCase()];

  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid email or password' };
  }

  const { password: _, ...userWithoutPassword } = user;
  persistUser(userWithoutPassword);
  return { success: true, user: userWithoutPassword };
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  if (!validateName(name)) {
    return { success: false, error: 'Name must be at least 2 characters long' };
  }
  if (!validateEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }
  if (!validatePassword(password)) {
    return { success: false, error: 'Password must be at least 8 characters long' };
  }

  const users = getUsers();
  const lowerEmail = email.toLowerCase();

  if (users[lowerEmail]) {
    return { success: false, error: 'Email already registered' };
  }

  users[lowerEmail] = {
    name,
    email: lowerEmail,
    password,
    verified: false,
    hasSurvey: false,
  };

  saveUsers(users);
  await sendVerificationEmail(lowerEmail);
  return { success: true };
};

export const sendVerificationEmail = async (email: string): Promise<void> => {
  const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  saveVerificationCode(email, verificationCode);
  console.log(`Verification code for ${email}: ${verificationCode}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const verifyEmail = async (email: string, code: string): Promise<AuthResponse> => {
  const storedCode = getVerificationCode(email);
  
  if (!storedCode || storedCode !== code) {
    return { success: false, error: 'Invalid verification code' };
  }

  const users = getUsers();
  const user = users[email.toLowerCase()];
  
  if (user) {
    user.verified = true;
    saveUsers(users);
    removeVerificationCode(email);
    return { success: true, user };
  }

  return { success: false, error: 'User not found' };
};