import { Button, Input, Descriptions, notification } from "antd";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getPackageDetail, updatePackage } from "../../../../api/Admin/adminPackages";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../context/userContext";

const AdminPackageDetail: React.FC = () => {
    const [packageDetailData, setPackageDetailData] = useState<Package | undefined>();
    const { packageID } = useParams<{ packageID: string }>();
    const [idnumber, setID] = useState<number>();
    const [errorContent, setErrorContent] = useState<string>("");
    const navigate = useNavigate();
    const { token } = useContext(UserContext);
    const [packageData, setPackageData] = useState<Package>({
        capacityHostel: 0,
        memberShipFee: 0,
        memberShipName: "",
        month: 0,
        status: 0,
        memberShipID: 0,
    });

    const fetchPackageDetail = async () => {
        try {
            if (token != undefined && packageID != undefined) {
                let data: Package | undefined;
                data = await getPackageDetail(parseInt(packageID), token);
                setID(parseInt(packageID));
                setPackageDetailData(data);
                setPackageData(data || {
                    capacityHostel: 0,
                    memberShipFee: 0,
                    memberShipName: "",
                    month: 0,
                    status: 0,
                    memberShipID: 0,
                });
            }
        } catch (error) {
            console.error("Error fetching package detail:", error);
        }
    };

    const fetchUpdatePackage = async (Package: Package) => {
        try {
            if (token != undefined) {
                let data = await updatePackage(Package, token);
                return data;
            }
        } catch (error : any) {
            setErrorContent(error.message);
            throw error;
        }
    };

    useEffect(() => {
        fetchPackageDetail();
    }, [idnumber, token]);

    const handleChange = (fieldName: keyof Package, value: string | number) => {
        setPackageData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
        notification[type]({
            message: "Notification Title",
            description: description,
        });
    };

    const UpdatePackage = async () => {
        if(token != undefined){
        packageData.memberShipID = packageDetailData?.memberShipID || 0;
        packageData.status = packageDetailData?.status || 0;
        try{
            const response = await fetchUpdatePackage(packageData);
            if (response != undefined && !errorContent) {
                openNotificationWithIcon("success", "Update package information successfully!");
            }
        }catch(error : any){
            openNotificationWithIcon("error", error.message || "Have some error");
            setErrorContent("");
        }
        await fetchPackageDetail();
        }
    };

    const items = [
        {
            key: "1",
            label: "Package Name",
            children: (
                <Input
                    placeholder="Enter package"
                    required
                    value={packageData.memberShipName}
                    onChange={(e) => handleChange("memberShipName", e.target.value)}
                />
            ),
            span: 3,
        },
        {
            key: "2",
            label: "Capacity Hostel",
            children: (
                <Input
                    type="number"
                    required
                    placeholder="Enter capacity hostel"
                    value={packageData.capacityHostel}
                    onChange={(e) => handleChange("capacityHostel", parseInt(e.target.value))}
                />
            ),
            span: 3,
        },
        {
            key: "3",
            label: "Package Fee",
            children: (
                <Input
                    type="number"
                    required
                    placeholder="Enter your fee"
                    value={packageData.memberShipFee}
                    onChange={(e) => handleChange("memberShipFee", parseInt(e.target.value))}
                />
            ),
            span: 3,
        },
        {
            key: "4",
            label: "Month",
            children: (
                <Input
                    type="number"
                    placeholder="Enter month"
                    required
                    value={packageData.month}
                    onChange={(e) => handleChange("month", parseInt(e.target.value))}
                />
            ),
            span: 3,
        },
    ];

    const handleBackToList = () => {
        navigate("/admin/packages");
    };

    return (
        <>
            <div>
                <Button onClick={handleBackToList}>
                    <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
                </Button>
                <br />
                <br />

                <Descriptions bordered title="Update Package" items={items}></Descriptions>
                <br />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Button onClick={UpdatePackage}>Update</Button>
                </div>
            </div>
        </>
    );
};

export default AdminPackageDetail;
