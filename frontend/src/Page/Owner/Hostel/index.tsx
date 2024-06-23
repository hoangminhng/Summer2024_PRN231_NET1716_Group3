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
import { LoadingOutlined, ApiOutlined } from "@ant-design/icons";
import HostelForm from "../../../Component/Owner/HostelForm";
import { getOwnerHostels } from "../../../api/Owner/ownerHostel";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import HostelDetail from "../../../Component/Owner/HostelDetail";
import {
  getColorByStatus,
  getStatusText,
} from "../../../Utils/hostelStatusColor";
import { getOwnerCurrentActiveMembership } from "../../../api/Owner/ownerPackage";
const { Text, Title } = Typography;

const Hostel: React.FC = () => {
  const [hostelData, setHostelData] = useState<OwnerHostel[]>([]);
  const [current, setCurrent] = useState(1);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalHostelDetailOpen, setModalHostelDetailOpen] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 2;
  const { userId, token } = useContext(UserContext);
  const [activePackage, setActivePackage] = useState<RegisterPackage>();
  const [packageLoading, setPackageLoading] = useState(true);
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
      fetchOwnerHostels();
    }
  }, [packageLoading, userId]);


  const handleOpenHostelForm = () => {
    setModalFormOpen(true);
  };

  const handleDetailClick = (hostelId: number) => {
    navigate(`/owner/hostels/${hostelId}`);
  };

  const handleOpenHostelDetailModal = (hostelId: number) => {
    setSelectedHostelId(hostelId);
    setModalHostelDetailOpen(true);
  };

  const handleCloseHostelDetailModal = () => {
    fetchOwnerHostels();
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
                        src={item.images[0]}
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
                        <Text strong>Type: </Text>
                        {item.hostelType}
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
                      <Flex justify="flex-end" gap={25}>
                        <Button
                          type="primary"
                          onClick={() =>
                            handleOpenHostelDetailModal(item.hostelID)
                          }
                        >
                          Detail
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => handleDetailClick(item.hostelID)}
                        >
                          Room List
                        </Button>
                      </Flex>
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

        <HostelDetail
          modalOpen={modalHostelDetailOpen}
          setModalOpen={setModalHostelDetailOpen}
          hostelId={selectedHostelId}
          onClose={handleCloseHostelDetailModal}
        />
      </Space>
    </Layout>
    ) : (
      <div className="w-full text-center items-center justify-between">
        <ApiOutlined style={{fontSize:"100px", marginTop:"50px"}}/>
        <p style={{fontWeight: "bold"}}>Your current account has not registered for the package, so you cannot access this page. Please register for a membership package to use.</p>
      </div>
    )}
    </>
  );
};

export default Hostel;
