import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getOwnerContract = async (ownerId: number, token: string) => {
  try {
    const fetchData = await axios.get<ViewContract[]>(
      `${baseUrl}/api/owner/contracts/${ownerId}`,
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

export const getUserAppointmentOwnerContract = async (roomID: number, token: string) => {
  try {
    const fetchData = await axios.get<UserAppointmentContract>(
      `${baseUrl}/api/owner/appointment/details/${roomID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error : any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      throw new Error(error.message || "Unknown error occurred");
    }
  }
};

export const getOldElectricAndWaterNumberOwnerContract = async (roomID: number, token: string) => {
  try {
    const fetchData = await axios.get<ServiceNumber>(
      `${baseUrl}/api/owner/get-old-number-electric-and-water/${roomID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error : any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      throw new Error(error.message || "Unknown error occurred");
    }
  }
};

export const createContract = async (contract: CreateContract, token: string) => {
  try {
    const fetchData = await axios.post<CreateContract>(
      `${baseUrl}/api/owner/contract/create`,
      contract,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error : any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      throw new Error(error.message || "Unknown error occurred");
    }
  }
};