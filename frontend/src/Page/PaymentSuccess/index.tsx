import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { confirmPayment } from "../../api/payment";

function getVnpTxnRef(queryString: string): string | null {
  const params = new URLSearchParams(queryString);
  return params.get("vnp_TxnRef");
}

const PaymentSucess = () => {
  const { token, updatePackageStatus } = useContext(UserContext);
  const [transctionStatus, setTransactionStatus] = useState<boolean>();
  const navigate = useNavigate();

  useEffect(() => {
    let homeTimeout: NodeJS.Timeout;
    try {
      const url = window.location.href;
      const queryString = url.substring(url.indexOf("?") + 1);
      // const queryStr = '?vnp_Amount=24000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP14450715&vnp_CardType=ATM&vnp_OrderInfo=Register+package&vnp_PayDate=20240609195031&vnp_ResponseCode=00&vnp_TmnCode=6EMYCUD2&vnp_TransactionNo=14450715&vnp_TransactionStatus=00&vnp_TxnRef=638535593854316414&vnp_SecureHash=32214573fd1450632c9addfa58c2436600ad821fb270878f4ee6216390e5fe7dfe127332afaa637fa7963eccf17a89cd114babcea9d15ddd3492f85dcde9ccac';

      console.log(queryString);
      if (queryString.includes("vnp_TransactionStatus=00")) {
        const vnpTxnRef = getVnpTxnRef(queryString);
        console.log("Transaction is in");
        setTransactionStatus(true);

        const postPayment = async () => {
          if (token && vnpTxnRef) {
            let response;
            response = await confirmPayment(queryString, vnpTxnRef, token);

            console.log("Response: " + response);

            console.log(response?.data?.paymentType);
            if (response?.data?.paymentType == 0) {
              homeTimeout = setTimeout(() => navigate("/contracts"), 1000);
            }
            if (response?.data?.paymentType == 1) {
              //bill_payment
              homeTimeout = setTimeout(() => navigate("/payment"), 2000);
            }
            if (response?.data?.paymentType == 2) {
              //package_register
              updatePackageStatus(0); //set status of register package to active
              homeTimeout = setTimeout(
                () => navigate("/owner/package/history"),
                2000
              );
            }
          }
        };
        postPayment();
      } else {
        console.log("Transaction is off");
        setTransactionStatus(false);
        homeTimeout = setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.log("Error:", error);
    }
    return () => clearTimeout(homeTimeout);
  }, []);
  return transctionStatus ? (
    <div className="flex flex-col justify-center items-center h-75vh w-full text-center pt-30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-28 h-28 bg-mainBlue rounded-full p-2 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
      <div className="text-sm pt-3 pb-1">SUCCESS</div>
      <div className="font-bold text-2xl pb-2">Transaction Completed!</div>
      <div className="text-gray-700 pb-3">
        The transaction is completed, thank for choosing our services.
      </div>
      <div className="text-white bg-mainBlue hover:bg-darkerMainBlue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <Link to="/">Continue Browsing</Link>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center h-75vh w-full text-center pt-30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-28 h-28 bg-mainBlue rounded-full p-2 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>

      <div className="text-sm pt-3 pb-1">FAILED</div>
      <div className="font-bold text-2xl pb-2">Transaction Failed!</div>
      <div className="text-gray-700 pb-3">
        <div>The transaction has failed, something must have gone wrong</div>
        <div>Please contact our team for more information</div>
      </div>
      <div className="text-white bg-mainBlue hover:bg-darkerMainBlue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <Link to="/">Continue Browsing</Link>
      </div>
    </div>
  );
};

export default PaymentSucess;
