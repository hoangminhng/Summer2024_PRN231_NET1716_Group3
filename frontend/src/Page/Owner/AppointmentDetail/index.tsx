import { Input } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Table,
  TableProps,
  Tag, 
  Button,
  Modal,
  notification,
  Spin
} from "antd";
import {ApiOutlined, LoadingOutlined} from "@ant-design/icons"
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../..//context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import { CancelAppointment, getOwnerAppointmentDetail } from "../../../api/Owner/ownerAppointment";
import { DateFormat } from "../../../Utils/dateFormat";
import { getOwnerCurrentActiveMembership } from "../../../api/Owner/ownerPackage";

const OwnerAppointmentDetail: React.FC = () => {

  const [appointmenttData, setAppointmentData] = useState<Appointment[]>([]);
  const [filteredData, setFilteredData] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [activePackage ,setActivePackage] = useState<RegisterPackage>();
  const { hostelID } = useParams<{ hostelID: string }>();
  const [idnumber, setID] = useState<number>();
  const [errorContent, setErrorContent] = useState<any>("");
  const [packageLoading, setPackageLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  const fetchAppointmentDetailList = async () => {
    try {
      if (token != undefined && hostelID) {
        let data: Appointment[] | undefined;
          data = await getOwnerAppointmentDetail(parseInt(hostelID), token);
          setAppointmentData(data || []);
          setID(parseInt(hostelID));
          setFilteredData(data || []);
        }
      } catch (error) {
      console.error("Error fetching appointment list:", error);
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

  const fetchCancelAppointment = async (appointmentID : number) => {
    try {
      if (token != undefined) {
          let data = await CancelAppointment(token, appointmentID);
          return data;
        }
      } catch (error : any) {
        setErrorContent(error.message);
    }
  };

  useEffect(() => {
    fetchStatusPackage();
  }, [token]);


  useEffect(() => {
    if (!packageLoading) {
      fetchAppointmentDetailList();
    }
  }, [packageLoading, idnumber, token]);

  useEffect(() => {
    if (appointmenttData) {
      const filtered = appointmenttData.filter(
        (appointment) =>
            appointment.viewerName.toLowerCase().includes(searchInput.toLowerCase()) ||
            appointment.viewerPhone.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchInput, appointmenttData]);

    
const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
    notification[type]({
      message: "Notification Title",
      description: description,
    });
  };
  const statusStringMap: { [key: number]: string } = {
    0 : "VIEW",
    1 : "ACCEPT",
    2 : "CANCEL",
    3 : "HIRING DIRECTLY"
  };

const statusColorMap: { [key: number]: string } = {
    0 : "yellow",
    1 : "green",
    2 : "red",
    3 : "orange"
};

const [isModalOpen, setIsModalOpen] = useState(false);
const showModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    if (selectedAppointment) {
        const response = await fetchCancelAppointment(selectedAppointment.viewRoomAppointmentId);
        if (response != undefined && !errorContent) {
            setIsModalOpen(false);
            fetchAppointmentDetailList();
            openNotificationWithIcon("success", "Cancel appointment successfully!");
        } else {
        setErrorContent("");
        setIsModalOpen(false);
        openNotificationWithIcon("error", errorContent || "Have some error when canel appointment!");
        }
        };
    
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

const handleBackToList = () => {
    navigate("/owner/appointments"); 
  };

  const columns: TableProps<Appointment>["columns"] = [
    {
      title: "No",
      width: "5%",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
        title: "Room",
        dataIndex: "roomName",
        width: "20%",
    },
    {
        title: "Viewer",
        dataIndex: "viewerName",
        width: "20%",
    },
    {
        title: "Phone",
        dataIndex: "viewerPhone",
        width: "10%",
    },
    {
        title: "Appointment Time",
        dataIndex: "appointmentTime",
        width: "15%",
        render: (appointmentTime : Date) => {
            let date = DateFormat(appointmentTime)
            return (
                <p>{date}</p>
            );
        },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      render: (appointment_Status: number) => {
        let color = statusColorMap[appointment_Status];
        let status = statusStringMap[appointment_Status]
        return (
          <Tag color={color} key={appointment_Status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
       title: "",
       dataIndex: "status",
       width: "10%",
       render: (appointment_Status : number, record: Appointment) =>{
        return (
            <div>
                {appointment_Status === 0 && (
            <Button
              type="primary"
              onClick={() => showModal(record)}
              style={{ marginLeft: "10px" }}    
            >
              Cancel
            </Button>
                )}
                <Modal title="Notification" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p style={{color: "red"}}>Do you want to cancel the meeting with this house viewer ? (The system will notify this account via email.)</p>
      </Modal>
            </div>
        );
       },
    },
  ];


  return (
    <>
    {packageLoading ? (
        <Spin
          spinning={true}
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        />
      ) : activePackage ? (
        <div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div style={{display:"flex", justifyContent:"space-between", marginTop: "10px"}}>
            <Button onClick={handleBackToList}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
            </Button>
            </div>
            <br />
            <br />

          <h3 title="Appointment List"/>
            <br />
            <div className="w-full md:w-72 flex flex-row justify-start">
            <Input
              label="Search by Hostel Name or Room Name"
              value={searchInput}
              crossOrigin={undefined}
              onChange={(e) => { setSearchInput(e.target.value); } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}           
             />
            </div>
          </div>
          <Table columns={columns} dataSource={filteredData} bordered pagination={{ pageSize: 8 }}/>
        </div>
      ) : (
      <div className="w-full text-center items-center justify-between">
        <ApiOutlined style={{fontSize:"100px", marginTop:"50px"}}/>
        <p style={{fontWeight: "bold"}}>Your current account has not registered for the package, so you cannot access this page. Please register for a membership package to use.</p>
      </div>
    )}
    </>
  );
};

export default OwnerAppointmentDetail;
