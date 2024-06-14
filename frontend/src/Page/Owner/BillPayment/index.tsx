import React, { useState, useEffect, useContext } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { getHiringRooms } from '../../../api/Owner/ownerRoom';
import { UserContext } from "../../..//context/userContext";

const BillPayment: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userId } = useContext(UserContext);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getHiringRooms(userId, token);
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error getting the room data!', error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [userId, token]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {rooms.map(room => (
          <Col key={room.roomID} span={8}>
            <Card
              hoverable
              cover={<img alt={room.roomName} src={room.roomThumbnail} style={{ width: '100%', height: '290px', objectFit: 'cover' }} />}
            >
              <Card.Meta
                title={room.roomName}
                description={
                  <>
                    <p>Hostel: {room.hostelName}</p>
                    <p>Student: {room.studentName}</p>
                    <p>Status: {room.status === 2 ? 'Hiring' : 'Available'}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BillPayment;
