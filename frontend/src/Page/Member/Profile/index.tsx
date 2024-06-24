import { useState, useEffect, useContext } from "react";
import { Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UserContext } from "../../../context/userContext";
import { getMemberProfle} from "../../../api/Owner/ownerProfile";
import { useNavigate } from "react-router-dom";

const MemberProfile : React.FC = () => {
    const [profileData, setProfileData] = useState<AccountDetail>();
    const { token, userId } = useContext(UserContext);
    const navigate = useNavigate();


    const fetchProfile = async () => {
        try {
            if (token && userId) {
                const data = await getMemberProfle(userId, token);
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
        navigate("/profile/change-information");
    };

    const handleChangePassword = () => {
        navigate("/profile/change-password");
    };

    return (
        <>
            <div style={{ textAlign: "left", padding:"20px", marginTop:"100px" }}>
                <div className="max-w-full rounded overflow-hidden shadow-lg">
                    <Row gutter={[24, 16]}>
                        <Col span={8}>
                            <div className="px-6 py-4 ">
                                <UserOutlined style={{fontSize: "150px"}}/>
                                <div className="font-bold text-sm mb-2 mt-2">{profileData?.name ? profileData.name : ""}</div>
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
                </div>
            </div>
        </>
    );
};

export default MemberProfile;


