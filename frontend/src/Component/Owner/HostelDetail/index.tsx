import {
  Button,
  Carousel,
  Descriptions,
  Flex,
  Image,
  Modal,
  Popconfirm,
  Select,
  Spin,
} from "antd";
import Title from "antd/es/typography/Title";
import { LoadingOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import {
  getOwnerHostelDetail,
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
  const { token } = useContext(UserContext);

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

  useEffect(() => {
    if (modalOpen) {
      fetchHostelDetail();
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
      footer={[
        <Button key="submit" type="primary" onClick={() => setModalOpen(false)}>
          OK
        </Button>,
      ]}
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
            <Descriptions.Item label="Name" span={2}>
              {hostelDetailData?.hostelName}
            </Descriptions.Item>
            <Descriptions.Item label="Type" span={1}>
              {hostelDetailData?.hostelType}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {hostelDetailData?.hostelAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
              {hostelDetailData?.hostelDescription}
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
            <Descriptions.Item label="Available Rooms" span={2}>
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
