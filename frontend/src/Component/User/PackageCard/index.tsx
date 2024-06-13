import { Card, Button, Col, Modal } from "antd"; 
import { useEffect, useState, useContext } from "react";
import { NumberFormat } from "../../../Utils/numberFormat";
import { getPackages } from "../../../api/Packages";
import { UserContext } from "../../../context/userContext";
import LoginModal from "../../LoginModal";

const PackageCard: React.FC = () => {
  const { token } = useContext(UserContext);
  const [packageList, setPackageList] = useState<Package[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchPackages = async () => {
    let response = await getPackages();
    setPackageList(response || []);
  };

  const handleBuy = (packageID: number) => {
    if (token == null || token == undefined) {
      setIsModalVisible(true);
    } else {
      // redirect payment thanh toán
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // If the click occurs on the overlay (not on the modal content), close the modal
      toggleModal();
    }
  };

  useEffect(() => {
    try {
      fetchPackages();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {packageList.map((packageItem, index) => (
        <Col key={index}>
          <Card
            title={
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                {packageItem.memberShipName.toUpperCase()}
              </div>
            }
            bordered={false}
            style={{
              width: "100%",
              marginBottom: "20px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <p style={{ fontSize: "18px" }}>{packageItem.capacityHostel}<span style={{ fontWeight: "bold" }}> Hostels</span></p>
            <p style={{ fontSize: "18px" }}>{packageItem.month} <span style={{ fontWeight: "bold" }}>Months</span></p>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "red", marginTop: "50px" }}>{NumberFormat(packageItem.memberShipFee)}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                type="primary"
                ghost
                onClick={() => handleBuy(packageItem.memberShipID)}
              >
                Buy Now
              </Button>
            </div>
          </Card>
        </Col>
      ))}
      {isModalVisible && (
          <div
            tabIndex={-1}
            aria-hidden="true"
            onMouseDown={handleOverlayClick}
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50  "
            // className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <LoginModal />
          </div>
        )}
    </>
  );
};

export default PackageCard;
