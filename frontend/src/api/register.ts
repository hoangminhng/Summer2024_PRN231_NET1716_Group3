import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const registerByEmailPassword = async (
  email: string,
  roleId: number,
  name: string,
  password: string,
  phone: string,
  address: string,
  citizenCard: string
) => {
  try {
    const param = {
      email,
      roleId,
      name,
      password,
      phone,
      address,
      citizenCard,
    };
    const response = await axios.post(`${baseUrl}/api/register/email`, param);
    return response;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const confirmRegisterOtp = async (email: string, otpToken: string) => {
  try {
    const param = { email, otpToken };
    const response = await axios.post(`${baseUrl}/api/otp/confirm`, param);
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const resendRegisterOtp = async (email: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/otp/resend?email=${email}`
    );
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};
