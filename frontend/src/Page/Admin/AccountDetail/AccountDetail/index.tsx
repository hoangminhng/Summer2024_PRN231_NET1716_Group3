import {
    Button,
    Tag,
    Descriptions
  } from "antd";
  import { useState, useEffect } from "react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import {
    getAccountDetail
  } from "../../../../api/Admin/adminAccounts";
  import { useContext } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { UserContext } from "../../../../context/userContext";
  
  const AdminAccountDetail: React.FC = () => {
  
    const [accountDetailData, setAccountDetailData] = useState<AccountDetail>();
    const { accountId } = useParams<{ accountId: string }>();
    const [idnumber, setID] = useState<number>();
    const navigate = useNavigate();
    const { token } = useContext(UserContext);
  
    const fetchAccountDetail = async () => {
      try {
        if (token && accountId) {
          let data: AccountDetail | undefined;
          data = await getAccountDetail(parseInt(accountId), token);
          setID(parseInt(accountId));
          setAccountDetailData(data);
        }
      } catch (error) {
        console.error("Error fetching account detail:", error);
      }
    };
    
  
    useEffect(() => {
        fetchAccountDetail();
    }, [idnumber, token]);
  
  
    const renderBorderedAccount = () => {
      const items = [        
        {
          key: "1",
          label: "Email",
          children: accountDetailData?.email || "",
          span: 3,
        },
        {
          key: "2",
          label: "Name",
          children: accountDetailData?.name || "",
        },
        {
          key: "3",
          label: "Phone",
          children: accountDetailData?.phone || "",
        },
        {
          key: "4",
          label: "Address",
          children: accountDetailData?.address || "",
        },
        {
            key: "5",
            label: "Citizen Card",
            children: accountDetailData?.citizenCard || "",
        },
        {
            key: "6",
            label: "Status",
            children: accountDetailData?.status || "",
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
      ];
      return items.map((item) => (
        <Descriptions.Item key={item.key} label={item.label}>
          {item.children}
        </Descriptions.Item>
      ));
    };
   
    const handleBackToList = () => {
      navigate("/admin/accounts"); 
    };
   
    return (
      <>
          <div>
            <Button onClick={handleBackToList}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
            </Button>
            <br />
            <br />

            <Descriptions bordered title={"Account Information" + idnumber}>
              {renderBorderedAccount()}
            </Descriptions>
          </div>
      </>
    );
  };
  
  export default AdminAccountDetail;
  