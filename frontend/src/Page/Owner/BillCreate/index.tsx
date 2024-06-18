import React, { useContext, useEffect, useState } from 'react';
import { Card, Spin, List, Row, Col, Collapse, Input, Button } from 'antd';
import { getLastMonthBills, postMonthlyBillPayment } from '../../../api/Owner/ownerBillPayment';
import {ApiOutlined} from "@ant-design/icons"
import { UserContext } from '../../../context/userContext';
import { NumberFormat, DateFormat } from '../../../Utils/numberFormat';
const { Panel } = Collapse;

const BillCreate: React.FC = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userId, userPackageStatus } = useContext(UserContext);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getLastMonthBills(userId, token);
        setBills(data.billPaymentDtos);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the bill data!', error);
        setLoading(false);
      }
    };

    fetchBills();
  }, [userId, token]);

  // const NumberFormat = (value: number): string => {
  //   return Intl.NumberFormat("de-DE", {
  //     style: "currency",
  //     currency: "VND",
  //   }).format(value);
  // };

  const handleInputChange = (serviceID: number, value: number) => {
    setBills(prevBills =>
      prevBills.map(bill => ({
        ...bill,
        billPaymentDetails: bill.billPaymentDetails.map(service =>
          service.billPaymentDetailID === serviceID
            ? { ...service, newNumberService: value }
            : service
        )
      }))
    );
  };

  const collectDataForAPI = () => {
    return {
      roomBillPayments: bills.map(bill => ({
        contractId: bill.contractId,
        serviceReadings: bill.billPaymentDetails.map(service => ({
          roomServiceID: service.roomServiceID,
          newNumberService: service.newNumberService ?? 0
        }))
      }))
    };
  };

  const handleSubmit = async () => {
    const requestData = collectDataForAPI();
    try {
      const response = await postMonthlyBillPayment(token, requestData);
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
    }
  };


  return (
    <>
    {userPackageStatus == 0 ? (
    <div style={{ padding: '24px' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={bills}
            renderItem={bill => (
              <List.Item>
                <Card title={`Bill ID: ${bill.billPaymentID}`} bordered={false}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <p><strong>Room Name:</strong> {bill.roomName}</p>
                      <p><strong>Renter Name:</strong> {bill.renterName}</p>
                      <p><strong>Bill Amount:</strong> {NumberFormat(bill.billAmount)}</p>
                      <p><strong>Total Amount:</strong> {NumberFormat(bill.totalAmount)}</p>
                      <p><strong>Month:</strong> {bill.month}</p>
                      <p><strong>Year:</strong> {bill.year}</p>
                      <p><strong>Start Date:</strong> {DateFormat(bill.startDate)}</p>
                      <p><strong>End Date:</strong> {DateFormat(bill.endDate)}</p>
                      <p><strong>Status:</strong> {bill.billPaymentStatus === 0 ? 'Unpaid' : 'Paid'}</p>
                    </Col>
                    <Col span={12}>
                      <h4>Services:</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {bill.billPaymentDetails.map(service => (
                          <Collapse key={service.billPaymentDetailID} style={{ flex: '1 1 calc(33.33% - 16px)', marginBottom: '16px' }}>
                            <Panel header={service.serviceType} key={service.billPaymentDetailID}>
                              <p><strong>Service Price:</strong> {NumberFormat(service.servicePrice)}</p>
                              <p><strong>Service Unit:</strong> {service.serviceUnit}</p>
                              <p><strong>Quantity:</strong> {service.quantity}</p>
                              <p><strong>Service Total Amount:</strong> {NumberFormat(service.serviceTotalAmount)}</p>
                              {service.serviceUnit !== 'Month' && (
                                <p>
                                  <strong>New Number Service:</strong>
                                  <Input 
                                    type="number" 
                                    value={service.newNumberService}
                                    onChange={e => handleInputChange(service.billPaymentDetailID, parseInt(e.target.value))}
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
          <Button type="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
            Submit Bill Payments
          </Button>
        </>
      )}
    </div>
    ) : (
      <div className="w-full text-center items-center justify-between">
        <ApiOutlined style={{fontSize:"100px", marginTop:"50px"}}/>
        <p style={{fontWeight: "bold"}}>Your current account has not registered for the package, so you cannot access this page. Please register for a membership package to use.</p>
      </div>
    )}
    </>
  );
};

export default BillCreate;
