import {
  Button,
  Card,
  Flex,
  Layout,
  List,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";
import { LoadingOutlined, ApiOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { getRoomListOfHostel } from "../../../api/Owner/ownerRoom";
import RoomForm from "../../../Component/Owner/RoomForm/indext";
import Link from "antd/es/typography/Link";
import {
  getColorByStatus,
  getStatusText,
} from "../../../Utils/roomStatusColor";
import { NumberFormat } from "../../../Utils/numberFormat";
import { getOwnerCurrentActiveMembership } from "../../../api/Owner/ownerPackage";
const { Text } = Typography;

const Room: React.FC = () => {
  const [roomData, setRoomData] = useState<OwnerRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const { hostelId } = useParams<{ hostelId: string }>();
  const [activePackage, setActivePackage] = useState<RegisterPackage>();
  const [packageLoading, setPackageLoading] = useState(true);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  const pageSize = 4;

  const fetchRoomListOfHostel = async () => {
    if (hostelId !== undefined && token !== undefined) {
      setLoading(true);
      const hostelIdNumber = parseInt(hostelId);
      try {
        const response = await getRoomListOfHostel(hostelIdNumber, token);
        setRoomData(response ?? []);
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
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
      fetchRoomListOfHostel();
    }
  }, [packageLoading, hostelId]);

  const handleBackClick = () => {
    navigate("/owner/hostels");
  };

  const handleOpenRoomForm = () => {
    setModalFormOpen(true);
  };

  return (
    <>
      {packageLoading ? (
        <Spin
          spinning={true}
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        />
      ) : activePackage ? (
        <Layout>
          <Space
            size={20}
            direction="vertical"
            style={{
              margin: "24px 16px 0",
            }}
          >
            <Flex justify="space-between">
              <Button onClick={handleBackClick}>Back</Button>
              <Button onClick={() => handleOpenRoomForm()}>Add room</Button>
            </Flex>

            {/* Rooms of hostel */}
            {loading ? (
              <Spin
                fullscreen={true}
                spinning={loading}
                indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              />
            ) : (
              <List
                grid={{
                  gutter: 16,
                  column: 4,
                }}
                pagination={{
                  current,
                  pageSize,
                  total: roomData.length,
                  onChange: (page) => setCurrent(page),
                }}
                dataSource={roomData}
                renderItem={(item) => (
                  <List.Item>
                    <Link
                      href={`/owner/hostels/${hostelId}/rooms/${item.roomID}`}
                    >
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
                        <div
                          style={{
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Title level={2}>{item.roomName}</Title>
                        </div>
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
                            <Text strong>Room Fee: </Text>
                            {NumberFormat(item.roomFee ?? 0)}
                          </Text>
                          <Text>
                            <Text strong>Status: </Text>
                            <Tag color={getColorByStatus(item.status ?? 0)}>
                              {getStatusText(item.status ?? 0)}
                            </Tag>
                          </Text>
                        </div>
                      </Card>
                    </Link>
                  </List.Item>
                )}
              />
            )}

            <RoomForm
              setModalOpen={setModalFormOpen}
              modalOpen={modalFormOpen}
              hostelId={hostelId}
              fetchRooms={fetchRoomListOfHostel}
            />
          </Space>
        </Layout>
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

export default Room;
