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

export const GetHostelDetail = async (hostelID: string | undefined) => {
  try {
    const response = await axios.get(`${baseUrl}/api/hostels/${hostelID}`);
    return response;
  } catch (error: any) {
    console.log(error);
  }
};
