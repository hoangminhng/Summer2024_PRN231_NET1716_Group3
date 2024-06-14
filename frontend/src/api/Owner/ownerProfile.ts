import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getOwnerProfle = async (accountID: number, token: string) => {
  try {
    const fetchData = await axios.get<Profile>(
      `${baseUrl}/api/owner/profile/${accountID}`,
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

export const getMemberProfle = async (accountID: number, token: string) => {
  try {
    const fetchData = await axios.get<AccountDetail>(
      `${baseUrl}/api/member/profile/${accountID}`,
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

export const getOwnerProfleDetail = async (accountID: number, token: string) => {
  try {
    const fetchData = await axios.get<AccountDetail>(
      `${baseUrl}/api/owner/profile/detail/${accountID}`,
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

export const getOldPassword = async (accountPassword: AccountPassword, token: string) => {
  try {
    const fetchData = await axios.post<AccountPassword>(
      `${baseUrl}/api/owner/password/get-old-password`,
      accountPassword,
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

export const getMemberOldPassword = async (accountPassword: AccountPassword, token: string) => {
  try {
    const fetchData = await axios.post<AccountPassword>(
      `${baseUrl}/api/member/password/get-old-password`,
      accountPassword,
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

export const updateOwnerPassword = async (accountPassword: AccountPassword, token: string) => {
  try {
    const fetchData = await axios.post<AccountPassword>(
      `${baseUrl}/api/owner/password/update`,
      accountPassword,
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

export const updateMemberPassword = async (accountPassword: AccountPassword, token: string) => {
  try {
    const fetchData = await axios.post<AccountPassword>(
      `${baseUrl}/api/member/password/update`,
      accountPassword,
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

export const updateOwnerProfile = async (account: AccountUpdate, token: string) => {
  try {
    const fetchData = await axios.post<AccountUpdate>(
      `${baseUrl}/api/owner/profile/update`,
      account,
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

export const updateMemberProfile = async (account: AccountUpdate, token: string) => {
  try {
    const fetchData = await axios.post<AccountUpdate>(
      `${baseUrl}/api/member/profile/update`,
      account,
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