import {
  Button,
  Tag,
  Descriptions
} from "antd";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
    getMemberShipDetail
} from "../../../../api/Admin/adminAccounts";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../context/userContext";
import { NumberFormat } from "../../../../Utils/numberFormatVND";
import { DateFormat } from "../../../../Utils/dateFormat";

const AdminMemberShipDetail: React.FC = () => {

  const [membershipDetailData, setMembershipDetailData] = useState<MemberShipDetail>();
  const { memberShipTransactionID } = useParams<{ memberShipTransactionID: string }>();
  const [idnumber, setID] = useState<number>();
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  const fetchMemberShipDetail = async () => {
    try {
      if (token && memberShipTransactionID) {
        let data: MemberShipDetail | undefined;
        data = await getMemberShipDetail(parseInt(memberShipTransactionID), token);
        setID(parseInt(memberShipTransactionID));
        setMembershipDetailData(data);
      }
    } catch (error) {
      console.error("Error fetching membership detail:", error);
    }
  };
  

  useEffect(() => {
    fetchMemberShipDetail();
  }, [idnumber, token]);


  const renderBorderedAccount = () => {
    const items = [
      {
        key: "1",
        label: "Name",
        children: membershipDetailData?.name || "",
        span: 3,
      },
      {
        key: "2",
        label: "Email",
        children: membershipDetailData?.email || "",
      },
      {
        key: "3",
        label: "Phone",
        children: membershipDetailData?.phone || "",
      },
      {
        key: "4",
        label: "Address",
        children: membershipDetailData?.address || "",
      }
    ];
    return items.map((item) => (
      <Descriptions.Item key={item.key} label={item.label}>
        {item.children}
      </Descriptions.Item>
    ));
  };

  const renderBorderedMemberShip = () => {
    const items = [
      {
        key: "1",
        label: "MemberShip Name",
        children: membershipDetailData?.membershipName || "",
        span: 3,
      },
      {
        key: "2",
        label: "Capacity Hostel",
        children: membershipDetailData?.capacityHostel || "",
      },
      {
        key: "3",
        label: "Month",
        children: membershipDetailData?.month || "",
      },
      {
        key: "4",
        label: "MemberShip Fee",
        children: membershipDetailData?.packageFee ? NumberFormat(membershipDetailData?.packageFee) : "",
      },
      {
        key: "5",
        label: "Date Register",
        children: membershipDetailData?.dateRegister ? DateFormat(membershipDetailData?.dateRegister) : "",
      },
      {
        key: "6",
        label: "Date Expire",
        children: membershipDetailData?.dateExpire ? DateFormat(membershipDetailData?.dateExpire) : "",
      },
      {
        key: "7",
        label: "Status",
        children: membershipDetailData ? (
          <Tag
            color={membershipDetailData.status === 1 ? "volcano" : "green"}
            key={membershipDetailData.status}
          >
            {membershipDetailData.status === 1 ? "EXPIRE" : "ACTIVE"}
          </Tag>
        ) : (
          ""
        ),
      },
    ];
    return items.map((item) => (
      <Descriptions.Item key={item.key} label={item.label} span={item.span}>
        {item.children}
      </Descriptions.Item>
    ));
  };


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
          <Descriptions bordered title="MemberShip Information">
            {renderBorderedMemberShip()}
          </Descriptions>
        </div>
    </>
  );
};

export default AdminMemberShipDetail;
