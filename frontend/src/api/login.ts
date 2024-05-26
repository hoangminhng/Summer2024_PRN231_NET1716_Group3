import baseUrl from "./api";

export const loginByUsernamePassword = async (
  email: string,
  password: string
) => {
  const response = await baseUrl.post("/api/login", { email, password });
  if (response.status !== 200) {
    new Error(`Error: ${response.status}`);
  }
  return response;
};
