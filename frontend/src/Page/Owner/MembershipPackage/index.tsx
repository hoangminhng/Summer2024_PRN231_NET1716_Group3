import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { getOwnerCurrentActiveMembership, registerMembership } from "../../../api/Owner/ownerPackage";
import { getPackages } from "../../../api/Packages";
import toast from "react-hot-toast";
import { Package } from "../../../interface/MemberShips/package";
import moment from 'moment'
import { Button, Card, Col } from "antd";
import { NumberFormat } from "../../../Utils/numberFormat";
import UpdatePackageModal, { UpdatePackageProps } from "../../../Component/Owner/UpdatePackageModel";

const OwnerPackage: React.FC = () => {
    const { token, userPackageStatus, userRole, userId } = useContext(UserContext);
    const [packageList, setPackageList] = useState<Package[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentMembership, setCurrentMembership] = useState<MemberShipDetail>();
    const [updatePackageProps, setUpdatePackageProps] = useState<UpdatePackageProps>();


    const fetchCurrentPackage = async () => {
        try {
            if (token) {
                const data = await getOwnerCurrentActiveMembership(token);
                if (data) {
                    setCurrentMembership(data);
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const fetchPackages = async () => {
        let response = await getPackages();
        setPackageList(response || []);
    };

    console.log("user package status", userPackageStatus);

    const handleBuy = (packageID: number) => {
        if (userRole !== 2) {
            toast.error("You are not owner")
        }
        // if (userPackageStatus === 0) {
        //   toast.error("You have already registered a package")
        // }

        else {
            // redirect payment thanh toán
            const fetchPaymentUrl = async () => {
                if (userId && token) {
                    const response = await registerMembership(
                        userId,
                        packageID,
                        token
                    )
                    if (response) {
                        window.location.href = response.data?.paymentUrl as string;
                    }
                }
            };
            fetchPaymentUrl();
        }
    };

    const handleUpdate = (packageID: number, oldFee: number) => {
        var expireDate = currentMembership?.dateExpire;
        console.log("exprireDate ", expireDate);
        var currentDate = new Date();
        if (!expireDate) {
            return;
        }
        var diff = Math.abs(new Date(expireDate).getTime() - new Date(currentDate).getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        console.log("Diff in Days: " + diffDays);

        if (!currentMembership?.memberShipFee) {
            return;
        }

        const fee = oldFee - ((currentMembership.memberShipFee / (currentMembership.month * 30)) * diffDays)
        const newUpdatePackageProps: UpdatePackageProps = {
            type: 1,
            membershipId: packageID,
            oldFee: oldFee,
            fee: fee
        };

        // Update the state with the new object
        setUpdatePackageProps(newUpdatePackageProps);
        toggleModal();
    }

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
            fetchCurrentPackage();

        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <>

            {(isModalVisible) && (
                <div
                    tabIndex={-1}
                    aria-hidden="true"
                    onMouseDown={handleOverlayClick}
                    className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50  "
                // className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                    <UpdatePackageModal {...updatePackageProps} />
                </div>
            )}

            <div className="my-10">
                {(currentMembership) && (
                    <div className="mb-4 flex justify-center items-center ">
                        <Col key={currentMembership?.memberShipID} className="w-1/2">
                            <Card
                                title={
                                    <div style={{ textAlign: "center", fontWeight: "bold" }}>
                                        Active membership: {currentMembership?.memberShipName.toUpperCase()}
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
                                <p style={{ fontSize: "18px" }}><span style={{ fontWeight: "bold" }}>You have paid: </span>{NumberFormat(currentMembership?.packageFee)}</p>
                                <p style={{ fontSize: "18px" }}><span style={{ fontWeight: "bold" }}> Hostels limit: </span>{currentMembership?.capacityHostel}</p>
                                <p style={{ fontSize: "18px" }}><span style={{ fontWeight: "bold" }}>Date Expire: </span>{moment(currentMembership?.dateExpire).format('DD-MM-YYYY')} </p>

                            </Card>
                        </Col>


                    </div>)}
                <div className="p-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">

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
                                    {/* <p style={{ fontSize: "18px" }}>{packageItem.memberShipID}<span style={{ fontWeight: "bold" }}> membership id</span></p>
                                <p style={{ fontSize: "18px" }}>{currentMembership?.memberShipTransactionID}<span style={{ fontWeight: "bold" }}> membership transactionid</span></p>
                                <p style={{ fontSize: "18px" }}>{currentMembership?.memberShipID}<span style={{ fontWeight: "bold" }}> current membership id</span></p> */}
                                    <p style={{ fontSize: "18px" }}>{packageItem.capacityHostel}<span style={{ fontWeight: "bold" }}> Hostels</span></p>
                                    <p style={{ fontSize: "18px" }}>{packageItem.month} <span style={{ fontWeight: "bold" }}>Months</span></p>
                                    <p style={{ fontSize: "18px", fontWeight: "bold", color: "red", marginTop: "50px" }}>{NumberFormat(packageItem.memberShipFee)}</p>
                                    {!currentMembership && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "10px",
                                                marginTop: "20px",
                                            }}
                                        >
                                            <Button type="primary" onClick={() => handleBuy(packageItem.memberShipID)}>
                                                Buy Now
                                            </Button>
                                        </div>
                                    )}
                                    {(currentMembership && currentMembership?.memberShipID === packageItem.memberShipID) && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "10px",
                                                marginTop: "20px",
                                            }}
                                        >
                                            <Button type="primary" onClick={() => handleBuy(packageItem.memberShipID)}>
                                                Extend
                                            </Button>
                                        </div>
                                    )}

                                    {(currentMembership && currentMembership?.memberShipID !== packageItem.memberShipID) && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "10px",
                                                marginTop: "20px",
                                            }}
                                        >
                                            <Button type="primary" onClick={() => handleUpdate(packageItem.memberShipID, packageItem.memberShipFee)}>
                                                Update
                                            </Button>
                                        </div>
                                    )}




                                </Card>
                            </Col >
                        ))}


                    </div>
                </div>
            </div >
        </>
    );

};

export default OwnerPackage;
