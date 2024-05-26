import { Input } from "@material-tailwind/react";
import {
  Table,
  TableProps,
  Tag,
} from "antd";
import { useState, useEffect } from "react";
import {
  getMemberShips
} from "../../../../api/Admin/adminAccounts";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { useNavigate } from "react-router-dom";
import { DateFormat } from "../../../../Utils/dateFormat";

const AdminMemberShips: React.FC = () => {

  const [membershipData, setMembershipData] = useState<MemberShip[]>([]);
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<MemberShip[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const { token } = useContext(UserContext);

  const fetchMemberList = async () => {
    try {
      if (token) {
        let data: MemberShip[] | undefined;
          data = await getMemberShips(token);
          setMembershipData(data || []);
          setFilteredData(data || []);
        }
      } catch (error) {
      console.error("Error fetching membership list:", error);
    }
  };

  useEffect(() => {
    fetchMemberList();
  }, [token]);

  useEffect(() => {
    if (membershipData) {
      const filtered = membershipData.filter(
        (membership) =>
            membership.email.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchInput, membershipData]);


  const columns: TableProps<MemberShip>["columns"] = [
    {
      title: "No",
      width: "5%",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: "Account Email",
      dataIndex: "email",
      width: "20%",
    },
    {
        title: "MemberShip Package",
        dataIndex: "membershipName",
        width: "35%",
    },
    {
        title: "Date Register",
        dataIndex: "dateRegister",
        render: (dateRegister: Date) => DateFormat(dateRegister),
        width: "15%",
    },
    {
        title: "Date Expire",
        dataIndex: "dateExpire",
        render: (dateExpire: Date) => DateFormat(dateExpire),
        width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "5%",
      render: (account_Status: number) => {
        let color = account_Status === 1 ? "volcano" : "green";
        let status = account_Status === 1 ? "EXPIRE" : "ACTIVE"
        return (
          <Tag color={color} key={account_Status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: MemberShip) => (
        <a onClick={() => navigate(`/admin/memberships/detail/${record.memberShipTransactionID}`)}>View details</a>
      ),
      width: "10%",
    },
  ];


  return (
    <>
        <div>
          {/* Bảng danh sách */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h3 title="MemberShips List"/>
            <br />
            <div className="w-full md:w-72 flex flex-row justify-start">
            <Input
              label="Search by Email"
              value={searchInput}
              crossOrigin={undefined}
              onChange={(e) => { setSearchInput(e.target.value); } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}           
             />
            </div>
          </div>
          <Table columns={columns} dataSource={filteredData} bordered />
        </div>
    </>
  );
};

export default AdminMemberShips;
