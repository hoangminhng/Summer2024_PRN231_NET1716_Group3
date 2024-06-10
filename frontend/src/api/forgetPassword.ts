import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const confirmPassword = async (
  email: string,
  newPassword: string,
  otpToken: string
) => {
  try {
    const param = { email, newPassword, otpToken };
    const response = await axios.post(`${baseUrl}/api/confirm/password`, param);
    return response;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const sendOtpForgetPassword = async (email: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/forget/password?email=${email}`
    );
    return response;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message, { duration: 2000 });
  }
};
