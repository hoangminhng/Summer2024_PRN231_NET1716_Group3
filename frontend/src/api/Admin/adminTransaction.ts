import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getTransactions = async (token: string) => {
  try {
    const fetchData = await axios.get<TransactionMembership[]>(
      `${baseUrl}/api/admin/transactions`,
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
