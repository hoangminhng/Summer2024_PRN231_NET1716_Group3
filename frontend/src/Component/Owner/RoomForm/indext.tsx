import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Spin,
  Upload,
  notification,
} from "antd";
import { useContext, useState } from "react";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { UserContext } from "../../../context/userContext";
import { createRoom, uploadImage } from "../../../api/Owner/ownerRoom";

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
    form.resetFields();
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
    const { roomName, capacity, length, width, description, roomFee } = values;

    if (userId !== undefined && hostelId !== undefined) {
      const roomPayload: CreateRoomRequest = {
        roomName,
        capacity,
        length,
        width,
        description,
        roomFee,
        hostelID: parseInt(hostelId),
      };

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

  return (
    <Modal
      width={1000}
      title={
        <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
          Room Information | Hostel {hostelId}
        </Title>
      }
      centered
      open={modalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel} size="large">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          size="large"
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
        </Button>,
      ]}
    >
      <Form
        form={form}
        {...formItemLayout}
        name="roomForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
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
          <InputNumber min={1} max={5} />
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
      </Form>

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
