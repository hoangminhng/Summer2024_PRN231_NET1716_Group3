import axios from "axios";
const baseUrl = process.env.REACT_APP_BACK_END_URL;

export const getAccounts = async (token: string) => {
  try {
    const fetchData = await axios.get<Account[]>(
      `${baseUrl}/api/admin/accounts`,
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

export const changeStatusBlockAccounts = async (token: string, accountID : number | undefined) => {
  try {
    const param = {
      accountID
    };
    const fetchData = await axios.put(
      `${baseUrl}/api/admin/account/block/${accountID}`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData;
    return response;
  } catch (error) {
    console.log("Error: " + error);
  }
};

export const DeleteAccount = async (token: string, accountID : number) => {
  try {
    const fetchData = await axios.delete(
      `${baseUrl}/api/admin/accounts/detail/delete/${accountID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData;
    return response;
  } catch (error : any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      throw new Error(error.message || "Unknown error occurred");
    }
  }
};

export const changeStatusActiveAccounts = async (token: string, accountId : number | undefined) => {
  try {
    const param = {
      accountId
    };
    const fetchData = await axios.put(
      `${baseUrl}/api/admin/account/active/${accountId}`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = fetchData;
    return response;
  } catch (error) {
    console.log("Error: " + error);
  }
};

export const getAccountDetail = async (id: number,token: string) => {
  try {
    const fetchData = await axios.get<AccountDetail>(
      `${baseUrl}/api/admin/accounts/detail/${id}`,
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
}

export const getMemberShips = async (token: string) => {
  try {
    const fetchData = await axios.get<MemberShip[]>(
      `${baseUrl}/api/admin/memberships`,
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

export const getMemberShipDetail = async (id: number, token: string) => {
  try {
    const fetchData = await axios.get<MemberShipDetail[]>(
      `${baseUrl}/api/admin/memberships/detail/${id}`,
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

export const getMemberShipInformationDetail = async (id: number, token: string) => {
  try {
    const fetchData = await axios.get<MemberShipInformation>(
      `${baseUrl}/api/admin/memberships/detail/information/${id}`,
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