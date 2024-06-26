import axios from "axios";
import toast from "react-hot-toast";
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

export const loginByEmailPassword = async (email: string, password: string, firebaseRegisterToken: string) => {
  try {
    const param = { email, password, firebaseRegisterToken };
    const response = await axios.post(`${baseUrl}/api/login`, param);
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};
