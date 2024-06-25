import axios from 'axios';
import toast from 'react-hot-toast';
import api from './api';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const loginByUsernamePassword = async (
  username: string,
  password: string
) => {
  try {
    const param = { username, password };
    const response = await axios.post(`${baseUrl}/api/login/username`, param);
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const loginByEmailPassword = async (
  email: string,
  password: string,
  firebaseRegisterToken: string
) => {
  try {
    const param = { email, password, firebaseRegisterToken };
    const response = await axios.post(`${baseUrl}/api/login`, param);
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const checkIsAuth = async (token: string) => {
  try {
    const response = await axios.get(`${baseUrl}/api/check/token/expire`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return true;
  } catch {
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('token');
    const param = { accessToken, refreshToken };
    const response = await api.post('/api/refresh-token', { param });
    const { token } = response.data.token;

    return token;
  } catch (error) {
    // Handle refresh token error or redirect to login
  }
};
