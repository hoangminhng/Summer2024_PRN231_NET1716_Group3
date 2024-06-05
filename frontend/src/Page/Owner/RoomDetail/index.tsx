import {
  Button,
  Carousel,
  Col,
  Descriptions,
  Drawer,
  Flex,
  Image,
  Layout,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOwnerRoomDetail } from "../../../api/Owner/ownerRoom";
import Column from "antd/es/table/Column";
import { NumberFormat } from "../../../Utils/numberFormat";
import {
  getColorByStatus,
  getStatusText,
} from "../../../Utils/roomStatusColor";
const { Text } = Typography;

const getStatusTag = (status: number) => {
  return status === 1 ? (
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
  const { roomId } = useParams<{ roomId: string }>();

  const fetchRoomDetail = async () => {
    if (roomId !== undefined) {
      setLoading(true);
      try {
        const response = await getOwnerRoomDetail(parseInt(roomId));
        setRoomDetailData(response);
        // setCurrentStatus(response?.status);
        console.log(response);
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
                <Carousel autoplay>
                  {roomDetailData?.roomImageUrls.map((imageUrl) => (
                    <Image key={imageUrl} src={imageUrl} alt="Room Image" />
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
                  <Tag
                    style={{ padding: 5 }}
                    color={getColorByStatus(roomDetailData?.status ?? 0)}
                  >
                    {getStatusText(roomDetailData?.status ?? 0)}
                  </Tag>
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
