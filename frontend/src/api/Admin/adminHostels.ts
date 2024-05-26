import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getHostel = async (token: string) => {
    try {
      const fetchData = await axios.get<AdminHostel[]>(
        `${baseUrl}/api/admin/hostels`,
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
  
  export const getHostelDetail = async (id: number, token: string) => {
    try {
      const fetchData = await axios.get<AdminHostelDetail>(
        `${baseUrl}/api/admin/hostels/detail/${id}`,
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