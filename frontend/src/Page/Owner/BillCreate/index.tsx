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
  Table,
} from "antd";
import {
  getLastMonthBills,
  postMonthlyBillPayment,
} from "../../../api/Owner/ownerBillPayment";
import { UserContext } from "../../../context/userContext";
import { NumberFormat } from "../../../Utils/numberFormat";
import { ApiOutlined, LoadingOutlined } from "@ant-design/icons";
import { getOwnerCurrentActiveMembership } from "../../../api/Owner/ownerPackage";

const { Panel } = Collapse;

const BillCreate: React.FC = () => {
  const [bills, setBills] = useState<BillPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePackage, setActivePackage] = useState<RegisterPackage>();
  const { token, userId } = useContext(UserContext);
  const [packageLoading, setPackageLoading] = useState(true);

  const fetchBills = async () => {
    try {
      if (token && userId) {
        const data = await getLastMonthBills(userId, token);
        setBills(data.billPaymentDtos);
        console.log(data.billPaymentDtos);
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
        setActivePackage(data);
      }
    } catch (error) {
      console.error("Error fetching status package:", error);
    } finally {
      setPackageLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusPackage();
  }, [token]);

  useEffect(() => {
    if (!packageLoading) {
      fetchBills();
    }
  }, [packageLoading, userId, token]);

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
    let isValid = true;

    bills.forEach((bill) => {
      bill.billPaymentDetails.forEach((service) => {
        if (service.newNumberService < service.oldNumberService) {
          isValid = false;
          notification.error({
            message: "Validation Error",
            description: `New number service (${service.newNumberService}) cannot be less than the old number service (${service.oldNumberService}).`,
          });
        }
      });
    });

    if (!isValid) {
      return;
    }

    const requestData = collectDataForAPI();
    console.log(`Request Data: ${JSON.stringify(requestData, null, 2)}`);
    try {
      const response = await postMonthlyBillPayment(token, requestData);

      console.log("API Response:", response);
      notification.success({
        message: "Success",
        description: "Bill created successfully !",
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
      {packageLoading ? (
        <Spin
          spinning={true}
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        />
      ) : activePackage ? (
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
                      title={`Bill for Room: ${bill.roomId}`}
                      bordered={false}
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={9}>
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
                          {/* <p>
                            <strong>Is first Bill: </strong>{" "}
                            {bill.isFirstBill.toString()}
                          </p> */}
                        </Col>
                        <Col span={15}>
                          <h4><strong>Services:</strong></h4>
                          <Table
                            dataSource={bill.billPaymentDetails}
                            rowKey="roomServiceID"
                            pagination={false}
                            columns={[
                              {
                                title: "Service Type",
                                dataIndex: "serviceType",
                                key: "serviceType",
                              },
                              {
                                title: "Service Price",
                                dataIndex: "servicePrice",
                                key: "servicePrice",
                                render: (text) => NumberFormat(text),
                              },
                              {
                                title: "Service Unit",
                                dataIndex: "serviceUnit",
                                key: "serviceUnit",
                              },
                              {
                                title: "Quantity",
                                dataIndex: "quantity",
                                key: "quantity",
                              },
                              {
                                title: "Service Total Amount",
                                dataIndex: "serviceTotalAmount",
                                key: "serviceTotalAmount",
                                render: (text) => NumberFormat(text),
                              },
                              {
                                title: "New Number Service",
                                dataIndex: "newNumberService",
                                key: "newNumberService",
                                render: (text, record) =>
                                  record.serviceUnit !== "Month" &&
                                  !bill.isFirstBill ? (
                                    <Input
                                      type="number"
                                      value={text}
                                      onChange={(e) =>
                                        handleInputChange(
                                          bill.roomId,
                                          record.roomServiceID,
                                          parseInt(e.target.value)
                                        )
                                      }
                                      style={{
                                        borderRadius: "7px",
                                      }}
                                    />
                                  ) : null,
                              },
                            ]}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
              {bills.length > 0 && (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  style={{ marginTop: "16px" }}
                >
                  Submit Bill Payments
                </Button>
              )}
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
