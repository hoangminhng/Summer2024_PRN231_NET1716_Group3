import React, { useState, useEffect, useContext } from "react";
import { Tag, Card, Button, Col, Row, Pagination, notification } from "antd";
import { getPackages, changeStatusActivePackage, changeStatusBlockPackage } from "../../../../api/Admin/adminPackages";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/userContext";
import { NumberFormat } from "../../../../Utils/numberFormat";

const AdminPackage: React.FC = () => {
  const [packageData, setPackageData] = useState<Package[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  const fetchPackageList = async () => {
    try {
      if (token != undefined) {
        const data = await getPackages(token);
        setPackageData(data || []);
      }
    } catch (error) {
      console.error("Error fetching packages list:", error);
    }
  };

  const fetchChangeStatusActive = async (packageID: number | undefined) => {
    try {
      if (token != undefined) {
        let data = await changeStatusActivePackage(token, packageID);
        return data;
      }
    } catch (error) {
      console.error("Error fetching change status:", error);
    }
  };

  const fetchChangeStatusBlock = async (packageID: number | undefined) => {
    try {
      if (token != undefined) {
        let data = await changeStatusBlockPackage(token, packageID);
        return data;
      }
    } catch (error) {
      console.error("Error fetching change status:", error);
    }
  };

  useEffect(() => {
    fetchPackageList();
  }, [token]);

  const handleUpdate = (packageID: number) => {
    navigate(`/admin/packages/detail/${packageID}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Cắt dữ liệu dựa trên trang hiện tại
  const paginatedData = packageData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChangeStatus = async (packageID : number | undefined, status: number | undefined) => {
    try{
      if(status == 0){
        const response = await fetchChangeStatusBlock(packageID);
          if (response?.status === 200) {
            openNotificationWithIcon("success", "Block status successfully!");
          } else {
            openNotificationWithIcon("error", response?.statusText || "Have some error");
          }
          await fetchPackageList();
      }else{
        const response = await fetchChangeStatusActive(packageID);
        if (response?.status === 200) {
          openNotificationWithIcon("success", "Unblock status successfully!");
        } else {
          openNotificationWithIcon("error", response?.statusText || "Have some error");
        }
        await fetchPackageList();
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

  return (
    <div>
      <h1 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>
        Package List
      </h1>
      <Row gutter={16}>
        {paginatedData.map((packageItem, index) => (
          <Col span={8} key={index}>
            <Card
              title={
                <div style={{ textAlign: "center" }}>
                  {packageItem.memberShipName.toUpperCase()}
                  <Tag
                    color={packageItem.status === 1 ? "volcano" : "green"}
                    style={{ marginLeft: "10px" }}
                  >
                    {packageItem.status === 1 ? "EXPIRE" : "ACTIVE"}
                  </Tag>
                </div>
              }
              bordered={false}
              style={{
                width: "100%",
                marginBottom: "20px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <p>Capacity: {packageItem.capacityHostel}</p>
              <p>Month: {packageItem.month}</p>
              <p>Fee: {NumberFormat(packageItem.memberShipFee)}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Button
                  type="primary"
                  ghost
                  onClick={() => handleUpdate(packageItem.memberShipID)}
                  style={{ marginRight: "20px" }}
                >
                  Update
                </Button>
                <Button type="primary" ghost
                onClick={() => handleChangeStatus(packageItem.memberShipID, packageItem.status)}>
                  {packageItem.status === 1 ? "ACTIVE" : "BLOCK"}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        total={packageData.length}
        pageSize={itemsPerPage}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "20px" }}
      />
    </div>
  );
};

export default AdminPackage;
