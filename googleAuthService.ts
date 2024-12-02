import { User } from '../types';
import { GoogleUser } from '../types/auth';
import { getUsers, saveUsers } from '../utils/storage';
import { persistUser } from '../utils/auth';

export const handleGoogleLogin = async (accessToken: string): Promise<User> => {
  try {
    const userInfo = await fetchGoogleUserInfo(accessToken);
    return processGoogleUser(userInfo);
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error('Failed to process Google login');
  }
};

const fetchGoogleUserInfo = async (accessToken: string): Promise<GoogleUser> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Google user info');
  }
  
  const data = await response.json();
  
  if (!data.email) {
    throw new Error('No email provided by Google');
  }
  
  return {
    email: data.email,
    name: data.name,
    picture: data.picture,
  };
};

const processGoogleUser = (googleUser: GoogleUser): User => {
  const users = getUsers();
  const lowerEmail = googleUser.email.toLowerCase();
  
  if (!users[lowerEmail]) {
    users[lowerEmail] = {
      name: googleUser.name,
      email: lowerEmail,
      verified: true,
      hasSurvey: false,
    };
    saveUsers(users);
  }

  const user = users[lowerEmail];
  persistUser(user);
  return user;
};