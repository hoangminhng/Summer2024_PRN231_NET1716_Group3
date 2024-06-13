import { Button, Flex } from "antd";

const handleOpenBillPaymentForm = () => {};

const BillList: React.FC = () => {
  return (
    <div>
      <Flex justify="flex-end" style={{ margin: 20 }}>
        <Button onClick={() => handleOpenBillPaymentForm()}>Create bill</Button>
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
