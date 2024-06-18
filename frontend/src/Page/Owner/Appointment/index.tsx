import { Input } from "@material-tailwind/react";
import {
  Table,
  TableProps
} from "antd";
import {ApiOutlined} from "@ant-design/icons"
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../..//context/userContext";
import { useNavigate } from "react-router-dom";
import { getOwnerAppointment } from "../../../api/Owner/ownerAppointment";

const OwnerAppointment: React.FC = () => {

  const [appointmenttData, setAppointmentData] = useState<AppointmentView[]>([]);
  const [filteredData, setFilteredData] = useState<AppointmentView[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const navigate = useNavigate();
  const { token, userId, userPackageStatus } = useContext(UserContext);

  const fetchAppointmentList = async () => {
    try {
      if (token != undefined && userId) {
        let data: AppointmentView[] | undefined;
          data = await getOwnerAppointment(userId, token);
          setAppointmentData(data || []);
          setFilteredData(data || []);
        }
      } catch (error) {
      console.error("Error fetching appointment list:", error);
    }
  };

  useEffect(() => {
    fetchAppointmentList();
  }, [userId, token]);

  useEffect(() => {
    if (appointmenttData) {
      const filtered = appointmenttData.filter(
        (appointment) =>
            appointment.hostelName.toLowerCase().includes(searchInput.toLowerCase()) ||
            appointment.hostelAddress.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchInput, appointmenttData]);


  const columns: TableProps<AppointmentView>["columns"] = [
    {
      title: "No",
      width: "5%",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: "Hostel Name",
      dataIndex: "hostelName",
      width: "15%",
    },
    {
      title: "Hostel Address",
      dataIndex: "hostelAddress",
      width: "60%",
    },
    {
    title: "",
    dataIndex: "operation",
    render: (_: any, record: AppointmentView) => (
        <a onClick={() => navigate(`/owner/appointments/detail/${record.hostelID}`)}>View details</a>
    ),
    width: "10%",
    },
  ];


  return (
    <>
    {userPackageStatus == 0 ? (
      <div>
      {/* Bảng danh sách */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
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

export default OwnerAppointment;
