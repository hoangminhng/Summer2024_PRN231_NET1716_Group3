import {  DatePicker, Select, Input, Collapse, Row, Col, InputNumber} from "antd";
const { RangePicker } = DatePicker;
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { useState, useEffect } from "react";
import { getHostelOwnerContract } from "../../../api/Owner/ownerHostel";
import { getRoomOwnerContract } from "../../../api/Owner/ownerRoom";
import { getServiceRoomOwnerContract } from "../../../api/Owner/ownerService";
import { getUserAppointmentOwnerContract } from "../../../api/Owner/ownerContract";
import { NumberFormat } from "../../../Utils/numberFormat";

const OwnerContractCreate : React.FC = () => {
    const [updatedContent, setUpdatedContent] = useState<string>("");
    const [roomDeposit, setRoomDeposit] = useState<string>("");
    const [hostelData, setHostelData] = useState<HostelOwnerContract[]>([]);
    const [roomData, setRoomData] = useState<RoomOwnerContract[]>([]);
    const [serviceData, setServiceData] = useState<ServiceRoomContract[]>([]);
    const [userContract, setUserContract] = useState<UserAppointmentContract | undefined>(undefined);
    const { token , userId} = useContext(UserContext); 
    const onChangeDate = (dates : any) => {
        const dateStart = new Date(dates[0].$d);
        const dateEnd = new Date(dates[1].$d);
        console.log(dateStart.toISOString(), dateEnd.toISOString());
    };

    const getHostelContract = async () =>{
        try{
            if(token != undefined && userId != undefined){
                let data = await getHostelOwnerContract(userId, token)
                setHostelData(data || []);
            }
        }catch(error){
            console.error("Eror: " + error);
        }
    }

    const getRoomContract = async (hostelID : number) =>{
        try{
            if(token != undefined && hostelID != 0){
                let data = await getRoomOwnerContract(hostelID, token)
                setRoomData(data || []);
            }else{
                setRoomData([]);
            }
        }catch(error){
            console.error("Eror: " + error);
        }
    }

    const getServiceRoomContract = async (roomID : number) => {
        try{
            if(token != undefined && roomID != 0){
                let data = await getServiceRoomOwnerContract(roomID, token)
                setServiceData(data || []);
            }else{
                setServiceData([]);
            }
        }catch(error){
            console.error("Eror: " + error);
        }
    }

    const getUserAppointmentContract = async (roomID : number) =>{
        try{
            if(token != undefined && roomID != 0){
                let data = await getUserAppointmentOwnerContract(roomID, token)
                if(data != undefined)
                setUserContract(data);
            }else{
                setUserContract(undefined);
            }
        }catch(error){
            console.error("Eror: " + error);
        }
    }

    useEffect(() => {
        getHostelContract();
        getRoomContract(0);
        getServiceRoomContract(0);
        getUserAppointmentContract(0)
    }, [token]);

    const handleHostelChange = (value: number) => {
        getRoomContract(value);
    };

    const items = [
        {
        key: '1',
        label: 'Room Services',
        children: serviceData.length === 0 
        ? <p>No data</p>
        : (
            <div>
                {serviceData.map((service) => (
                    <div key={service.roomServiceId}>
                        <Row justify="space-between">
                            <Col span={5}>
                                <p style={{fontWeight: "bold"}}>{service.serviceName}</p>
                            </Col>
                            <Col span={5}>
                                <p>{NumberFormat(service.price)}</p>
                            </Col>
                            <Col span={5}>
                                    <p>({service.typeName})</p>
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>
        )
    }
    ];

    const hostelOptions = [
        {
            value: 0,
            label: ' '
        },
        ...hostelData.map((hostel) => ({
            value: hostel.hostelID,
            label: hostel.hostelName,
        }))
    ];

    const roomOptions = [
        {
            value: 0,
            label: ' '
        },
        ...roomData.map((room) => ({
            value: room.roomID,
            label: room.roomName,
        }))
    ];

return (
    <>
    <div>
        <div style={{width: "100%", textAlign: "center", fontSize: "20", fontWeight:"bold", backgroundColor:"aliceblue", padding:"20px"}}>
            <h2>CREATE NEW CONTRACT</h2>
        </div>
        <div style={{marginTop:"30px", padding: "20px"}}>
            <form>
            <div style={{display: "flex", justifyContent:"start", marginBottom: "20px"}}>
                <h2>Date Start --{">"} Date End : &nbsp;&nbsp;&nbsp; <span><RangePicker style={{width: "600px"}} onChange = {onChangeDate} required/></span></h2>
            </div>
            <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                <h2>Hostel : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Select
                    showSearch
                    style={{
                    width: 300,
                    textAlign:"left"
                    }}
                    placeholder="Select the hostel"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onChange={handleHostelChange}
                    options={hostelOptions}
                    aria-required
                /></h2>
                <h2>Room : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Select
                    showSearch
                    style={{
                    width: 200,
                    textAlign:"left"
                    }}
                    placeholder="Select the room"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={roomOptions}
                    aria-required
                /></h2>
            </div>
            <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                <h2>Room Fee : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span><Input placeholder="" style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.roomFee} required/></span></h2>
                    <h2>Room Deposit : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span><InputNumber
                                defaultValue={0}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                style={{width: "200px", borderRadius:"10px"}}
                                required/></span></h2>
            </div>
            <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                <h2>Student Name : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span><Input placeholder="" style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.name} required/></span></h2>
                <h2>Phone : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span><Input placeholder="" style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.phone} required/></span></h2>
            </div>
            <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
            <h2>Citizen Identification Card : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span><Input placeholder="" style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.citizenCard} required/></span></h2>
                <h2>Email : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span><Input placeholder="" style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.email} required/></span></h2>
            </div>
            <div style={{display: "flex", justifyContent:"start", marginBottom: "20px", width: "100%", textAlign: "left"}}>
                <Collapse items={items} style={{width:"100%"}}/>
            </div>
            <div style={{display: "flex", justifyContent:"start", marginBottom: "20px"}}>
                <h2>Contract Term : </h2>
            </div>
                <CKEditor
                    editor={ClassicEditor}
                    onChange={(_e, editor) => setUpdatedContent(editor.getData())}
                />
            </form>
        </div>
    </div>
    </>
);
}

export default OwnerContractCreate;