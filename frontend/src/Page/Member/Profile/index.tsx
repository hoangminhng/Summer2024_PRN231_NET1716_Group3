import { useState, useEffect, useContext } from "react";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UserContext } from "../../../context/userContext";

const MemberProfile = () => {
    const [profileData, setProfileData] = useState<ContractDetail>();
    // const { token, userId } = useContext(UserContext);



    // const fetchProfile = async () => {
    //     try {
    //         if (token && userId) {
    //             const data = await getProfile(userId, token);
    //             if (data) {
    //                 setProfileData(data);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error fetching profile:", error);
    //     }
    // };

    // useEffect(() => {
    //     getProfile();
    // }, [userId, token]);


    return (
        <>
            <div style={{ textAlign: "left" }}>
                <div className="w-full rounded overflow-hidden shadow-lg">
                <UserOutlined/>
                <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
                    <p className="text-gray-700 text-base">
                     Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
                </div>
                </div>
            </div>
        </>
    );
};

export default MemberProfile;


