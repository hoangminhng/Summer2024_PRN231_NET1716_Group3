import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = process.env.REACT_APP_BACK_END_URL;
const feAddress = process.env.REACT_APP_FRONT_END_URL;

export const registerMembership = async (
  accountId: number,
  membershipId: number,
  token: string
) => {
  var returnUrl = feAddress + '/paymentsucess';
  try {
    const param = { accountId, membershipId, returnUrl };
    const response = await axios.post(
      `${baseUrl}/api/memberships/register`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const extendMembership = async (
  accountId: number,
  membershipId: number,
  token: string
) => {
  var returnUrl = feAddress + '/paymentsucess';
  try {
    const param = { accountId, membershipId, returnUrl };
    const response = await axios.post(
      `${baseUrl}/api/memberships/extend`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const updateMembership = async (
  accountId: number,
  membershipId: number,
  token: string,
  fee: number
) => {
  var returnUrl = feAddress + '/paymentsucess';
  try {
    const param = { accountId, membershipId, returnUrl, fee };
    const response = await axios.post(
      `${baseUrl}/api/memberships/update`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const getOwnerCurrentActiveMembership = async (token: string) => {
  try {
    const fetchData = await axios.get<RegisterPackage>(
      `${baseUrl}/api/memberships/current-active`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const getOwnerMembershipHistory = async (token: string) => {
  try {
    const fetchData = await axios.get<RegisterPackage[]>(
      `${baseUrl}/api/memberships/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const response = fetchData.data;
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};
