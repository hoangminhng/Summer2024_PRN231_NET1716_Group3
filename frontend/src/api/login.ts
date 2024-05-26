import api from "./api";

export const loginByUsernamePassword = async (
  email: string,
  password: string
) => {
  try {
    const response = await api.post("/api/login", { email, password });
    return response;
  } catch (error) {
    console.log(error);
  }
};
