import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getTypeServices = async () => {
  try {
    const fetchData = await axios.get<TypeService[]>(
      `${baseUrl}/api/type-services`,
      {
        headers: {
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
