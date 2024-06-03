import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const registerByEmailPassword = async (
  email: string,
  roleId: number,
  name: string,
  password: string
) => {
  try {
    const param = { email, roleId, name, password };
    const response = await axios.post(`${baseUrl}/api/register/email`, param);
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};
