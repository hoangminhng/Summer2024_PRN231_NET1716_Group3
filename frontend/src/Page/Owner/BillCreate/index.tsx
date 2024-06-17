import React, { useContext, useEffect, useState } from 'react';
import { Card, Spin, List, Row, Col, Collapse } from 'antd';
import { getLastMonthBills } from '../../../api/Owner/ownerBillPayment';
import { UserContext } from '../../../context/userContext';

const { Panel } = Collapse;

const BillCreate: React.FC = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userId } = useContext(UserContext);

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

  const NumberFormat = (value: number): string => {
    return Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div style={{ padding: '24px' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
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
      )}
    </div>
  );
};

export default BillCreate;
