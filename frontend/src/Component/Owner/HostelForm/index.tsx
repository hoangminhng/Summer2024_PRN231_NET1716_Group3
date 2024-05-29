import { Button, Form, Input, Modal, Spin, Upload, notification } from "antd";
import { useContext, useState } from "react";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { UserContext } from "../../../context/userContext";
import { createHostel, uploadImage } from "../../../api/Owner/ownerHostel";

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

interface HostelFormProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  fetchOwnerHostels: () => void;
}

const HostelForm: React.FC<HostelFormProps> = ({
  modalOpen,
  setModalOpen,
  fetchOwnerHostels,
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
    console.log("Loading: ", loading);
    console.log("Received values:", values);
    const { hostelName, hostelAddress, hostelDescription } = values;

    if (userId !== undefined) {
      const hostelPayload: CreateHostelRequest = {
        hostelName: hostelName,
        hostelAddress: hostelAddress,
        hostelDescription: hostelDescription,
        accountID: userId,
      };

      try {
        const response = await createHostel(token, hostelPayload);
        console.log("Hostel created successfully:", response);

        if (response) {
          const newHostelId = response.hostelID;
          if (fileList.length > 0) {
            await uploadImage(token, newHostelId, fileList[0]);
          }
        }

        handleCancel();
        openNotificationWithIcon("success", "Create new hostel successfully");
        fetchOwnerHostels();
      } catch (error) {
        console.error("Failed to create hostel:", error);
        openNotificationWithIcon("error", "Create new hostel successfully");
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
          Hostel Information
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
        name="hostelForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="hostelName"
          label="Hostel Name"
          rules={[{ required: true, message: "Please input hostel name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="hostelAddress"
          label="Hostel Address"
          rules={[{ required: true, message: "Please input hostel address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="hostelDescription"
          label="Hostel Description"
          rules={[
            { required: true, message: "Please input hostel description!" },
          ]}
        >
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item
          name="image"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            maxCount={1}
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

export default HostelForm;
