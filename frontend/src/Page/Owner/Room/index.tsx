import {
  Button,
  Card,
  Layout,
  List,
  Popconfirm,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { getRoomListOfHostel } from "../../../api/Owner/ownerRoom";
import {
  getOwnerHostelDetail,
  updateHostelStatus,
} from "../../../api/Owner/ownerHostel";
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
  const [hostelDetailData, setHostelDetailData] = useState<OwnerHostel>();
  const [roomData, setRoomData] = useState<OwnerRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<number | undefined>(
    undefined
  );
  const [current, setCurrent] = useState(1);
  const { hostelId } = useParams<{ hostelId: string }>();
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  const pageSize = 4;

  //   const filteredRoomData = roomData.filter(
  //     (room) => room.hostelID.toString() === hostelId
  //   );

  const fetchHostelDetail = async () => {
    if (hostelId !== undefined) {
      setLoading(true);
      const hostelIdNumber = parseInt(hostelId);
      try {
        const response = await getOwnerHostelDetail(hostelIdNumber);
        setHostelDetailData(response);
        setCurrentStatus(response?.status);
        // console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchHostelDetail();
  }, [hostelId]);

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

  useEffect(() => {
    fetchRoomListOfHostel();
  }, [hostelId]);

  const handleBackClick = () => {
    navigate("/owner/hostel");
  };

  const handleConfirmStatusChange = async () => {
    if (token && hostelId && statusToChange !== null) {
      setLoading(true);
      console.log("HERE", statusToChange);
      try {
        await updateHostelStatus(token, parseInt(hostelId), statusToChange);

        setOpen(false);
        setStatusToChange(null);
        fetchHostelDetail();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleCancelStatusChange = () => {
    setOpen(false);
    setStatusToChange(null);
  };

  const handleStatusChange = (value: number) => {
    setStatusToChange(value);
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

        {/* Hostel Detail */}
        <Card>
          <div
            style={{
              display: "flex",
              position: "relative",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "0 0 200px", overflow: "hidden" }}>
              <img
                alt={hostelDetailData?.hostelName}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 0,
                }}
                src={hostelDetailData?.thumbnail}
              />
            </div>
            <div
              style={{
                padding: "0 30px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Title level={2}>{hostelDetailData?.hostelName}</Title>
              <Text>
                <Text strong>Address: </Text>
                {hostelDetailData?.hostelAddress}
              </Text>
              <Text>
                <Text strong>Description: </Text>
                {hostelDetailData?.hostelDescription}
              </Text>
              <Text>
                <div>
                  <Text strong>Status: </Text>
                  <Select
                    value={
                      statusToChange !== null ? statusToChange : currentStatus
                    }
                    onChange={handleStatusChange}
                    style={{ width: 120 }}
                    options={[
                      { value: 0, label: "Prepare" },
                      { value: 1, label: "Available" },
                      { value: 2, label: "Block" },
                    ]}
                  />
                  {statusToChange !== null && (
                    <Popconfirm
                      open={open}
                      title="Are you sure you want to change the hostel status?"
                      onConfirm={handleConfirmStatusChange}
                      onCancel={handleCancelStatusChange}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        onClick={showPopconfirm}
                        style={{ marginLeft: 20 }}
                      >
                        Update Status
                      </Button>
                    </Popconfirm>
                  )}
                </div>
              </Text>
              <Text>
                <Text strong>Total room: </Text>
                {hostelDetailData?.numOfTotalRoom}
              </Text>
            </div>
          </div>
        </Card>

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
                      style={{
                        left: "auto",
                        marginLeft: "auto",
                        marginTop: 20,
                      }}
                    >
                      Detail
                    </Button>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Space>
    </Layout>
  );
};

export default Room;
