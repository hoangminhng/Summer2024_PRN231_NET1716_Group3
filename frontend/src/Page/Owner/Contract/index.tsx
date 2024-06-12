    import {  DatePicker, Select, Input, Collapse, Row, Col, InputNumber, Button, Modal, Card, Checkbox, notification, Form} from "antd";
    import {
        PlusCircleFilled,
        UserOutlined
    } from "@ant-design/icons";
    const { RangePicker } = DatePicker;
    import { CKEditor } from "@ckeditor/ckeditor5-react";
    import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
    import { useContext } from "react";
    import { UserContext } from "../../../context/userContext";
    import { useState, useEffect } from "react";
    import { getHostelOwnerContract } from "../../../api/Owner/ownerHostel";
    import { getRoomOwnerContract } from "../../../api/Owner/ownerRoom";
    import { getServiceRoomOwnerContract } from "../../../api/Owner/ownerService";
    import { createContract, getUserAppointmentOwnerContract } from "../../../api/Owner/ownerContract";
    import { NumberFormat } from "../../../Utils/numberFormat";

    const OwnerContractCreate : React.FC = () => {
        const [updatedContent, setUpdatedContent] = useState<string>("");
        const [errorContent, setErrorContent] = useState<any>("");
        const [roomDeposit, setRoomDeposit] = useState<number>(0);
        const [hostelData, setHostelData] = useState<HostelOwnerContract[]>([]);
        const [newMember, setNewMember] = useState({name:'', phone: '', citizen_card: ''} as MemberContract);
        const [formErrors, setFormErrors] = useState({ name: '', phone: '', citizen_card: '' });
        const [selectedServices, setSelectedServices] = useState<number[]>([]);
        const [memberData, setMemberData] = useState<MemberContract[]>([]);
        const [roomData, setRoomData] = useState<RoomOwnerContract[]>([]);
        const [serviceData, setServiceData] = useState<ServiceRoomContract[]>([]);
        const [roomIDData, setRoomIDData] = useState<number>();
        const [hostelIDData, setHostelIDData] = useState<number>();
        const [userContract, setUserContract] = useState<UserAppointmentContract>();
        const [selectedMember, setSelectedMember] = useState<MemberContract | null>(null);
        const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
        const [startDate, setStartDate] = useState<Date | null>();
        const [endDate, setEndDate] = useState<Date | null>();
        const { token , userId} = useContext(UserContext); 

        const onChangeDate = (dates : any) => {
            const dateStart = new Date(dates[0].$d);
            const dateEnd = new Date(dates[1].$d);
            setStartDate(dateStart);
            setEndDate(dateEnd);
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
                    return data;
                }else{
                    setUserContract(undefined);
                }
            }catch(error : any){
                setErrorContent(error.message);
            }
        }

        const fetchCreateContract = async (contract: CreateContract) => {
            try {
              if (token != undefined) {
                let data = await createContract(contract, token);
                return data;
              }
            } catch (error: any) {
              setErrorContent(error.message);
            }
          };

        useEffect(() => {
            const fetchData = async () => {
            await getHostelContract();
            await getRoomContract(hostelIDData || 0);
            await getServiceRoomContract(roomIDData || 0);
            await getUserAppointmentContract(roomIDData || 0)
            }
            fetchData();
        }, [token]);

        const handleHostelChange = (value: number) => {
            getRoomContract(value);
            setHostelIDData(value);
        };

        const handleRoomChange = async (value: number) => {
            const response = await getUserAppointmentContract(value);
        if (response != undefined && !errorContent) {
            await getServiceRoomContract(value);        
            setRoomIDData(value);
            setUserContract(response);
        } else {
            setErrorContent("");
        openNotificationWithIcon("error", errorContent || "Appointment not found!");
        }
        };

        const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
            notification[type]({
              message: "Notification Title",
              description: description,
            });
          };

        const handleCheckboxChange = (roomId : number, checked: any) => {
            if (checked) {
                setSelectedServices([...selectedServices, roomId]);
            } else {
                setSelectedServices(selectedServices.filter(id => id !== roomId));
            }
        };

        const handleChangeDeposit = (value: number | null) => {
            setRoomDeposit(value !== null ? value : 0);
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
                                    <Row justify="space-between" align="middle">
                                        <Col span={3}>
                                            <Checkbox key={service.roomServiceId}
                                            onChange={(e) => handleCheckboxChange(service.roomServiceId, e.target.checked)}>
                                                <span style={{fontWeight:"bold"}}>{service.serviceName}</span></Checkbox>
                                        </Col>
                                        <Col span={5}>
                                            <p>{NumberFormat(service.servicePrice)}</p>
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

        const [isModalOpen, setIsModalOpen] = useState(false);
        const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
        
        const handleDetailCancel = () => {
            setIsModalDetailOpen(false);
        };

        const showModal = () => {
            setFormErrors({ name: '', phone: '', citizen_card: '' });
            setIsModalOpen(true);
        };
        
        const handleOk = () => {
            const errors = { name: '', phone: '', citizen_card: '' };
        
            if (!newMember.name) {
            errors.name = 'Name is required';
            }
            if (!newMember.phone) {
            errors.phone = 'Phone is required';
            }
            if (!newMember.citizen_card) {
            errors.citizen_card = 'Citizen card is required';
            }
        
            setFormErrors(errors);
        
            if (!errors.name && !errors.phone && !errors.citizen_card) {
            setMemberData([...memberData, newMember]);
            setNewMember({ name: '', phone: '', citizen_card: '' });
            setIsModalOpen(false);
            }
        };
        
        const handleCancel = () => {
            setNewMember({ name: '', phone: '', citizen_card: '' });
            setFormErrors({ name: '', phone: '', citizen_card: '' });
            setIsModalOpen(false);
        };
        
        const handleInputChange = (name: string, value: string | number) => {
            setNewMember({ ...newMember, [name]: value });
        
            setFormErrors({
            ...formErrors,
            [name]: ''
            });
        };

        const handleDelete = (index: number | null) => {
            if (index !== null) {
            const newMemberData = [...memberData];
            newMemberData.splice(index, 1);
            setMemberData(newMemberData);
            setSelectedMember(null);
            setSelectedIndex(null);
            setIsModalDetailOpen(false);
            }
        };

        const handleCreateContract = () => {
            if(startDate && endDate && userId && userContract?.viewerId && roomIDData && roomDeposit && updatedContent){
                let data: CreateContract = {
                    ownerAccountID: userId, 
                    studentAccountID: userContract.viewerId,
                    roomID: roomIDData,
                    contractTerm: updatedContent,
                    dateStart: startDate,
                    dateEnd: endDate,
                    roomFee: userContract.roomFee || 0,
                    depositFee: roomDeposit,
                    contractMember: memberData || null,
                    roomService: selectedServices
                };
        
                fetchCreateContract(data);
                openNotificationWithIcon("success", "Create successfully");
            } else {
                openNotificationWithIcon("error", "You must fill all fields");
            }
        };
        
        const hostelOptions = [
            ...hostelData.map((hostel) => ({
                value: hostel.hostelID,
                label: hostel.hostelName,
            }))
        ];

        const roomOptions = [
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
            <Form
                // {...formItemLayout}
                variant="filled"
                style={{
                maxWidth: "100%",
                }}  
            >
                <div style={{display: "flex", justifyContent:"start", marginBottom: "20px"}}>
                    <Form.Item
                    label="Date Start --> Date End :"
                    name="Date"
                    >
                            <RangePicker style={{width: "600px"}} onChange = {onChangeDate} required/>
                    </Form.Item>
                </div>
                <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                    <Form.Item
                    label="Hostel :"
                    name="Hostel"
                    rules={[
                        {
                        required: true,
                        message: 'Please input!',
                        },
                    ]}
                    >
                        <Select
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
                        />
                    </Form.Item>

                    <Form.Item
                    label="Room :"
                    name="Room"
                    rules={[
                        {
                        required: true,
                        message: 'Please input!',
                        },
                    ]}
                    >
                        <Select
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
                            onChange={handleRoomChange}
                            options={roomOptions}
                            aria-required
                        />
                    </Form.Item>
                </div>

                <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                    <Form.Item
                    label="Room Fee :"
                    name="RoomFee"
                    >
                    <Input placeholder={NumberFormat(userContract?.roomFee || 0)} style={{width: "200px", borderRadius:"10px"}} disabled  value={userContract?.roomFee} />
                    </Form.Item>

                    <Form.Item
                    label="Deposit Room : "
                    name="DepositRoom"
                    rules={[
                        {
                        required: true,
                        message: 'Please input!',
                        },
                    ]}
                    >
                    <InputNumber
                        defaultValue={0}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{width: "200px", borderRadius:"10px"}}
                        required
                        onChange={handleChangeDeposit}
                        />
                    </Form.Item>
                </div>

                <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                    <Form.Item
                    label="Name :"
                    name="Name"
                    >
                    <Input placeholder={userContract?.viewerName} style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.viewerName} />
                    </Form.Item>

                    <Form.Item
                    label="Phone :"
                    name="Phone"
                    >
                    <Input placeholder={userContract?.viewerPhone} style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.viewerPhone} required/>
                    </Form.Item>
                </div>

                <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                    <Form.Item
                    label="Citizen Card :"
                    name="CitizenCard"
                    >
                    <Input placeholder={userContract?.viewerCitizenCard} style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.viewerCitizenCard} />
                    </Form.Item>

                    <Form.Item
                    label="Email :"
                    name="Email"
                    >
                    <Input placeholder={userContract?.viewerEmail} style={{width: "200px", borderRadius:"10px"}} disabled value={userContract?.viewerEmail} required/>
                    </Form.Item>
                </div>
                <div style={{display:"flex", justifyContent: "left", marginBottom: "20px"}}>
                <Form.Item
                label="Contract Term : "
                name="ContractTerm"
                rules={[
                    {
                    required: true,
                    message: 'Please input!',
                    },
                ]}
                labelCol={{
                    span: 24,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                >
                <CKEditor
                        editor={ClassicEditor}
                        
                        onChange={(_e, editor) => setUpdatedContent(editor.getData())}
                    />
                </Form.Item>
                </div>
                <div style={{display: "flex", justifyContent:"start", marginBottom: "20px", width: "100%", textAlign: "left"}}>
                    <Collapse items={items} style={{width:"100%"}}/>
                </div>
                <div style={{display: "flex", justifyContent:"start", marginBottom: "20px", width: "100%", textAlign: "left"}}>
                    <h2 style={{marginTop:"10px", fontWeight:"bold"}}>Member Room : </h2>
                    <PlusCircleFilled onClick={showModal} style={{fontSize:"40px", color:"blue", marginLeft:"30px"}}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'start', marginBottom: '20px', width: '100%', textAlign: 'left' }}>
                    {memberData.map((member: MemberContract, index) => (
                        <Card
                        key={index}
                        hoverable
                        style={{ width: '175px', margin: '10px' }}
                        cover={<UserOutlined style={{ fontSize: '50px', marginTop: '10px' }} />}
                        onClick={() => {
                            setSelectedMember(member);
                            setSelectedIndex(index);
                            setIsModalDetailOpen(true);
                        }}
                        >
                        <div style={{ textAlign: 'center' }}>
                            <p>{member.name}</p>
                            <p>{member.phone}</p>
                            <p>{member.citizen_card}</p>
                        </div>
                        </Card>
                    ))}
                </div>
                <Modal
                title={<div style={{ textAlign: 'center', fontWeight: 'bold', color: 'cornflowerblue', fontSize: '20px' }}>Member Details</div>}
                open={isModalDetailOpen}
                onCancel={handleDetailCancel}
                footer={[
                    <Button key="cancel" onClick={handleDetailCancel}>
                    Cancel
                    </Button>,
                    <Button key="delete" type="primary" onClick={() => handleDelete(selectedIndex)}>
                    Delete
                    </Button>,
                ]}
                >
                {selectedMember && (
                    <div>
                    <h2 style={{ marginBottom: '30px', marginTop: '40px' }}>Student Name: <span>{selectedMember.name}</span></h2>
                    <h2 style={{ marginBottom: '30px' }}>Student Phone: <span>{selectedMember.phone}</span></h2>
                    <h2 style={{ marginBottom: '30px' }}>Student Citizen Card: <span>{selectedMember.citizen_card}</span></h2>
                    </div>
                )}
                </Modal>


                <Modal
                title={<div style={{ textAlign: 'center', fontWeight: 'bold', color: 'cornflowerblue', fontSize: '20px' }}>ADD NEW MEMBER</div>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                    Cancel
                    </Button>,
                    <Button key="create" type="primary" onClick={handleOk}>
                    Create
                    </Button>,
                ]}
                >
                <div>
                    <h2 style={{ marginBottom: '30px', marginTop: '40px'}}>Student Name: 
                    <Input
                        name="name"
                        placeholder=""
                        style={{ width: '300px', borderRadius: '10px', height: '30px' , marginLeft:'20px'}}
                        value={newMember.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                    />
                    {formErrors.name && <p style={{ color: 'red' }}>{formErrors.name}</p>}
                    </h2>
                    <h2 style={{ marginBottom: '30px' }}>Student Phone: 
                    <InputNumber
                        name="phone"
                        placeholder=""
                        style={{ width: '300px', borderRadius: '10px', height: '30px', marginLeft:'20px'}}
                        value={newMember.phone}
                        onChange={(value) => handleInputChange('phone', value || "")}
                        required
                    />
                    {formErrors.phone && <p style={{ color: 'red' }}>{formErrors.phone}</p>}
                    </h2>
                    <h2 style={{ marginBottom: '30px' }}>Citizen Card: 
                    <InputNumber
                        name="citizen_card"
                        placeholder=""
                        style={{ width: '300px', borderRadius: '10px', height: '30px', marginLeft:'35px' }}
                        value={newMember.citizen_card}
                        onChange={(value) => handleInputChange('citizen_card', value || "")}
                        required
                    />
                    {formErrors.citizen_card && <p style={{ color: 'red' }}>{formErrors.citizen_card}</p>}
                    </h2>
                </div>
                </Modal>
                    <Form.Item
                    >
                        <div style={{display:"flex", justifyContent: "center", marginBottom: "20px", marginTop: "50px"}}>
                    <Button type="primary" htmlType="submit" className={`bg-blue-500 hover:bg-blue-700 text-white font-bold rounded`}
                        onClick={handleCreateContract}>
                        Create Contract
                    </Button>
                    </div>
                </Form.Item>
            </Form>
            </div>
        </div>
    </>
    );
    }

    export default OwnerContractCreate;