import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Spin, Image } from 'antd';
import { getHiringRooms } from '../../../api/Owner/ownerRoom';
import { UserContext } from "../../../context/userContext";

const BillPayment: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userId } = useContext(UserContext);
  const navigate = useNavigate();

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

  const handleRowClick = (record) => {
    navigate(`/owner/bill-payment/bills/${record.contractId}`);
    console.log(record.contractId);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'roomThumbnail',
      key: 'roomThumbnail',
      render: (text, record) => (
        <Image
          width={50}
          height={50}
          src={record.roomThumbnail}
          alt={record.roomName}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Room Name',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Hostel',
      dataIndex: 'hostelName',
      key: 'hostelName',
    },
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (status === 2 ? 'Hiring' : 'Available'),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={rooms}
          rowKey="roomID"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      )}
    </div>
  );
};

export default BillPayment;
