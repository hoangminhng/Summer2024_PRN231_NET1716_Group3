import React, { useState } from "react";
import { Form, InputNumber, Button, Card, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { createMonthlyBillPayment } from "../../../api/Owner/ownerBillPayment";
import { useNavigate } from "react-router-dom";

interface Props {
  lastBillPayment: BillPayment | null;
  token: string | undefined;
}

const BillForm: React.FC<Props> = ({ token, lastBillPayment }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [delayedNavigation, setDelayedNavigation] = useState(false);
  const navigate = useNavigate();

  type NotificationType = "success" | "info" | "warning" | "error";
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, message: any) => {
    api[type]({
      message: message,
      duration: 2,
    });
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    const serviceReadings = lastBillPayment?.billPaymentDetails.map(
      (detail) => ({
        roomServiceId: detail.roomServiceID,
        newNumberService:
          values[`newNumberService_${detail.roomServiceID}`] ?? 0,
      })
    );

    if (lastBillPayment) {
      const requestPayload: CreateMonthlyBillPayment = {
        contractId: lastBillPayment?.contractId,
        billType: lastBillPayment?.billType,
        serviceReadings: serviceReadings ?? [],
      };

      console.log("Request Payload:", requestPayload);

      try {
        const response = await createMonthlyBillPayment(token, requestPayload);

        if (response.statusCode === 200) {
          openNotificationWithIcon("success", response.message);

          setLoading(false);
          setDelayedNavigation(true);

          setTimeout(() => {
            navigate(`/owner/bill-payment/bills/${lastBillPayment.contractId}`);
          }, 1500);
        }
      } catch (error: any) {
        console.error("Failed to create hostel:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Card title="Enter New Service Readings">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={
            lastBillPayment && lastBillPayment.billPaymentDetails
              ? lastBillPayment.billPaymentDetails.reduce(
                  (acc, detail) => ({
                    ...acc,
                    [`newNumberService_${detail.roomServiceID}`]:
                      detail.newNumberService,
                  }),
                  {}
                )
              : {}
          }
        >
          {lastBillPayment?.billPaymentDetails.map(
            (detail) =>
              detail.serviceUnit !== "Month" && (
                <Form.Item
                  key={detail.roomServiceID}
                  label={`New Number of ${detail.serviceType}`}
                  name={`newNumberService_${detail.roomServiceID}`}
                  rules={[
                    { required: true, message: "Please input the new number!" },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              )
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              New Bill
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {(loading || delayedNavigation) && (
        <Spin
          fullscreen={true}
          spinning={true}
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        />
      )}

      {contextHolder}
    </>
  );
};

export default BillForm;
