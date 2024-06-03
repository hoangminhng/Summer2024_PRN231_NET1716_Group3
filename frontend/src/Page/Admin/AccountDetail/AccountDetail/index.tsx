import {
    Button,
    Tag,
    Descriptions,
    notification
  } from "antd";
  import { useState, useEffect } from "react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import {
    getAccountDetail,
    changeStatusBlockAccounts,
    changeStatusActiveAccounts
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
  
    const formatDate = (dateString: Date): string => {
      const dateObject = new Date(dateString);
      return `${dateObject.getFullYear()}-${(
        "0" +
        (dateObject.getMonth() + 1)
      ).slice(-2)}-${("0" + dateObject.getDate()).slice(-2)} ${(
        "0" + dateObject.getHours()
      ).slice(-2)}:${("0" + dateObject.getMinutes()).slice(-2)}:${(
        "0" + dateObject.getSeconds()
      ).slice(-2)}`;
    };

    const fetchAccountDetail = async () => {
      try {
        if (token != undefined && accountId != undefined) {
          let data: AccountDetail | undefined;
          data = await getAccountDetail(parseInt(accountId), token);
          setID(parseInt(accountId));
          setAccountDetailData(data);
        }
      } catch (error) {
        console.error("Error fetching account detail:", error);
      }
    };
    
    const fetchChangeStatusActive = async (accountId: number | undefined) => {
      try {
        if (token != undefined) {
          let data = await changeStatusActiveAccounts(token, accountId);
          return data;
        }
      } catch (error) {
        console.error("Error fetching change status:", error);
      }
    };

    const fetchChangeStatusBlock = async (accountId: number | undefined) => {
      try {
        if (token != undefined) {
          let data = await changeStatusBlockAccounts(token, accountId);
          return data;
        }
      } catch (error) {
        console.error("Error fetching change status:", error);
      }
    };
  
    useEffect(() => {
        fetchAccountDetail();
    }, [idnumber, token]);
  
  
    const handleChangeStatus = async (accountID : number | undefined, status: number | undefined) => {
      try{
        if(status == 0){
          const response = await fetchChangeStatusBlock(accountID);
            if (response?.status === 200) {
              openNotificationWithIcon("success", "Block status successfully!");
            } else {
              openNotificationWithIcon("error", response?.statusText || "Have some error");
            }
            await fetchAccountDetail();
        }else{
          const response = await fetchChangeStatusActive(accountID);
          if (response?.status === 200) {
            openNotificationWithIcon("success", "Unblock status successfully!");
          } else {
            openNotificationWithIcon("error", response?.statusText || "Have some error");
          }
          await fetchAccountDetail();
        }
      }catch (error: any) {
        openNotificationWithIcon("error","An error occurred. Please try again.");
        }
    };
    
    const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
      notification[type]({
        message: "Notification Title",
        description: description,
      });
    };

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
          label: "Gender",
          children: accountDetailData?.gender === 1 ? "Female" : "Male",
      },
        {
          key: "7",
          label: "Date Create",
          children: accountDetailData
          ? formatDate(accountDetailData.createdDate)
          : "",
        },
        {
          key: "8",
          label: "Status",
          children: accountDetailData ? (
            <Tag
              color={accountDetailData.status === 1 ? "volcano" : "green"}
              key={accountDetailData.status}
            >
              {accountDetailData.status === 1 ? "BLOCK" : "ACTIVE"}
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
      navigate("/admin/accounts"); 
    };
   
    return (
      <>
          <div style={{textAlign: "left"}}>
            <div style={{display:"flex", justifyContent:"space-between", marginTop: "10px"}}>
            <Button onClick={handleBackToList}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
            </Button>
            <Button onClick={() => handleChangeStatus(accountDetailData?.accountID, accountDetailData?.status)}>
            Change Status
            </Button>
            </div>
            <br />
            <br />

            <Descriptions bordered title={"Account Information code ID : " + idnumber}>
              {renderBorderedAccount()}
            </Descriptions>
          </div>
      </>
    );
  };
  
  export default AdminAccountDetail;
  