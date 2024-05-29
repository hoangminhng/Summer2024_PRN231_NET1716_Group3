import React, { useContext, useEffect, useState } from "react";
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
import { LoadingOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import HostelForm from "../../../Component/Owner/HostelForm";
import { getOwnerHostels } from "../../../api/Owner/ownerHostel";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;

const getColorByStatus = (status: number) => {
  switch (status) {
    case 0:
      return "default";
    case 1:
      return "green";
    case 2:
      return "red";
    default:
      return "default";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "Prepare";
    case 1:
      return "Available";
    case 2:
      return "Block";
    default:
      return "Unknown";
  }
};

const Hostel: React.FC = () => {
  const [hostelData, setHostelData] = useState<OwnerHostel[]>([]);
  const [current, setCurrent] = useState(1);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 2;
  const { userId, token } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchOwnerHostels = async () => {
    if (userId !== undefined && token !== undefined) {
      setLoading(true);
      try {
        const response = await getOwnerHostels(userId, token);
        setHostelData(response ?? []);
        //console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOwnerHostels();
  }, [userId]);

  const handleOpenHostelForm = () => {
    setModalFormOpen(true);
  };

  const handleDetailClick = (hostelId: number) => {
    navigate(`/owner/hostel/${hostelId}`);
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
        <Flex justify="flex-end">
          <Button onClick={() => handleOpenHostelForm()}>Create</Button>
        </Flex>

        {loading ? (
          <Spin
            fullscreen={true}
            spinning={loading}
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          />
        ) : (
          <List
            grid={{
              gutter: 60,
              column: 1,
            }}
            pagination={{
              current,
              pageSize,
              total: hostelData.length,
              onChange: (page) => setCurrent(page),
            }}
            dataSource={hostelData}
            renderItem={(item) => (
              <List.Item>
                <Card>
                  <div style={{ display: "flex", position: "relative" }}>
                    <div style={{ flex: "0 0 200px", overflow: "hidden" }}>
                      <img
                        alt={item.hostelName}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 0,
                        }}
                        src={item.thumbnail}
                      />
                    </div>
                    <div
                      style={{
                        padding: "0 30px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <Title level={2}>{item.hostelName}</Title>
                      <Text>
                        <Text strong>Address: </Text>
                        {item.hostelAddress}
                      </Text>
                      <Text>
                        <Text strong>Description: </Text>
                        {item.hostelDescription}
                      </Text>
                      <Text>
                        <Text strong>Status: </Text>
                        <Tag color={getColorByStatus(item.status ?? 0)}>
                          {getStatusText(item.status ?? 0)}
                        </Tag>
                      </Text>
                      <Text>
                        <Text strong>Total room: </Text>
                        {item.numOfTotalRoom}
                      </Text>
                      <Button
                        type="primary"
                        style={{ left: "auto", marginLeft: "auto" }}
                        onClick={() => handleDetailClick(item.hostelID)}
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}

        <HostelForm
          setModalOpen={setModalFormOpen}
          modalOpen={modalFormOpen}
          fetchOwnerHostels={fetchOwnerHostels}
        />
      </Space>
    </Layout>
  );
};

export default Hostel;
