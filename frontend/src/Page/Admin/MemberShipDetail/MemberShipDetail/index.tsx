import {
  Button,
  Tag,
  Descriptions,
  Table,
  TableProps
} from "antd";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
    getMemberShipDetail, getMemberShipInformationDetail
} from "../../../../api/Admin/adminAccounts";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../context/userContext";
import { NumberFormat } from "../../../../Utils/numberFormat";
import { DateFormat } from "../../../../Utils/dateFormat";

const AdminMemberShipDetail: React.FC = () => {

  const [membershipDetailData, setMembershipDetailData] = useState<MemberShipDetail[]>();
  const [infoData, setInfoData] = useState<MemberShipInformation>();
  const { accountID } = useParams<{ accountID: string }>();
  const [idnumber, setID] = useState<number>();
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  const statusStringMap: { [key: number]: string } = {
    0 : "ACTIVE",
    1 : "EXPIRE",
    2 : "NOT ACTIVE",
  };

  const statusColorMap: { [key: number]: string } = {
    0: "green",
    1: "red",
    2: "grey",
  };

  const fetchMemberShipDetail = async () => {
    try {
      if (token != undefined && accountID != undefined) {
        let data: MemberShipDetail[] | undefined;
        data = await getMemberShipDetail(parseInt(accountID), token);
        setID(parseInt(accountID));
        setMembershipDetailData(data);
      }
    } catch (error) {
      console.error("Error fetching membership detail:", error);
    }
  };
  
  const fetchMemberShipInformationDetail = async () => {
    try {
      if (token != undefined && accountID != undefined) {
        let data: MemberShipInformation | undefined;
        data = await getMemberShipInformationDetail(parseInt(accountID), token);
        setID(parseInt(accountID));
        setInfoData(data);
      }
    } catch (error) {
      console.error("Error fetching membership detail:", error);
    }
  };

  useEffect(() => {
    fetchMemberShipDetail();
    fetchMemberShipInformationDetail();
  }, [idnumber, token]);


  const renderBorderedAccount = () => {
    const items = [
      {
        key: "1",
        label: "Name",
        children: infoData?.name || "",
        span: 3,
      },
      {
        key: "2",
        label: "Email",
        children: infoData?.email || "",
        span: 3,
      },
      {
        key: "3",
        label: "Phone",
        children: infoData?.phone || "",
      },
      {
        key: "4",
        label: "Address",
        children: infoData?.address || "",
      },
      {
        key: "5",
        label: "Status",
        children: infoData ? (
          <Tag
            color={statusColorMap[infoData.isPackage]}
            key={statusStringMap[infoData.isPackage]}
          >
            {statusStringMap[infoData.isPackage].toUpperCase()}
          </Tag>
        ) : (
          ""
        ),
      }
    ];
    return items.map((item) => (
      <Descriptions.Item key={item.key} label={item.label}>
        {item.children}
      </Descriptions.Item>
    ));
  };

  const memberpackageHistory: TableProps<MemberShipDetail>["columns"] = [
    {
      title: "No",
      width: "5%",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: "Package ",
      dataIndex: "membershipName",
      width: "25%",
    },
    {
        title: "Capacity",
        dataIndex: "capacityHostel",
        width: "10%",
    },
    {
        title: "Month",
        dataIndex: "month",
        width: "10%",
    },
    {
      title: "Package Fee",
      dataIndex: "packageFee",
      width: "15%",
      render: (packageFee : number) => {
        return (
        NumberFormat(packageFee)
        )
      }
  },
    {
      title: "Date Register",
      dataIndex: "dateRegister",
      width: "15%",
      render: (dateRegister: Date) => {
        return (
           DateFormat(dateRegister)
        )
      },
    },
    {
      title: "Date Expire",
      dataIndex: "dateExpire",
      width: "15%",
      render: (dateExpire: Date) => {
        return (
           DateFormat(dateExpire)
        )
      },
    },
  ];



  const handleBackToList = () => {
    navigate("/admin/memberships"); 
  };


  return (
    <>
        <div>
          <Button onClick={handleBackToList}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
          </Button>
          <br />
          <br />
          <Descriptions bordered title="Account Information">
            {renderBorderedAccount()}
          </Descriptions>
          <br/>
          <Table columns={memberpackageHistory} dataSource={membershipDetailData} bordered />
        </div>
    </>
  );
};

export default AdminMemberShipDetail;
