import {
    Button,
    Tag,
    Descriptions,
    TableProps,
    Table
  } from "antd";
  import { useState, useEffect } from "react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import {
    getHostelDetail
  } from "../../../../api/Admin/adminHostels";
  import {
    getRooms
  } from "../../../../api/Admin/adminRooms";
  import { useContext } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { UserContext } from "../../../../context/userContext";
  
  const AdminHostelDetail: React.FC = () => {
  
    const [hostelDetailData, setHostelDetailData] = useState<AdminHostelDetail>();
    const [roomData, setRoomData] = useState<AdminRoom[]>([]);
    const { hostelID } = useParams<{ hostelID: string }>();
    const [idnumber, setID] = useState<number>();
    const navigate = useNavigate();
    const { token } = useContext(UserContext);
  
    const fetchHostelDetail = async () => {
      try {
        if (token != undefined && hostelID != undefined) {
          let data: AdminHostelDetail | undefined;
          data = await getHostelDetail(parseInt(hostelID), token);
          setID(parseInt(hostelID));
          setHostelDetailData(data);
        }
      } catch (error) {
        console.error("Error fetching hostel detail:", error);
      }
    };

    const fetchRoomList = async () => {
        try {
          if (token != undefined && hostelID != undefined) {
            let data: AdminRoom[] | undefined;
            data = await getRooms(parseInt(hostelID), token);
            setID(parseInt(hostelID));
            setRoomData(data || []);
          }
        } catch (error) {
          console.error("Error fetching rooms list:", error);
        }
      };
    
  
    useEffect(() => {
        fetchHostelDetail();
        fetchRoomList();
    }, [idnumber, token]);
  
  
    const renderBorderedHostel = () => {
      const items = [        
        {
          key: "1",
          label: "Hostel Name",
          children: hostelDetailData?.hostelName || "",
          span: 3,
        },
        {
          key: "2",
          label: "Hostel Description",
          children: hostelDetailData?.hostelDescription || "",
          span: 3,
        },
        {
          key: "3",
          label: "Hostel Address",
          children: hostelDetailData?.hostelAddress || "",
        },
        {
          key: "4",
          label: "Name",
          children: hostelDetailData?.name || "",
        },
        {
          key: "5",
          label: "Email",
          children: hostelDetailData?.email || "",
        },
        {
            key: "6",
            label: "Phone",
            children: hostelDetailData?.phone || "",
        },
        {
            key: "7",
            label: "Number of Rooms",
            children: hostelDetailData?.numberOfRoom || 0,
        },
        {
          key: "8",
          label: "Hostel Status",
          children: hostelDetailData ? (
            <Tag
              color={hostelDetailData.status === 1 ? "volcano" : "green"}
              key={hostelDetailData.status}
            >
              {hostelDetailData.status === 1 ? "BLOCK" : "ACTIVE"}
            </Tag>
          ) : (
            ""
          ),
          },
      ];
      return items.map((item) => (
        <Descriptions.Item key={item.key} label={item.label} span={item.span}>
          {item.children}
        </Descriptions.Item>
      ));
    };

    const statusStringMap: { [key: number]: string } = {
        0 : "AVAILABLE",
        1 : "VIEWING",
        2 : "HIRING/FULL",
        3 : "FIXED",
      };
    
      const statusColorMap: { [key: number]: string } = {
        0: "green",
        1: "yellow",
        2: "orange",
        3: "red",
      };
  
    const columns: TableProps<AdminRoom>["columns"] = [
        {
          title: "No",
          width: "5%",
          render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
          title: "Room Name",
          dataIndex: "roomName",
          width: "20%",
        },
        {
          title: "Hostel Capacity (/people)",
          dataIndex: "capacity",
          width: "10%",
        },
        {
            title: "Width (m²)",
            dataIndex: "width",
            width: "10%",
        },
        {
            title: "Lenght (m²)",
            dataIndex: "lenght",
            width: "10%",
        },
        {
          title: "Status",
          dataIndex: "status",
          width: "5%",
          render: (room_Status: number) => {
            let color = statusColorMap[room_Status];
            let status = statusStringMap[room_Status]
            return (
              <Tag color={color} key={room_Status}>
                {status.toUpperCase()}
              </Tag>
            );
          },
        },
      ];
  
  
    const handleBackToList = () => {
      navigate("/admin/hostels"); 
    };
  
  
    return (
      <>
          <div>
            <Button onClick={handleBackToList}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#74C0FC" }} />
            </Button>
            <br />
            <br />
            <Descriptions bordered title={"Hostel Information code ID : " + idnumber}>
              {renderBorderedHostel()}
            </Descriptions>
            <br/>
            <h3 title="Room List"/>
            <br />
            <Table columns={columns} dataSource={roomData} bordered pagination={{ pageSize: 3 }}/>
          </div>
      </>
    );
  };
  
  export default AdminHostelDetail;
  