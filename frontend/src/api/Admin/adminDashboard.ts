import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getStatistic = async (token: string) => {
  try {
    const fetchData = await axios.get<Dashboard>(
      `${baseUrl}/api/admin/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error) {
    console.log("Error: " + error);
  }
};