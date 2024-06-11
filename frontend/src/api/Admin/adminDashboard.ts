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


export const getStatisticPackage = async (token: string) => {
  try {
    const fetchData = await axios.get<TypePackage[]>(
      `${baseUrl}/api/admin/dashboard/typepackage`,
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

export const getStatisticProfit = async (token: string, year: number) => {
  try {
    const fetchData = await axios.get<TypeMonth[]>(
      `${baseUrl}/api/admin/dashboard/typemonth?year=${year}`,
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

export const getStatisticAccount = async (token: string, year: number) => {
  try {
    const fetchData = await axios.get<AccountMonth[]>(
      `${baseUrl}/api/admin/dashboard/accountmonth?year=${year}`,
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