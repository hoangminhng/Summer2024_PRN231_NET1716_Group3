import { Card, Button, Col, Row, Pagination, Tag, Table, TableProps } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/userContext";
import moment from 'moment'
import { Complain } from "../../../interface/Complains/Complain";
import { Odata } from "../../../interface/Odata";
import { getOwnerComplains } from "../../../api/Owner/ownerComplain";
import UpdateComplainModal from "../../../Component/Owner/UpdateComplainModal";

const OwnerComplains: React.FC = () => {
    const { token, userId } = useContext(UserContext);
    const [complainData, setComplainData] = useState<Odata<Complain>>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedComplain, setSelectedComplain] = useState<Complain | undefined>(undefined);

    const fetchComplainList = async () => {
        try {
            if (token != undefined) {
                let data: Odata<Complain> | undefined;
                data = await getOwnerComplains(token, userId);
                console.log({ ...data?.value });
                setComplainData(data || undefined);
            }
        } catch (error) {
            console.error("Error fetching contract list:", error);
        }
    };

    useEffect(() => {
        fetchComplainList();
        window.addEventListener('modalClosed', () => {
            setIsModalOpen(false)
            fetchComplainList();
        });
        return () => window.removeEventListener('modalClosed', () => {
            setIsModalOpen(false)
        });
    }, []);

    const statusStringMap: { [key: number]: string } = {
        1: "PENDING ACTION",
        2: "DONE",
    };

    const statusColorMap: { [key: number]: string } = {
        1: "orange",
        2: "green",
    };

    const openModal = (complain: Complain) => {
        setSelectedComplain(complain);
        setIsModalOpen(!isModalOpen);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            // If the click occurs on the overlay (not on the modal content), close the modal
            toggleModal();
        }
    };

    const memberComplainHistory: TableProps<Complain>["columns"] = [
        {
            title: "No",
            width: "2%",
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: "Hostel",
            dataIndex: "HostelName",
            width: "10%",
            sorter: (a, b) => a.HostelName.localeCompare(b.HostelName),
        },
        {
            title: "Room",
            dataIndex: "RoomName",
            width: "10%",
            sorter: (a, b) => a.RoomName.localeCompare(b.RoomName),
        },
        {
            title: "Owner Name",
            dataIndex: "OwnerName",
            width: "10%",
            sorter: (a, b) => a.OwnerName.localeCompare(b.OwnerName),
        },
        {
            title: "Complain",
            dataIndex: "ComplainText",
            width: "20%",
            render: (text: string) => (
                <span dangerouslySetInnerHTML={{ __html: text }} />
            ),
            sorter: (a, b) => a.ComplainText.localeCompare(b.ComplainText),
        },
        {
            title: "Date Created",
            dataIndex: "DateComplain",
            width: "10%",
            render: (dateComplain: Date) => moment(dateComplain).format("DD-MM-YYYY HH:mm:ss"),
            sorter: (a, b) => new Date(a.DateComplain).getTime() - new Date(b.DateComplain).getTime(),
        },
        {
            title: "Response",
            dataIndex: "ComplainResponse",
            width: "20%",
            render: (text: string | null, record: Complain) => (
                text ? (
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                ) : (
                    <Button
                        className="mx-2"
                        type="primary"
                        onClick={() => openModal(record)}
                    >
                        Response
                    </Button>
                )
            ),
            sorter: (a, b) => (a.ComplainResponse || "").localeCompare(b.ComplainResponse || ""),
        },
        {
            title: "Date Response",
            dataIndex: "DateUpdate",
            width: "10%",
            render: (dateUpdate: Date) => {
                let display = "";
                if (dateUpdate === undefined || dateUpdate === null) {
                    display = "___";
                } else {
                    display = moment(dateUpdate).format("DD-MM-YYYY: HH:mm:ss");
                }
                return display;
            },
            sorter: (a, b) => new Date(a.DateUpdate).getTime() - new Date(b.DateUpdate).getTime(),
        },
        {
            title: "Status",
            dataIndex: "Status",
            width: "10%",
            render: (status: number) => {
                const statusString = statusStringMap[status];
                const statusColor = statusColorMap[status];
                if (statusString && statusColor) {
                    return (
                        <Tag
                            color={statusColor}
                            key={statusString}
                        >
                            {statusString}
                        </Tag>
                    );
                } else {
                    // Handle cases where status is not found in maps
                    return <span>Unknown Status ({status})</span>;
                }
            },
            sorter: (a, b) => a.Status - b.Status,
        },
    ];


    return (
        <>
            <div style={{ padding: '24px' }}>
                <Table columns={memberComplainHistory}
                    dataSource={complainData?.value}
                    bordered
                    pagination={{ pageSize: 8 }}
                />
            </div>
            {isModalOpen && (
                <div
                    tabIndex={-1}
                    aria-hidden="true"
                    onMouseDown={handleOverlayClick}
                    className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full inset-0 overflow-x-hidden overflow-y-auto flex bg-black bg-opacity-50  "
                // className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                    <UpdateComplainModal complain={selectedComplain} />
                </div>
            )}
        </>
    );
};
export default OwnerComplains;
