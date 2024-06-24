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
  Input,
  notification,
} from "antd";
import { LoadingOutlined, ApiOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getOwnerRoomDetail,
  updateRoom,
  updateRoomStatus,
  updateServicePrices,
} from "../../../api/Owner/ownerRoom";
import Column from "antd/es/table/Column";
import { NumberFormat } from "../../../Utils/numberFormat";
import { UserContext } from "../../../context/userContext";
import { getOwnerCurrentActiveMembership } from "../../../api/Owner/ownerPackage";

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
  const [currentStatus, setCurrentStatus] = useState<number | undefined>(undefined);
  const [popConfirmOpen, setPopConfirmOpen] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();
  const [activePackage, setActivePackage] = useState<RegisterPackage>();
  const [packageLoading, setPackageLoading] = useState(true);
  const { token } = useContext(UserContext);
  const [updatedPrices, setUpdatedPrices] = useState<{ [key: string]: number }>(
    {}
  );
  const [roomServices, setRoomServices] = useState<RoomService[]>([]);
  const [allPrices, setAllPrices] = useState<
    { typeServiceId: number; price: number }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    length: "",
    width: "",
    capacity: "",
    roomFee: "",
    roomName: "",
    description: "",
  });

  const fetchRoomDetail = async () => {
    setLoading(true);
    try {
      if (token && roomId) {
        const response = await getOwnerRoomDetail(parseInt(roomId), token);
        setRoomDetailData(response);
        setRoomServices(response?.roomServices || []);
        setCurrentStatus(response?.status);
      }
    } catch (error) {
      console.error("Error fetching room detail:", error);
    } finally {
      setLoading(false);
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
      fetchRoomDetail();
    }
  }, [packageLoading, roomId]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleConfirmStatusChange = async () => {
    if (token && roomId && statusToChange !== null) {
      setLoading(true);
      try {
        await updateRoomStatus(token, parseInt(roomId), statusToChange);
        fetchRoomDetail();

        notification.success({
          message: "Success",
          description: "Change room status successfully",
          duration: 1,
        });
      } catch (error) {
        console.error("Error updating room status:", error);
      } finally {
        setStatusToChange(null);
        setPopConfirmOpen(false);
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

  const handleUpdatePrice = async () => {
    try {
      if (!token || !roomId) return;

      const servicesToUpdate = allPrices.map((price) => ({
        typeServiceId: price.typeServiceId,
        price: updatedPrices[price.typeServiceId] || price.price,
      }));

      if (servicesToUpdate.length === 0) {
        notification.info({
          message: "No Changes",
          description: "No prices have been updated.",
        });
        return;
      }

      await updateServicePrices(roomId, servicesToUpdate, token);
      console.log(roomId);
      console.log(servicesToUpdate);

      notification.success({
        message: "Success",
        description: "Service prices updated successfully",
      });

      fetchRoomDetail();
    } catch (error) {
      console.error("Error updating service prices:", error);
      notification.error({
        message: "Error",
        description: "Failed to update service prices",
      });
    }
  };

  const handlePriceChange = (typeServiceId: number, price: number) => {
    setUpdatedPrices((prevPrices) => ({
      ...prevPrices,
      [typeServiceId]: price,
    }));
  };

  useEffect(() => {
    if (roomServices && roomServices.length > 0) {
      const initialPrices = roomServices.map((service) => ({
        typeServiceId: service.typeServiceID,
        price: service.servicePrice,
      }));
      setAllPrices(initialPrices);
    }
  }, [roomServices]);

  const toggleEditMode = () => {
    if (!isEditing) {
      setEditValues({
        length: roomDetailData?.lenght.toString() || "",
        width: roomDetailData?.width.toString() || "",
        capacity: roomDetailData?.capacity.toString() || "",
        roomFee: roomDetailData?.roomFee.toString() || "",
        roomName: roomDetailData?.roomName || "",
        description: roomDetailData?.description || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditValues({
      ...editValues,
      [field]: value,
    });
  };

  const handleUpdateRoomDetails = async () => {
    if (!token || !roomId) return;
    setLoading(true);
    try {
      const updatedDetails: UpdateRoomRequest = {
        roomName: editValues.roomName,
        length: parseFloat(editValues.length),
        width: parseFloat(editValues.width),
        capacity: parseInt(editValues.capacity),
        roomFee: parseFloat(editValues.roomFee),
        description: editValues.description,
        hostelID: roomDetailData?.hostelID ?? 0,
      };

      const response = await updateRoom(
        token,
        parseInt(roomId),
        updatedDetails
      );

      if (response.statusCode === 200) {
        notification.success({
          message: "Success",
          description: response.message,
        });

        fetchRoomDetail();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating room details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    setIsEditing(false);
    setEditValues({
      length: "",
      width: "",
      capacity: "",
      roomFee: "",
      roomName: "",
      description: "",
    });
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

                    {isEditing && (
                      <Input
                        value={editValues.roomName}
                        onChange={(e) =>
                          handleInputChange("roomName", e.target.value)
                        }
                        placeholder="Room Name"
                        style={{ marginBottom: 16 }}
                      />
                    )}

                    {isEditing && (
                      <Input.TextArea
                        value={editValues.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Room Description"
                        rows={4}
                        style={{ marginBottom: 16 }}
                      />
                    )}

                    <Descriptions bordered>
                      <Descriptions.Item label="Length" span={1}>
                        {isEditing ? (
                          <Input
                            value={editValues.length}
                            onChange={(e) =>
                              handleInputChange("length", e.target.value)
                            }
                          />
                        ) : (
                          `${roomDetailData?.lenght} ${lengthUnit}`
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Width" span={2}>
                        {isEditing ? (
                          <Input
                            value={editValues.width}
                            onChange={(e) =>
                              handleInputChange("width", e.target.value)
                            }
                          />
                        ) : (
                          `${roomDetailData?.width} ${widthUnit}`
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Capacity" span={1}>
                        {isEditing ? (
                          <Input
                            value={editValues.capacity}
                            onChange={(e) =>
                              handleInputChange("capacity", e.target.value)
                            }
                          />
                        ) : (
                          `${roomDetailData?.capacity} people`
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Fee" span={2}>
                        {isEditing ? (
                          <Input
                            value={editValues.roomFee}
                            onChange={(e) =>
                              handleInputChange("roomFee", e.target.value)
                            }
                          />
                        ) : (
                          NumberFormat(roomDetailData?.roomFee ?? 0)
                        )}
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
                    <Flex gap="small">
                      <Button
                        onClick={
                          isEditing ? handleUpdateRoomDetails : toggleEditMode
                        }
                      >
                        {isEditing ? "Update" : "Edit"}
                      </Button>
                      {isEditing && (
                        <Button onClick={handleCancelUpdate}>Cancel</Button>
                      )}
                    </Flex>
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
                          statusToChange !== null
                            ? statusToChange
                            : currentStatus
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
                    <div
                      dangerouslySetInnerHTML={{
                        __html: roomDetailData?.description || "......",
                      }}
                    />

                    <Table
                      dataSource={roomServices}
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

                    <Drawer
                      title="Room Services"
                      onClose={onClose}
                      visible={open}
                      width={600}
                    >
                      {roomServices.map((service) => (
                        <div
                          key={service.serviceID}
                          style={{ marginBottom: 16 }}
                        >
                          <Row gutter={16} align="middle">
                            <Col span={8}>
                              <Text strong>{service.serviceName}</Text>
                            </Col>
                            <Col span={8}>
                              <Input
                                type="number"
                                defaultValue={service.servicePrice.toString()}
                                onChange={(e) =>
                                  handlePriceChange(
                                    service.typeServiceID,
                                    parseFloat(e.target.value)
                                  )
                                }
                                style={{ width: "100%" }}
                              />
                            </Col>
                            <Col span={8}></Col>
                          </Row>
                        </div>
                      ))}
                      <Button
                        type="primary"
                        style={{ width: "100%", marginTop: 16 }}
                        onClick={handleUpdatePrice}
                        disabled={Object.keys(updatedPrices).length === 0}
                      >
                        Update Prices
                      </Button>
                    </Drawer>
                  </Flex>
                </Col>
              </Row>
            )}
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

export default RoomDetail;
