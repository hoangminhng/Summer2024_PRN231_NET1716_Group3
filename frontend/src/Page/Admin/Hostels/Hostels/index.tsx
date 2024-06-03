import { Input } from "@material-tailwind/react";
import {
  Table,
  TableProps,
  Tag,
} from "antd";
import { useState, useEffect } from "react";
import {
    getHostel
} from "../../../../api/Admin/adminHostels";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/userContext";

const AdminHostels: React.FC = () => {

  const [hostelData, setHostelData] = useState<AdminHostel[]>([]);
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<AdminHostel[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const { token } = useContext(UserContext);

  const fetchHostelList = async () => {
    try {
      if (token != undefined) {
        let data: AdminHostel[] | undefined;
          data = await getHostel(token);
          setHostelData(data || []);
          setFilteredData(data || []);
        }
      } catch (error) {
      console.error("Error fetching hostels list:", error);
    }
  };

  useEffect(() => {
    fetchHostelList();
  }, [token]);

  useEffect(() => {
    if (hostelData) {
      const filtered = hostelData.filter(
        (hostel) =>
            hostel.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            hostel.email.toLowerCase().includes(searchInput.toLowerCase()) ||
            hostel.hostelName.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchInput, hostelData]);


  const columns: TableProps<AdminHostel>["columns"] = [
    {
      title: "No",
      width: "5%",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: "Hostel Name",
      dataIndex: "hostelName",
      width: "20%",
    },
    {
      title: "Hostel Address",
      dataIndex: "hostelAddress",
      width: "30%",
    },
    {
        title: "Account Name",
        dataIndex: "name",
        width: "15%",
    },
    {
        title: "Account Email",
        dataIndex: "email",
        width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "5%",
      render: (hostel_Status: number) => {
        let color = hostel_Status === 1 ? "volcano" : "green";
        let status = hostel_Status === 1 ? "BLOCK" : "ACTIVE"
        return (
          <Tag color={color} key={hostel_Status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
        title: "",
        dataIndex: "operation",
        render: (_: any, record: AdminHostel) => (
          <a onClick={() => navigate(`/admin/hostels/detail/${record.hostelID}`)}>View details</a>
        ),
        width: "10%",
      },
  ];

  

  return (
    <>
        <div>
          {/* Bảng danh sách */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h3 title="Hostels List"/>
            <br />
            <div className="w-full md:w-72 flex flex-row justify-start">
            <Input
              label="Search by Name or Email"
              value={searchInput}
              crossOrigin={undefined}
              onChange={(e) => { setSearchInput(e.target.value); } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}           
             />
            </div>
          </div>
          <Table columns={columns} dataSource={filteredData} bordered pagination={{ pageSize: 8 }}/>
        </div>
    </>
  );
};

export default AdminHostels;
