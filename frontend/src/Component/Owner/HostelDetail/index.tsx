import {
  Button,
  Carousel,
  Descriptions,
  Flex,
  Image,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  notification,
} from "antd";
import Title from "antd/es/typography/Title";
import { LoadingOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import {
  getHostelType,
  getOwnerHostelDetail,
  updateHostel,
  updateHostelStatus,
} from "../../../api/Owner/ownerHostel";
import { UserContext } from "../../../context/userContext";

interface HostelDetailProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  hostelId: number;
  onClose: () => void;
}

const HostelDetail: React.FC<HostelDetailProps> = ({
  modalOpen,
  setModalOpen,
  hostelId,
  onClose,
}) => {
  const [hostelDetailData, setHostelDetailData] =
    useState<OwnerHostel | null>();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<number | undefined>(
    undefined
  );
  const [statusToChange, setStatusToChange] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hostelTypes, setHostelTypes] = useState<HostelType[]>([]);
  const [editValues, setEditValues] = useState({
    hostelName: "",
    hostelAddress: "",
    hostelDescription: "",
    hostelType: "",
  });
  const { token, userId } = useContext(UserContext);

  const fetchHostelDetail = async () => {
    if (hostelId !== undefined) {
      setLoading(true);
      try {
        const response = await getOwnerHostelDetail(hostelId);
        setHostelDetailData(response);
        setCurrentStatus(response?.status);
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchHostelTypes = async () => {
    try {
      const response = await getHostelType();
      if (response) {
        setHostelTypes(response);
      }
    } catch (error) {
      console.error("Failed to fetch hostel types:", error);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      fetchHostelDetail();
      fetchHostelTypes();
    }
  }, [modalOpen, hostelId]);

  const handleStatusChange = (value: number) => {
    setStatusToChange(value);
  };

  const handleConfirmStatusChange = async () => {
    if (token && hostelId && statusToChange !== null) {
      setLoading(true);
      try {
        await updateHostelStatus(token, hostelId, statusToChange);
        setOpen(false);
        setStatusToChange(null);
        setModalOpen(false);
        onClose();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelStatusChange = () => {
    setOpen(false);
    setStatusToChange(null);
  };

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleConfirmEdit = async () => {
    if (token && hostelId && hostelDetailData && userId) {
      setLoading(true);
      try {
        const selectedType = hostelTypes.find(
          (type) => type.value === editValues.hostelType
        );

        if (!selectedType) {
          console.error("Selected hostel type not found in hostelTypes array.");
          return;
        }
        console.log("Information update: ", editValues);
        const updateDetails: UpdateHostelRequest = {
          HostelName: editValues.hostelName,
          HostelAddress: editValues.hostelAddress,
          HostelDescription: editValues.hostelDescription,
          HostelType: selectedType.key,
          AccountID: userId,
        };

        const response = await updateHostel(token, hostelId, updateDetails);

        if (response.statusCode === 200) {
          notification.success({
            message: "Success",
            description: response.message,
          });

          fetchHostelDetail();
          setIsEditing(false);
          setModalOpen(false);
          onClose();
        }
      } catch (error) {
        console.error("Error updating hostel details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditValues({
      ...editValues,
      [field]: value,
    });
  };

  const handleTypeChange = (value: string) => {
    setEditValues({
      ...editValues,
      hostelType: value,
    });
  };

  const handleEdit = () => {
    setEditValues({
      hostelName: hostelDetailData?.hostelName || "",
      hostelAddress: hostelDetailData?.hostelAddress || "",
      hostelDescription: hostelDetailData?.hostelDescription || "",
      hostelType: hostelDetailData?.hostelType || "",
    });
    setIsEditing(true);
  };

  return (
    <Modal
      centered
      style={{ maxWidth: "90%" }}
      width={1000}
      title={
        <Title level={2} style={{ textAlign: "center", width: "100%" }}>
          Hostel Information
        </Title>
      }
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={
        isEditing ? (
          <>
            <Button key="confirm" type="primary" onClick={handleConfirmEdit}>
              Confirm
            </Button>
            <Button key="cancel" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button key="edit" type="primary" onClick={handleEdit}>
              Edit
            </Button>
            <Button key="ok" onClick={() => setModalOpen(false)}>
              OK
            </Button>
          </>
        )
      }
    >
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
        </div>
      ) : (
        <Flex vertical align="center">
          <Carousel
            autoplay
            effect="fade"
            style={{ width: 300, marginBottom: 20 }}
          >
            {hostelDetailData?.images.map((imageUrl) => (
              <Image
                width={"100%"}
                height={200}
                key={imageUrl}
                src={imageUrl}
                alt="Hostel Image"
              />
            ))}
          </Carousel>
          <Descriptions bordered style={{ marginTop: 20 }}>
            <Descriptions.Item label="Name" span={1}>
              {isEditing ? (
                <Input
                  value={editValues.hostelName}
                  onChange={(e) =>
                    handleInputChange("hostelName", e.target.value)
                  }
                />
              ) : (
                hostelDetailData?.hostelName
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Type" span={2}>
              {isEditing ? (
                <Select
                  value={editValues?.hostelType}
                  onChange={handleTypeChange}
                  style={{ width: 200 }}
                  options={hostelTypes}
                />
              ) : (
                hostelDetailData?.hostelType
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={3}>
              {isEditing ? (
                <Input
                  value={editValues?.hostelAddress}
                  onChange={(e) =>
                    handleInputChange("hostelAddress", e.target.value)
                  }
                />
              ) : (
                hostelDetailData?.hostelAddress
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
              {isEditing ? (
                <Input.TextArea
                  value={editValues?.hostelDescription}
                  onChange={(e) =>
                    handleInputChange("hostelDescription", e.target.value)
                  }
                />
              ) : (
                hostelDetailData?.hostelDescription
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={3}>
              <Select
                value={statusToChange !== null ? statusToChange : currentStatus}
                onChange={handleStatusChange}
                style={{ width: 120 }}
                options={[
                  { value: 0, label: "Prepare" },
                  { value: 1, label: "Available" },
                  { value: 2, label: "Block" },
                  { value: 3, label: "Full" },
                ]}
              ></Select>
              {statusToChange !== null && (
                <Popconfirm
                  open={open}
                  title="Are you sure you want to change the hostel status?"
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
                  <Button onClick={showPopconfirm} style={{ marginLeft: 20 }}>
                    Update Status
                  </Button>
                </Popconfirm>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Available Rooms" span={1}>
              {hostelDetailData?.numOfAvailableRoom}
            </Descriptions.Item>
            <Descriptions.Item label="Total Rooms" span={2}>
              {hostelDetailData?.numOfTotalRoom}
            </Descriptions.Item>
          </Descriptions>
        </Flex>
      )}
    </Modal>
  );
};

export default HostelDetail;
