import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Spin,
  Steps,
  Upload,
  notification,
  Flex,
  Select,
  Space,
} from "antd";
import { useContext, useEffect, useState } from "react";
import {
  LoadingOutlined,
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { UserContext } from "../../../context/userContext";
import { createRoom, uploadImage } from "../../../api/Owner/ownerRoom";
import { getTypeServices } from "../../../api/typeService";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};

interface RoomFormProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  hostelId: string | undefined;
  fetchRooms: () => void;
}

const steps = [
  {
    title: "Room info",
    content: "First-content",
  },
  {
    title: "Room service",
    content: "Second-content",
  },
];

const RoomForm: React.FC<RoomFormProps> = ({
  modalOpen,
  setModalOpen,
  hostelId,
  fetchRooms,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const { userId, token } = useContext(UserContext);
  const [typeServices, setTypeServices] = useState<TypeService[]>([]);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [selectedServices, setSelectedServices] = useState<number[]>([1, 2]);
  const [isCreateButtonEnabled, setIsCreateButtonEnabled] = useState(false);

  const defaultSelectedServices = [
    { typeService: 1, price: 0 }, // Electricity
    { typeService: 2, price: 0 }, // Water
  ];

  useEffect(() => {
    setIsCreateButtonEnabled(selectedServices.length > 0);
  }, [selectedServices]);

  useEffect(() => {
    if (current === 1) {
      const fetchData = async () => {
        try {
          const response = await getTypeServices();
          if (response) {
            setTypeServices(response);
          }
        } catch (error) {
          console.error("Failed to fetch type services:", error);
        }
      };

      fetchData();
    }
  }, [current]);

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev: any) => ({ ...prev, ...values }));
      setCurrent(current + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  type NotificationType = "success" | "info" | "warning" | "error";
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, message: any) => {
    api[type]({
      message: message,
      duration: 2,
    });
  };

  const handleCancel = () => {
    setModalOpen(false);
    setCurrent(0);
    form.resetFields();
  };

  const handleSelectService = (value: number, selected: boolean) => {
    if (selected) {
      setSelectedServices((prev) => [...prev, value]);
    } else {
      setSelectedServices((prev) => prev.filter((id) => id !== value));
    }

    console.log(selectedServices);
  };

  const onFinish = async (values: any) => {
    console.log("FILE", fileList);
    if (fileList.length === 0) {
      openNotificationWithIcon("warning", "Please upload hostel image!");
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log("Received values:", values);

    const mergedValues = { ...formData, ...values };
    const {
      roomName,
      capacity,
      length,
      width,
      description,
      roomFee,
      services,
    } = mergedValues;

    if (userId !== undefined && hostelId !== undefined) {
      const roomPayload: CreateRoomRequest = {
        roomName,
        capacity,
        length,
        width,
        description,
        roomFee,
        hostelID: parseInt(hostelId),
        roomServices: services.map((service: any) => ({
          typeServiceID: service.typeService,
          price: service.price,
        })),
      };

      console.log("Room payload: ", roomPayload);

      try {
        const response = await createRoom(token, roomPayload);
        console.log("Rooom created successfully:", response);
        if (response) {
          const newRoomId = response.roomID;
          if (fileList.length > 0) {
            const uploadResponse = await uploadImage(
              token,
              newRoomId,
              fileList
            );

            console.log("Upload response: ", uploadResponse);
            if (uploadResponse.statusCode == 200) {
              handleCancel();
              openNotificationWithIcon("success", "Create room successfully");
              fetchRooms();
            }
          }
        } else {
          openNotificationWithIcon("error", "Create room failed");
        }
      } catch (error) {
        console.error("Failed to create hostel:", error);
        openNotificationWithIcon("error", "Create room failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearServices = () => {
    const filteredServices = selectedServices.filter(
      (serviceId) => serviceId === 1 || serviceId === 2
    );
    setSelectedServices(filteredServices);
    setIsCreateButtonEnabled(filteredServices.length > 0);
    form.setFieldsValue({
      services: filteredServices.map((id) => ({ typeService: id, price: 0 })),
    });
  };

  return (
    <Modal
      width={1000}
      title={
        <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
          Room Information
        </Title>
      }
      centered
      open={modalOpen}
      onCancel={handleCancel}
      footer={[]}
    >
      <Steps
        current={current}
        items={items}
        style={{ paddingLeft: 50, paddingRight: 50 }}
      />

      <Form
        form={form}
        {...formItemLayout}
        name="roomForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        {current === 0 && (
          <div
            style={{
              marginTop: 50,
            }}
          >
            <Form.Item
              name="roomName"
              label="Room Name"
              rules={[{ required: true, message: "Please input room name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="capacity"
              label="Capacity"
              rules={[{ required: true, message: "Please input capacity!" }]}
            >
              <InputNumber min={1} max={10} />
            </Form.Item>

            <Form.Item
              name="length"
              label="Length (in meters)"
              rules={[{ required: true, message: "Please input length!" }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              name="width"
              label="Width (in meters)"
              rules={[{ required: true, message: "Please input width!" }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              name="description"
              label="Room Description"
              rules={[
                { required: true, message: "Please input room description!" },
              ]}
            >
              <Input.TextArea showCount maxLength={100} />
            </Form.Item>

            <Form.Item
              name="roomFee"
              label="Room Fee"
              rules={[{ required: true, message: "Please input room fee!" }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              name="image"
              label="Upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              required
            >
              <Upload
                maxCount={3}
                multiple
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </div>
        )}

        {current === 1 && (
          <div
            style={{
              marginTop: 50,
            }}
          >
            <Title level={3} style={{ marginBottom: 10 }}>
              Room Services
            </Title>
            <Form.List name="services" initialValue={defaultSelectedServices}>
              {(fields, { add }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "typeService"]}
                        rules={[
                          {
                            required: true,
                            message: "Please select a service!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select service"
                          style={{ width: 200 }}
                          onSelect={(value) => handleSelectService(value, true)}
                          onDeselect={(value) =>
                            handleSelectService(value, false)
                          }
                        >
                          {typeServices.map((service) => (
                            <Select.Option
                              key={service.typeServiceID}
                              value={service.typeServiceID}
                              disabled={selectedServices.includes(
                                service.typeServiceID
                              )}
                            >
                              {service.typeName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the price!",
                          },
                          () => ({
                            validator(_, value) {
                              if (value > 0) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Price must be greater than 0!")
                              );
                            },
                          }),
                        ]}
                      >
                        <InputNumber
                          placeholder="Price"
                          min={0}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      style={{ width: "auto", marginRight: 20 }}
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      disabled={selectedServices.length >= typeServices.length}
                    >
                      Add
                    </Button>
                    <Button
                      style={{ width: "auto" }}
                      type="dashed"
                      onClick={handleClearServices}
                      block
                      icon={<MinusCircleOutlined />}
                    >
                      Clear
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        )}
      </Form>

      <div
        style={{
          marginTop: 24,
        }}
      >
        <Flex justify="center">
          <>
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Previous
              </Button>
            )}
            {current === 0 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === 1 && (
              <Button
                key="submit"
                type="primary"
                disabled={!isCreateButtonEnabled}
                onClick={() => {
                  setLoading(true);
                  form
                    .validateFields()
                    .then((values) => {
                      onFinish(values);
                    })
                    .catch((info) => {
                      console.log("Validate Failed:", info);
                      setLoading(false);
                    });
                }}
              >
                Create
              </Button>
            )}
          </>
        </Flex>
      </div>

      <Spin
        fullscreen={true}
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
      />

      {contextHolder}
    </Modal>
  );
};

const normFile = (e: { fileList: any }) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  if (e && e.fileList) {
    return e.fileList;
  }
  return [];
};

export default RoomForm;
