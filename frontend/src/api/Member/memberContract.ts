import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getMemberContract = async (ownerId: number, token: string) => {
  try {
    const fetchData = await axios.get<MemberViewContract[]>(
      `${baseUrl}/api/student/contracts/${ownerId}`,
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

export const getContractDetail = async (contractID: number, token: string) => {
  try {
    const fetchData = await axios.get<ContractDetail>(
      `${baseUrl}/api/contracts/getDetails/${contractID}`,
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
