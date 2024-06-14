import { Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";

const BillList: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenBillPaymentForm = () => {
    navigate("/owner/bill-payment/bills/form");
  };

  return (
    <div>
      <Flex justify="flex-end" style={{ margin: 20 }}>
        <Button onClick={() => handleOpenBillPaymentForm()}>Create monthly bill</Button>
      </Flex>
      <h1>Bill list of specific contract/room</h1>
      <p>month</p>
      <p>year</p>
      <p>status</p>
      <p>type</p>
    </div>
  );
};

export default BillList;
