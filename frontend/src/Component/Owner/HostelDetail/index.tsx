import {
  Button,
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
  const [hostelDetailData, setHostelDetailData] = useState<OwnerHostel>();
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
        // console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchHostelDetail();
  }, [hostelId]);

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
      style={{ maxWidth: "90%" }}
      width={800}
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
          <Image width={300} src={hostelDetailData?.thumbnail} />
          <Descriptions bordered style={{ marginTop: 30 }}>
            <Descriptions.Item label="Hostel Name" span={1}>
              {hostelDetailData?.hostelName}
            </Descriptions.Item>
            <Descriptions.Item label="Hostel Address" span={2}>
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
            <Descriptions.Item label="Total Rooms" span={1}>
              {hostelDetailData?.numOfTotalRoom}
            </Descriptions.Item>
          </Descriptions>
        </Flex>
      )}
    </Modal>
  );
};

export default HostelDetail;
