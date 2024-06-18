import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/userContext";
import { getOwnerCurrentActiveMembership, getOwnerMembershipHistory, registerMembership } from "../../../../api/Owner/ownerPackage";
import { getPackages } from "../../../../api/Packages";
import toast from "react-hot-toast";
import { Package } from "../../../../interface/MemberShips/package";
import moment from 'moment'
import { Button, Card, Col, Descriptions, Table, TableProps } from "antd";
import { NumberFormat } from "../../../../Utils/numberFormat";
import UpdatePackageModal, { UpdatePackageProps } from "../../../../Component/Owner/UpdatePackageModel";
import { DateFormat } from "../../../../Utils/dateFormat";

const PackageRegisterHistory: React.FC = () => {
    const [membershipDetailData, setMembershipDetailData] = useState<RegisterPackage[]>();
    // const [infoData, setInfoData] = useState<MemberShipInformation>();
    // const [idnumber, setID] = useState<number>();
    const { userId, token } = useContext(UserContext);


    const statusColorMap: { [key: number]: string } = {
        0: "green",
        1: "red",
        2: "grey",
    };

    const fetchMembershipHistory = async () => {
        try {
            if (token != undefined && userId != undefined) {
                let data: RegisterPackage[] | undefined;
                data = await getOwnerMembershipHistory(token);
                setMembershipDetailData(data);
            }
        } catch (error) {
            console.error("Error fetching package register history:", error);
        }
    };

    // const fetchMemberShipInformationDetail = async () => {
    //     try {
    //         if (token != undefined && accountID != undefined) {
    //             let data: MemberShipInformation | undefined;
    //             data = await getMemberShipInformationDetail(parseInt(accountID), token);
    //             setID(parseInt(accountID));
    //             setInfoData(data);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching membership detail:", error);
    //     }
    // };

    useEffect(() => {
        fetchMembershipHistory();
    }, [token]);


    // const renderBorderedAccount = () => {
    //     const items = [
    //         {
    //             key: "1",
    //             label: "Name",
    //             children: infoData?.name || "",
    //             span: 3,
    //         },
    //         {
    //             key: "2",
    //             label: "Email",
    //             children: infoData?.email || "",
    //             span: 3,
    //         },
    //         {
    //             key: "3",
    //             label: "Phone",
    //             children: infoData?.phone || "",
    //         },
    //         {
    //             key: "4",
    //             label: "Address",
    //             children: infoData?.address || "",
    //         },
    //         {
    //             key: "5",
    //             label: "Status",
    //             children: infoData ? (
    //                 <Tag
    //                     color={statusColorMap[infoData.isPackage]}
    //                     key={statusStringMap[infoData.isPackage]}
    //                 >
    //                     {statusStringMap[infoData.isPackage].toUpperCase()}
    //                 </Tag>
    //             ) : (
    //                 ""
    //             ),
    //         }
    //     ];
    //     return items.map((item) => (
    //         <Descriptions.Item key={item.key} label={item.label}>
    //             {item.children}
    //         </Descriptions.Item>
    //     ));
    // };

    const memberpackageHistory: TableProps<RegisterPackage>["columns"] = [
        {
            title: "No",
            width: "5%",
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: "Package ",
            dataIndex: "membershipName",
            width: "15%",
        },
        {
            title: "Capacity",
            dataIndex: "capacityHostel",
            width: "10%",
        },
        {
            title: "Month",
            dataIndex: "month",
            width: "10%",
        },
        {
            title: "Package Fee",
            dataIndex: "packageFee",
            width: "15%",
            render: (packageFee: number) => {
                return (
                    NumberFormat(packageFee)
                )
            }
        },
        {
            title: "Date Register",
            dataIndex: "dateRegister",
            width: "15%",
            render: (dateRegister: Date) => {
                return (
                    DateFormat(dateRegister)
                )
            },
        },
        {
            title: "Date Expire",
            dataIndex: "dateExpire",
            width: "15%",
            render: (dateExpire: Date) => {
                return (
                    DateFormat(dateExpire)
                )
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            width: "10%",
            // render: (status: number) => {
            //     return (
            //         DateFormat(dateExpire)
            //     )
            // },
        },
    ];



    // const handleBackToList = () => {
    //     navigate("/admin/memberships");
    // };


    return (
        <>
            <div style={{ padding: '24px' }}>
                <Table columns={memberpackageHistory} dataSource={membershipDetailData} bordered />
            </div>
        </>
    );
};


export default PackageRegisterHistory;
