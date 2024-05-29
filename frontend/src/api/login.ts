import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const loginByUsernamePassword = async (
  username: string,
  password: string
) => {
  const response = await axios.post(`${baseUrl}/api/login/username`, {
    username,
    password,
  });
  if (response.status !== 200) {
    new Error(`Error: ${response.status}`);
  }
  return response;
};

export const loginByEmailPassword = async (email: string, password: string) => {
  const response = await axios.post(`${baseUrl}/api/login`, {
    email,
    password,
  });
  if (response.status !== 200) {
    new Error(`Error: ${response.status}`);
  }
  return response;
};
