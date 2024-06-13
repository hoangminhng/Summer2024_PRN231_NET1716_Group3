    import {  DatePicker, Select, Input, Collapse, Row, Col, InputNumber, Button, Modal, Card, Checkbox, notification, Form} from "antd";
    import {
        PlusCircleFilled,
        UserOutlined
    } from "@ant-design/icons";
    const { TextArea } = Input;
    const { RangePicker } = DatePicker;
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
        const [newMember, setNewMember] = useState({name:'', phone: '', citizenCard: ''} as MemberContract);
        const [formErrors, setFormErrors] = useState({ name: '', phone: '', citizenCard: '' });
        const [selectedServices, setSelectedServices] = useState<number[]>([]);
        const [memberData, setMemberData] = useState<MemberContract[]>([]);
        const [roomData, setRoomData] = useState<RoomOwnerContract[]>([]);
        const [serviceData, setServiceData] = useState<ServiceRoomContract[]>([]);
        const [roomIDData, setRoomIDData] = useState<number>();
        const [hostelIDData, setHostelIDData] = useState<number>();
        const [userContract, setUserContract] = useState<UserAppointmentContract>();
        const [selectedMemberAccount, setSelectedMemberAccount] = useState<MemberAppointment>();
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
        const handleAccountChange = (value: number) => {
            const member = userContract?.accountAppointments.find(user => user.viewerId === value);
            setSelectedMemberAccount(member);
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
                                                <span style={{fontWeight:"bold"}}>{service.typeName}</span></Checkbox>
                                        </Col>
                                        <Col span={5}>
                                            <p>{NumberFormat(service.price)}</p>
                                        </Col>
                                        <Col span={5}>
                                            <p>({service.unit})</p>
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
            setFormErrors({ name: '', phone: '', citizenCard: '' });
            setIsModalOpen(true);
        };
        
        const handleOk = () => {
            const errors = { name: '', phone: '', citizenCard: '' };
        
            if (!newMember.name) {
            errors.name = 'Name is required';
            }
            if (!newMember.phone) {
            errors.phone = 'Phone is required';
            }
            if (!newMember.citizenCard) {
            errors.citizenCard = 'Citizen card is required';
            }
        
            setFormErrors(errors);
        
            if (!errors.name && !errors.phone && !errors.citizenCard) {
            setMemberData([...memberData, newMember]);
            setNewMember({ name: '', phone: '', citizenCard: '' });
            setIsModalOpen(false);
            }
        };
        
        const handleCancel = () => {
            setNewMember({ name: '', phone: '', citizenCard: '' });
            setFormErrors({ name: '', phone: '', citizenCard: '' });
            setIsModalOpen(false);
        };
        
        const handleInputChange = (name: string, value: string | number) => {
            setNewMember({ ...newMember, [name]: value.toString() });
        
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

        const statusStringMap: { [key: number]: string } = {
            3 : "Register directly",
            0 : "Visit home",
          };

        const handleCreateContract = async () => {
            if(startDate && endDate && userId && selectedMemberAccount?.viewerId && roomIDData && roomDeposit && updatedContent && userContract){
                let data: CreateContract = {
                    ownerAccountID: userId, 
                    studentAccountID: selectedMemberAccount?.viewerId,
                    roomID: roomIDData,
                    contractTerm: updatedContent,
                    dateStart: startDate,
                    dateEnd: endDate,
                    roomFee: userContract.roomFee || 0,
                    depositFee: roomDeposit,
                    contractMember: memberData || null,
                    roomService: selectedServices
                };
                const response = await fetchCreateContract(data);
                if (response != undefined && !errorContent) {      
                    openNotificationWithIcon("success", "Create successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                setErrorContent("");
                openNotificationWithIcon("error", errorContent || "Appointment not found!");
                }
            } else {
                setErrorContent("");
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

        const memberOptions = userContract?.accountAppointments?.map((user) => ({
            value: user.viewerId,
            label: `${user.viewerName} (${statusStringMap[user.status]})`, // Sử dụng template string để kết hợp giá trị
        })) || [];

        const generateHTML = (inputText : string) => {
            const paragraphs = inputText.split('\n').map((line: string) => `<p>${line}</p>`).join('');
            return paragraphs;
        }
    
        const handleInputAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const inputValue = event.target.value;
            const htmlContent = generateHTML(inputValue);
            setUpdatedContent(htmlContent);
        }

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
                    rules={[
                        {
                        required: true,
                        message: 'Please input!',
                        },
                    ]}
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
                            placeholder="Select the name"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            onChange={handleAccountChange}
                            options={memberOptions}
                            aria-required
                        />
                    </Form.Item>

                    <Form.Item
                    label="Phone :"
                    name="Phone"
                    >
                    <Input placeholder={selectedMemberAccount?.viewerPhone} style={{width: "200px", borderRadius:"10px"}} disabled value={selectedMemberAccount?.viewerPhone} required/>
                    </Form.Item>
                </div>

                <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                    <Form.Item
                    label="Citizen Card :"
                    name="CitizenCard"
                    >
                    <Input placeholder={selectedMemberAccount?.viewerCitizenCard} style={{width: "200px", borderRadius:"10px"}} disabled value={selectedMemberAccount?.viewerCitizenCard} />
                    </Form.Item>

                    <Form.Item
                    label="Email :"
                    name="Email"
                    >
                    <Input placeholder={selectedMemberAccount?.viewerEmail} style={{width: "200px", borderRadius:"10px"}} disabled value={selectedMemberAccount?.viewerEmail} required/>
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
                            <p>{member.citizenCard}</p>
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
                    <h2 style={{ marginBottom: '30px' }}>Student Citizen Card: <span>{selectedMember.citizenCard}</span></h2>
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
                    <h2 style={{ marginBottom: '30px', marginTop: '40px'}}><span style={{color:"red"}}>*</span>Student Name: 
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
                    <h2 style={{ marginBottom: '30px' }}><span style={{color:"red"}}>*</span>Student Phone: 
                    <InputNumber
                        name="phone"
                        placeholder=""
                        style={{ width: '300px', borderRadius: '10px', height: '30px', marginLeft:'20px'}}
                        value={newMember.phone}
                        onChange={(value) => handleInputChange('phone', value ? value.toString() : "")}
                        required
                    />
                    {formErrors.phone && <p style={{ color: 'red' }}>{formErrors.phone}</p>}
                    </h2>
                    <h2 style={{ marginBottom: '30px' }}><span style={{color:"red"}}>*</span>Citizen Card: 
                    <InputNumber
                        name="citizenCard"
                        placeholder=""
                        style={{ width: '300px', borderRadius: '10px', height: '30px', marginLeft:'35px' }}
                        value={newMember.citizenCard}
                        onChange={(value) => handleInputChange('citizenCard', value ? value.toString() : "")}
                        required
                    />
                    {formErrors.citizenCard && <p style={{ color: 'red' }}>{formErrors.citizenCard}</p>}
                    </h2>
                </div>
                </Modal>
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
                <TextArea rows={20} style={{width:"1280px"}} onChange={handleInputAreaChange} />
                </Form.Item>
                </div>
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