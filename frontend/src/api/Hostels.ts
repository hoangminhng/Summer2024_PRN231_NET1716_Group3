import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const GetHostelCard = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/hostels`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
