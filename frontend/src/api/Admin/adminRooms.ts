import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getRooms = async (id: number, token: string) => {
    try {
      const fetchData = await axios.get<AdminRoom[]>(
        `${baseUrl}/api/admin/hostels/rooms/detail/${id}`,
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