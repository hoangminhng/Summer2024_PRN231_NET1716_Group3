import { Button, Card, Layout, List, Space, Tag, Typography } from "antd";
import Title from "antd/es/typography/Title";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { getRoomListOfHostel } from "../../../api/Owner/ownerRoom";
const { Text } = Typography;

const getColorByStatus = (status: number) => {
  switch (status) {
    case 0:
      return "green";
    case 1:
      return "blue";
    case 2:
      return "orange";
    case 3:
      return "red";
    default:
      return "default";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "Available";
    case 1:
      return "Viewing";
    case 2:
      return "Hiring";
    case 3:
      return "Fixed";
    default:
      return "Unknown";
  }
};

const Room: React.FC = () => {
  const [roomData, setRoomData] = useState<OwnerRoom[]>([]);
  const { hostelId } = useParams<{ hostelId: string }>();
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  //   const filteredRoomData = roomData.filter(
  //     (room) => room.hostelID.toString() === hostelId
  //   );

  const fetchRoomListOfHostel = async () => {
    if (hostelId !== undefined && token !== undefined) {
      const hostelIdNumber = parseInt(hostelId);
      try {
        const response = await getRoomListOfHostel(hostelIdNumber, token);
        setRoomData(response ?? []);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchRoomListOfHostel();
  }, [hostelId]);

  const handleBackClick = () => {
    navigate("/owner/hostel");
  };

  return (
    <Layout>
      <Space
        size={20}
        direction="vertical"
        style={{
          margin: "24px 16px 0",
        }}
      >
        <Button onClick={handleBackClick}>Back</Button>
        <List
          grid={{
            gutter: 16,
            column: 4,
          }}
          dataSource={roomData}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <div style={{ overflow: "hidden", height: "200px" }}>
                    <img
                      alt="example"
                      style={{ height: "100%", width: "100%" }}
                      src={item.roomThumbnail}
                    />
                  </div>
                }
              >
                <Title level={2}>{item.roomName}</Title>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <Text>
                    <Text strong>Capacity: </Text>
                    {item.capacity}
                  </Text>
                  <Text>
                    <Text strong>Room Fee: </Text>${item.roomFee}
                  </Text>
                  <Text>
                    <Text strong>Status: </Text>
                    <Tag color={getColorByStatus(item.status ?? 0)}>
                      {getStatusText(item.status ?? 0)}
                    </Tag>
                  </Text>
                  <Button
                    type="primary"
                    style={{ left: "auto", marginLeft: "auto", marginTop: 20 }}
                  >
                    Detail
                  </Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Space>
    </Layout>
  );
};

export default Room;
