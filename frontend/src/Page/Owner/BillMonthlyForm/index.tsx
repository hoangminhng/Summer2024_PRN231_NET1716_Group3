import { Col, Row } from "antd";
import BillDetail from "../../../Component/Owner/BillDetail/indext";
import BillForm from "../../../Component/Owner/BillForm";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { getLastMonthBillPayment } from "../../../api/Owner/ownerBillPayment";
import { useLocation } from "react-router-dom";

interface LocationState {
  contractId: string;
}

const BillMonthlyForm: React.FC = () => {
  const [billPayment, setBillPayment] = useState<BillPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(UserContext);

  const location = useLocation();
  const { contractId } = location.state as LocationState;

  const fetchLastMonthBillPayment = async () => {
    if (token !== undefined) {
      setLoading(true);
      try {
        const response = await getLastMonthBillPayment(
          parseInt(contractId),
          token
        );
        if (response) {
          console.log("Last month bill: ", response);
          setBillPayment(response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLastMonthBillPayment();
  }, []);

  return (
    <div style={{ margin: 16 }}>
      <Row gutter={16}>
        <Col span={12}>
          <BillDetail billPayment={billPayment} loading={loading} />
        </Col>
        <Col span={12}>
          <BillForm token={token} lastBillPayment={billPayment} />
        </Col>
      </Row>
    </div>
  );
};

export default BillMonthlyForm;
