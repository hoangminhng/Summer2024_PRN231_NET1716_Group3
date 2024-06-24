import axios from 'axios';
import toast from 'react-hot-toast';
const baseUrl = process.env.REACT_APP_BACK_END_URL;
const feAddress = process.env.REACT_APP_FRONT_END_URL;

export const payDeposit = async (contractId: number, token: string) => {
  var returnUrl = feAddress + '/paymentsucess';
  try {
    const param = { contractId, returnUrl };
    const response = await axios.post<ContractDeposit>(
      `${baseUrl}/api/bill-payment/deposit`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const payMonthlyBill = async (billPaymentId: number, token: string) => {
  var returnUrl = feAddress + '/paymentsucess';
  try {
    const param = { billPaymentId, returnUrl };
    const response = await axios.post(
      `${baseUrl}/api/bill-payment/pay/monthly`,
      param,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};

export const confirmPayment = async (
  url: string,
  tnxRef: string,
  token: string
) => {
  try {
    const param = { url, tnxRef };
    const response = await axios.post(`${baseUrl}/api/payment/confirm`, param, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, { duration: 2000 });
  }
};
