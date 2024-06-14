import { useState, useEffect, useContext } from "react";
import { Row, Col, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UserContext } from "../../../context/userContext";
import { getOwnerProfle } from "../../../api/Owner/ownerProfile";
import { DateFormat } from "../../../Utils/dateFormat";
import { NumberFormat } from "../../../Utils/numberFormat";
import { useNavigate } from "react-router-dom";

const OwnerProfile : React.FC = () => {
    const [profileData, setProfileData] = useState<Profile>();
    const { token, userId } = useContext(UserContext);
    const navigate = useNavigate();


    const fetchProfile = async () => {
        try {
            if (token && userId) {
                const data = await getOwnerProfle(userId, token);
                if (data) {
                    setProfileData(data);
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId, token]);

    const handleChangeInformation = () => {
        navigate("/owner/profile/change-information");
    };

    const handleChangePassword = () => {
        navigate("/owner/profile/change-password");
    };

    return (
        <>
            <div style={{ textAlign: "left", padding:"20px" }}>
                <div className="max-w-full rounded overflow-hidden shadow-lg">
                    <Row gutter={[24, 16]}>
                        <Col span={8}>
                            <div className="px-6 py-4 ">
                                <UserOutlined style={{fontSize: "150px"}}/>
                                <div className="font-bold text-sm mb-2">{profileData?.name ? profileData.name : ""}</div>
                                <div className="text-sm mb-2">{profileData?.email ? profileData.email : ""}</div>
                            </div>
                        </Col>
                        <Col span={16}>
                        <div className="px-6 py-4 ">
                            <Row gutter={[24, 16]}>
                                <Col span={8}>
                                    <div className="text-lg mb-2 font-bold"> Phone :</div>
                                </Col>
                                <Col span={16}>
                                    <div className="text-sm mb-2">{profileData?.phone ? profileData.phone : ""}</div>
                                </Col>
                                <Col span={8}>
                                    <div className="text-lg mb-2 font-bold"> Citizen Card :</div>
                                </Col>
                                <Col span={16}>
                                    <div className="text-sm mb-2"> {profileData?.citizenCard ? profileData.citizenCard : ""}</div>
                                </Col>
                                <Col span={8}>
                                    <div className="text-lg mb-2 font-bold"> Address :</div>
                                </Col>
                                <Col span={16}>
                                    <div className="text-sm mb-2"> {profileData?.address ? profileData.address : ""}</div>
                                </Col>
                                <Col span={8}>
                                    <div className="text-lg mb-2 font-bold"> Gender :</div>
                                </Col>
                                <Col span={16}>
                                    <div className="text-sm mb-2"> {profileData?.gender === 0 ? "Male" : "Female"}</div>
                                </Col>
                                <Col span={24}>
                                <div style={{display: "flex", justifyContent:"center"}}>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-10"
                                    onClick={handleChangeInformation}
                                    >
                                    Change Information
                                    </button>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={handleChangePassword}>
                                    Change Password
                                    </button>
                                </div>
                                </Col>
                            </Row>
                        </div>
                        </Col>
                    </Row>
                    <Divider orientation="center" />
                    <div style={{textAlign:"center", fontSize:"20px", fontStyle:"italic", fontWeight:"bold"}}>Package Activity</div>
                    <Row gutter={[24, 16]}>
                        <Col span={6}>
                        </Col>
                        <Col span={18}>
                        <div className="px-6 py-4 ">
                        <Row gutter={[24, 16]}>
                                <Col span={9}>
                                    <div className="text-sm mb-2 font-bold"> Status :</div>
                                </Col>
                                <Col span={15}>
                                {profileData?.status == 0 ?(
                                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Active</span>
                                ) : 
                                (
                                    <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">Expire</span>
                                )}
                                </Col>
                                <Col span={9}>
                                    <div className="text-sm mb-2 font-bold"> Date Register - Date Expire :</div>
                                </Col>
                                <Col span={15}>
                                    <div className="text-sm mb-2"> {profileData?.dateRegister ? DateFormat(profileData.dateRegister) : "Unvailable"} - {profileData?.dateExpire ? DateFormat(profileData.dateExpire) : "Unvailable"}</div>
                                </Col>
                                <Col span={9}>
                                    <div className="text-sm mb-2 font-bold"> Package name : </div>
                                </Col>
                                <Col span={15}>
                                    <div className="text-sm mb-2"> {profileData?.packName ? profileData.packName : ""}</div>
                                </Col>
                                <Col span={9}>
                                    <div className="text-sm mb-2 font-bold"> Capacity Hostels :</div>
                                </Col>
                                <Col span={15}>
                                    <div className="text-sm mb-2"> {profileData?.capacityHostel ? profileData.capacityHostel : 0} Hostels</div>
                                </Col>
                                <Col span={9}>
                                    <div className="text-sm mb-2 font-bold"> Fee Package :</div>
                                </Col>
                                <Col span={15}>
                                    <div className="text-sm mb-2"> {profileData?.feePackage ? NumberFormat(profileData.feePackage) : ""}</div>
                                </Col>
                            </Row>
                        </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default OwnerProfile;


