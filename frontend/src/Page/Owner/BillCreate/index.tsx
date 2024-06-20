import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Spin,
  List,
  Row,
  Col,
  Collapse,
  Input,
  Button,
  notification,
} from "antd";
import {
  getLastMonthBills,
  postMonthlyBillPayment,
} from "../../../api/Owner/ownerBillPayment";
import { UserContext } from "../../../context/userContext";
import { NumberFormat } from "../../../Utils/numberFormat";
import {ApiOutlined} from "@ant-design/icons"
import { getOwnerCurrentActiveMembership } from '../../../api/Owner/ownerPackage';

const { Panel } = Collapse;

const BillCreate: React.FC = () => {
  const [bills, setBills] = useState<BillPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePackage, setActivePackage] = useState<RegisterPackage>();
  const { token, userId } = useContext(UserContext);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (token && userId) {
          const data = await getLastMonthBills(userId, token);
          setBills(data.billPaymentDtos);
          setLoading(false);
        }
      } catch (error) {
        console.error("There was an error fetching the bill data!", error);
        setLoading(false);
      }
    };

    const fetchStatusPackage = async () => {
      try {
        if (token != undefined) {
          let data = await getOwnerCurrentActiveMembership(token);
          setActivePackage(data)
          }
        } catch (error) {
        console.error("Error fetching status package:", error);
      }
    };

    fetchBills();
    fetchStatusPackage();
  }, [userId, token]);

  const handleInputChange = (
    roomId: number,
    serviceID: number,
    value: number
  ) => {
    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.roomId === roomId
          ? {
              ...bill,
              billPaymentDetails: bill.billPaymentDetails.map((service) =>
                service.roomServiceID === serviceID
                  ? { ...service, newNumberService: value }
                  : service
              ),
            }
          : bill
      )
    );
  };

  const collectDataForAPI = () => {
    return {
      roomBillPayments: bills.map((bill) => ({
        contractId: bill.contractId,
        serviceReadings: bill.billPaymentDetails.map((service) => ({
          roomServiceID: service.roomServiceID,
          newNumberService: service.newNumberService ?? 0,
        })),
      })),
    };
  };

  const handleSubmit = async () => {
    const requestData = collectDataForAPI();
    //alert(`Request Data: ${JSON.stringify(requestData, null, 2)}`);
    try {
      const response = await postMonthlyBillPayment(token, requestData);
      console.log("API Response:", response);
      notification.success({
        message: "Success",
        description: "Bill payments submitted successfully!",
      });
    } catch (error) {
      console.error("API Error:", error);
      notification.error({
        message: "Error",
        description: "There was an error submitting the bill payments.",
      });
    }
  };

  return (
    <>
      {activePackage ? (
        <div style={{ padding: "24px" }}>
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={bills}
                renderItem={(bill) => (
                  <List.Item key={bill.roomId}>
                    <Card
                      title={`Bill for Room ID: ${bill.roomId}`}
                      bordered={false}
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <p>
                            <strong>Room Name:</strong> {bill.roomName}
                          </p>
                          <p>
                            <strong>Renter Name:</strong> {bill.renterName}
                          </p>
                          <p>
                            <strong>Bill Amount:</strong>{" "}
                            {NumberFormat(bill.billAmount)}
                          </p>
                          <p>
                            <strong>Total Amount:</strong>{" "}
                            {NumberFormat(bill.totalAmount)}
                          </p>
                          <p>
                            <strong>Month:</strong> {bill.month}
                          </p>
                          <p>
                            <strong>Year:</strong> {bill.year}
                          </p>
                          <p>
                            <strong>Start Date:</strong> {bill.startDate}
                          </p>
                          <p>
                            <strong>End Date:</strong> {bill.endDate}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            {bill.billPaymentStatus === 0 ? "Unpaid" : "Paid"}
                          </p>
                        </Col>
                        <Col span={12}>
                          <h4>Services:</h4>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "16px",
                            }}
                          >
                            {bill.billPaymentDetails.map((service) => (
                              <Collapse
                                key={service.roomServiceID}
                                style={{
                                  flex: "1 1 calc(33.33% - 16px)",
                                  marginBottom: "16px",
                                }}
                              >
                                <Panel
                                  header={service.serviceType}
                                  key={service.roomServiceID}
                                >
                                  <p>
                                    <strong>Service Price:</strong>{" "}
                                    {NumberFormat(service.servicePrice)}
                                  </p>
                                  <p>
                                    <strong>Service Unit:</strong>{" "}
                                    {service.serviceUnit}
                                  </p>
                                  <p>
                                    <strong>Quantity:</strong>{" "}
                                    {service.quantity}
                                  </p>
                                  <p>
                                    <strong>Service Total Amount:</strong>{" "}
                                    {NumberFormat(service.serviceTotalAmount)}
                                  </p>
                                  {service.serviceUnit !== "Month" && (
                                    <p>
                                      <strong>New Number Service:</strong>
                                      <Input
                                        key={`${bill.roomId}-${service.roomServiceID}`}
                                        type="number"
                                        value={service.newNumberService}
                                        onChange={(e) =>
                                          handleInputChange(
                                            bill.roomId,
                                            service.roomServiceID,
                                            parseInt(e.target.value)
                                          )
                                        }
                                      />
                                    </p>
                                  )}
                                </Panel>
                              </Collapse>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: "16px" }}
              >
                Submit Bill Payments
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="w-full text-center items-center justify-between">
          <ApiOutlined style={{ fontSize: "100px", marginTop: "50px" }} />
          <p style={{ fontWeight: "bold" }}>
            Your current account has not registered for the package, so you
            cannot access this page. Please register for a membership package to
            use.
          </p>
        </div>
      )}
    </>
  );
};

export default BillCreate;
