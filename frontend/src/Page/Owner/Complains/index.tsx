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
        },
        {
            title: "Room",
            dataIndex: "RoomName",
            width: "10%",
        },
        {
            title: "Owner Name",
            dataIndex: "OwnerName",
            width: "10%",
        },
        {
            title: "Complain",
            dataIndex: "ComplainText",
            width: "20%",
            render: (text: string) => (
                <span dangerouslySetInnerHTML={{ __html: text }} />
            ),
        },
        {
            title: "Date Created",
            dataIndex: "DateComplain",
            width: "10%",
            render: (dateComplain: Date) => {
                return (
                    moment(dateComplain).format("DD-MM-YYYY HH:mm:ss")
                )
            }
        },
        {
            title: "Response",
            dataIndex: "ComplainResponse",
            width: "20%",
            render: (text: string | null, record: Complain) => ( // Allow null type for dataIndex
                text ? (
                    <span dangerouslySetInnerHTML={{ __html: text }} /> // Use dangerouslySetInnerHTML (with caution)
                ) : (
                    <Button
                        className="mx-2"
                        type="primary"
                        onClick={() => openModal(record)}
                    >
                        Response
                    </Button>
                )
            )
        },

        {
            title: "Date Response",
            dataIndex: "DateUpdate",
            width: "10%",
            render: (dateUpdate: Date) => {
                let display = "";
                if (dateUpdate === undefined || dateUpdate === null) {
                    display = "___"
                } else
                    display = moment(dateUpdate).format("DD-MM-YYYY: HH:mm:ss")
                return (
                    display
                )
            }
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
