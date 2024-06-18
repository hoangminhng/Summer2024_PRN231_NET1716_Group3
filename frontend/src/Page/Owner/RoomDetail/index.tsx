import {
  Button,
  Carousel,
  Col,
  Descriptions,
  Drawer,
  Flex,
  Image,
  Layout,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getOwnerRoomDetail,
  updateRoomStatus,
} from "../../../api/Owner/ownerRoom";
import Column from "antd/es/table/Column";
import { NumberFormat } from "../../../Utils/numberFormat";
import { UserContext } from "../../../context/userContext";
const { Text } = Typography;

const getStatusTag = (status: number) => {
  return status === 0 ? (
    <Tag color="green">Active</Tag>
  ) : (
    <Tag color="grey">Inactive</Tag>
  );
};

const lengthUnit = "m";
const widthUnit = "ft";

const RoomDetail: React.FC = () => {
  const [roomDetailData, setRoomDetailData] = useState<OwnerRoomDetail>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<number | undefined>(
    undefined
  );
  const [popConfirmOpen, setPopConfirmOpen] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();
  const { token } = useContext(UserContext);

  const fetchRoomDetail = async () => {
    if (roomId !== undefined) {
      setLoading(true);
      try {
        if (token !== undefined) {
          const response = await getOwnerRoomDetail(parseInt(roomId), token);
          setRoomDetailData(response);
          setCurrentStatus(response?.status);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRoomDetail();
  }, [roomId]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  //
  const handleConfirmStatusChange = async () => {
    if (token && roomId && statusToChange !== null) {
      setLoading(true);
      try {
        await updateRoomStatus(token, parseInt(roomId), statusToChange);
        setPopConfirmOpen(false);
        setStatusToChange(null);
        fetchRoomDetail();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = (value: number) => {
    setStatusToChange(value);
  };

  const handleCancelStatusChange = () => {
    setPopConfirmOpen(false);
    setStatusToChange(null);
  };

  const showPopconfirm = () => {
    setPopConfirmOpen(true);
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
        {loading ? (
          <Spin
            fullscreen={true}
            spinning={loading}
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          />
        ) : (
          <Row gutter={16} justify={"space-around"}>
            <Col className="gutter-row" span={10}>
              <Flex vertical gap="large">
                <Carousel autoplay arrows effect="fade">
                  {roomDetailData?.roomImageUrls.map((imageUrl) => (
                    <Image
                      width={"100%"}
                      height={350}
                      key={imageUrl}
                      src={imageUrl}
                      alt="Room Image"
                    />
                  ))}
                </Carousel>

                <Descriptions bordered>
                  <Descriptions.Item label="Lenght" span={1}>
                    {roomDetailData?.lenght} {lengthUnit}
                  </Descriptions.Item>
                  <Descriptions.Item label="Width" span={2}>
                    {roomDetailData?.width} {widthUnit}
                  </Descriptions.Item>
                  <Descriptions.Item label="Capacity" span={1}>
                    {roomDetailData?.capacity} people
                  </Descriptions.Item>
                  <Descriptions.Item label="Fee" span={2}>
                    {NumberFormat(roomDetailData?.roomFee ?? 0)}
                  </Descriptions.Item>
                  {roomDetailData?.renterName && (
                    <Descriptions.Item label="Renter" span={3}>
                      <Flex align="center" justify="space-between">
                        {roomDetailData.renterName}
                        <Button type="primary">Detail</Button>
                      </Flex>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Flex>
            </Col>
            <Col className="gutter-row" span={12}>
              <Flex vertical gap="middle">
                <Flex align="center" gap="large">
                  <Title level={2} style={{ marginBottom: 0 }}>
                    {roomDetailData?.roomName}
                  </Title>
                  <Select
                    value={
                      statusToChange !== null ? statusToChange : currentStatus
                    }
                    onChange={handleStatusChange}
                    style={{ width: 120 }}
                    options={[
                      { value: 0, label: "Available" },
                      { value: 1, label: "Viewing" },
                      { value: 2, label: "Hiring" },
                      { value: 3, label: "Fixed" },
                    ]}
                  ></Select>
                  {statusToChange !== null && (
                    <Popconfirm
                      open={popConfirmOpen}
                      title="Are you sure you want to change the room status?"
                      onConfirm={() => {
                        handleConfirmStatusChange();
                        setOpen(false);
                      }}
                      onCancel={() => {
                        handleCancelStatusChange();
                        setOpen(false);
                      }}
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
                </Flex>
                <Text>{roomDetailData?.description}</Text>

                <Table
                  dataSource={roomDetailData?.roomServices}
                  pagination={{ pageSize: 5 }}
                >
                  <Column
                    title="Service"
                    dataIndex="serviceName"
                    key="serviceName"
                  />
                  <Column
                    title="Price"
                    dataIndex="servicePrice"
                    key="servicePrice"
                    render={(servicePrice: number) =>
                      NumberFormat(servicePrice)
                    }
                  />
                  <Column
                    title="Status"
                    dataIndex="status"
                    key="status"
                    render={(status: number) => getStatusTag(status)}
                  />
                </Table>

                <Button
                  onClick={showDrawer}
                  style={{
                    width: "fit-content",
                    marginLeft: "auto",
                  }}
                >
                  Room services
                </Button>
                <Drawer title="Room Services" onClose={onClose} open={open}>
                  <p>Some contents...</p>
                  <p>Some contents...</p>
                  <p>Some contents...</p>
                </Drawer>
              </Flex>
            </Col>
          </Row>
        )}
      </Space>
    </Layout>
  );
};

export default RoomDetail;
