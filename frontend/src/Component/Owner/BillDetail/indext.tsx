import React from "react";
import { Card, Collapse, CollapseProps, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { NumberFormat } from "../../../Utils/numberFormat";

const { Title, Text } = Typography;

interface Props {
  billPayment: BillPayment | null;
  loading: boolean;
}

const BillDetail: React.FC<Props> = ({ billPayment, loading }) => {
  if (!billPayment || billPayment.billPaymentID === 0) {
    return (
      <>
        {loading ? (
          <Spin
            fullscreen={true}
            spinning={loading}
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          />
        ) : (
          <Card title="Bill Payment Detail">
            <p>No bill payment details available.</p>
          </Card>
        )}
      </>
    );
  }

  const items: CollapseProps["items"] = billPayment?.billPaymentDetails.map(
    (detail) => ({
      key: detail.billPaymentDetailID.toString(),
      label: `Service: ${detail.serviceType}`,
      children: (
        <div>
          <p>
            <Text strong>Quantity:</Text> {detail.quantity} {detail.serviceUnit}
          </p>
          <p>
            <Text strong>Price:</Text> {NumberFormat(detail.servicePrice)}
          </p>
          <p>
            <Text strong>Total Amount:</Text>{" "}
            {NumberFormat(detail.serviceTotalAmount)}
          </p>
          <p>
            <Text strong>Old Number:</Text> {detail.oldNumberService}
          </p>
          <p>
            <Text strong>New Number:</Text> {detail.newNumberService}
          </p>
        </div>
      ),
    })
  );

  const createdDate = billPayment?.createdDate
    ? new Date(billPayment.createdDate).toLocaleString()
    : "Unknown";

  return (
    <>
      {loading ? (
        <Spin
          fullscreen={true}
          spinning={loading}
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        />
      ) : (
        <Card title="Bill Payment Detail">
          <p>
            <Text strong>Room:</Text> {billPayment?.roomName}
          </p>
          <p>
            <Text strong>Renter:</Text> {billPayment?.renterName}
          </p>
          <p>
            <Text strong>Room Fee:</Text> {NumberFormat(billPayment.billAmount)}
          </p>
          <p>
            <Text strong>Month:</Text> {billPayment?.month}
          </p>
          <p>
            <Text strong>Year:</Text> {billPayment?.year}
          </p>
          <p>
            <Text strong>Created Date:</Text> {createdDate}
          </p>
          <p>
            <Text strong>Total Amount:</Text>{" "}
            {NumberFormat(billPayment.totalAmount)}
          </p>
          <p>
            <Text strong>Status:</Text>{" "}
            {billPayment?.billPaymentStatus === 0 ? "Unpaid" : "Paid"}
          </p>
          <Title level={5}>Services</Title>
          <Collapse
            accordion
            items={items}
            defaultActiveKey={["1"]}
            style={{ marginTop: 20 }}
          />
        </Card>
      )}
    </>
  );
};

export default BillDetail;
