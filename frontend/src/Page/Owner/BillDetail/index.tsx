import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { getBillPaymentDetail } from "../../../api/Owner/ownerBillPayment";
import BillDetail from "../../../Component/Owner/BillDetail/indext";

const BillPaymentDetail: React.FC = () => {
  const [billPayment, setBillPayment] = useState<BillPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(UserContext);
  const { billPaymentId } = useParams<{ billPaymentId: string }>();
  const navigate = useNavigate();

  const fetchBillPaymentDetail = async () => {
    if (billPaymentId !== undefined && token !== undefined) {
      setLoading(true);
      try {
        const response = await getBillPaymentDetail(
          parseInt(billPaymentId),
          token
        );
        if ("statusCode" in response && "message" in response) {
          console.log(response);
        } else {
          console.log("Bill payment details: ", response);
          setBillPayment(response);
        }
      } catch (error) {
        console.log(error);
        navigate("/owner/bill-payment");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBillPaymentDetail();
  }, []);

  return (
    <div style={{ margin: 16 }}>
      <BillDetail billPayment={billPayment} loading={loading} />
    </div>
  );
};

export default BillPaymentDetail;
