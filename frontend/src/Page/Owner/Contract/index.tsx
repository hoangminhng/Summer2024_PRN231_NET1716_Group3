    import {  DatePicker, Select, Input, Collapse, Row, Col, InputNumber, Button, Modal, Card, Checkbox, notification, Form, Spin} from "antd";
    import {
        PlusCircleFilled,
        UserOutlined,
        ApiOutlined
    } from "@ant-design/icons";
    const { RangePicker } = DatePicker;
    import { useContext } from "react";
    import { UserContext } from "../../../context/userContext";
    import { useState, useEffect } from "react";
    import { getHostelOwnerContract } from "../../../api/Owner/ownerHostel";
    import { getRoomOwnerContract } from "../../../api/Owner/ownerRoom";
    import { getServiceRoomOwnerContract } from "../../../api/Owner/ownerService";
    import { createContract, getOldElectricAndWaterNumberOwnerContract, getUserAppointmentOwnerContract } from "../../../api/Owner/ownerContract";
    import { NumberFormat } from "../../../Utils/numberFormat";
    import { LoadingOutlined } from "@ant-design/icons";
    import ReactQuill from 'react-quill';
    import '../Contract/cardTitle.css';
    import 'react-quill/dist/quill.snow.css'; 
import { getOwnerCurrentActiveMembership } from "../../../api/Owner/ownerPackage";

    const OwnerContractCreate : React.FC = () => {
        const [updatedContent, setUpdatedContent] = useState<string>("");
        const [loading, setLoading] = useState(false);
        const [packageLoading, setPackageLoading] = useState(true);
        const [errorContent, setErrorContent] = useState<any>("");
        const [roomDeposit, setRoomDeposit] = useState<number>(0);
        const [initWater, setInitWater] = useState<number>(0);
        const [initElec, setInitElec] = useState<number>(0);
        const [roomFee, setRoomFee] = useState<number>(0);
        const [capacity, setCapacity] = useState<number>(0);
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
        const [activePackage, setActivePackage] = useState<RegisterPackage>();
        const { token , userId} = useContext(UserContext); 
        const [form] = Form.useForm();

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
        
        const fetchStatusPackage = async () => {
            try {
              if (token != undefined) {
                let data = await getOwnerCurrentActiveMembership(token);
                setActivePackage(data);
              }
            } catch (error) {
              console.error("Error fetching status package:", error);
            } finally {
              setPackageLoading(false);
            }
          };

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

        const getOldServiceNumberContract = async (roomID : number) =>{
            try{
                if(token != undefined && roomID != 0){
                    let data = await getOldElectricAndWaterNumberOwnerContract(roomID, token)
                    if(data != undefined)
                    return data;
                }
            }catch(error : any){
                setErrorContent(error.message);
            }
        }

        const fetchCreateContract = async (contract: CreateContract) => {
            setLoading(true);
            try {
              if (token != undefined) {
                let data = await createContract(contract, token);
                return data;
              }
            } catch (error: any) {
              setErrorContent(error.message);
            }finally {
                setLoading(false);
              }
          };

        useEffect(() => {
            const fetchData = async () => {
            await getHostelContract();
            fetchStatusPackage();
            await getOldServiceNumberContract(roomIDData || 0);
            await getRoomContract(hostelIDData || 0);
            await getServiceRoomContract(roomIDData || 0);
            await getUserAppointmentContract(roomIDData || 0);
            }
            fetchData();
        }, [token]);

        useEffect(() => {
            fetchStatusPackage();
          }, [token]);
    
    
          useEffect(() => {
            if (!packageLoading) {
                const fetchData = async () => {
                    await getHostelContract();
                    await getOldServiceNumberContract(roomIDData || 0);
                    await getRoomContract(hostelIDData || 0);
                    await getServiceRoomContract(roomIDData || 0);
                    await getUserAppointmentContract(roomIDData || 0);
                    }
                    fetchData();
            }
          }, [packageLoading, token]);

        const handleHostelChange = async (value: number) => {
            getRoomContract(value);
            setHostelIDData(value);
        };
        const handleAccountChange = (value: number) => {
            const member = userContract?.accountAppointments.find(user => user.viewerId === value);
            setSelectedMemberAccount(member);
        };

        const handleRoomChange = async (value: number) => {
            const response = await getUserAppointmentContract(value);
            const responeOldNUmber = await getOldServiceNumberContract(value);
        if (response != undefined && !errorContent && responeOldNUmber != undefined) {
            await getServiceRoomContract(value);  
            setRoomIDData(value);
            setUserContract(response);
            setInitElec(responeOldNUmber.electricNumber);
            setInitWater(responeOldNUmber.waterNumber);
            setCapacity(response.capacity)
            form.setFieldsValue({ roomFee : response.roomFee, depositFee : response.roomFee, elecNumber : responeOldNUmber.electricNumber, waterNumber : responeOldNUmber.waterNumber  }); 
            setRoomDeposit(response.roomFee);
            setRoomFee(response.roomFee);
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

        const handleChangeDeposit = async (value: number | null) => {
            setRoomDeposit(value !== null ? value : roomDeposit);

        };
        const handleChangeFee = async (value: number | null) => {
            setRoomFee(value ? value : roomFee);

        };

        const handleChangeWaterNumber = async (value: number | null) => {
            setInitWater(value ? value : initWater);

        };

        const handleChangeElecNumber = async (value: number | null) => {
            setInitElec(value ? value : initElec);

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
                                                <span style={{fontWeight:"bold"}}>{service.typeServiceName}</span></Checkbox>
                                        </Col>
                                        <Col span={5}>
                                            <p>{NumberFormat(service.servicePrice)}</p>
                                        </Col>
                                        <Col span={5}>
                                            <p>({service.serviceName})</p>
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
            if(memberData.length < capacity){
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

                if(newMember.citizenCard.length != 12){
                    errors.citizenCard = 'Citizen card must be 12 digits';
                }

                if(newMember.phone.length != 10){
                    errors.phone = 'Phone must be 10 digits';
                }
            
                setFormErrors(errors);
            
                if (!errors.name && !errors.phone && !errors.citizenCard) {
                setMemberData([...memberData, newMember]);
                setNewMember({ name: '', phone: '', citizenCard: '' });
                setIsModalOpen(false);
                }
            }else{
                openNotificationWithIcon("error", "The number of people in the room has exceeded the limit.");
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
            if(!updatedContent){
                openNotificationWithIcon("error", "Please fill rule contract!");
                setErrorContent("");
            }
            else if(startDate && endDate && userId && selectedMemberAccount?.viewerId && roomIDData && roomDeposit && userContract){
                let data: CreateContract = {
                    ownerAccountID: userId, 
                    studentAccountID: selectedMemberAccount?.viewerId,
                    roomID: roomIDData,
                    contractTerm: updatedContent,
                    dateStart: startDate,
                    dateEnd: endDate,
                    roomFee: roomFee || userContract.roomFee,
                    depositFee: roomDeposit,
                    contractMember: memberData || null,
                    roomService: selectedServices,
                    initWater: initWater,
                    initElec: initElec
                };
                const response = await fetchCreateContract(data);
                if (response != undefined && !errorContent) {      
                    openNotificationWithIcon("success", "Create successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } else {
                openNotificationWithIcon("error", errorContent || "Appointment not found!");
                setErrorContent("");
                }
            } else {
                openNotificationWithIcon("error", "You must fill all fields");
                setErrorContent("");
            }
        };

        useEffect(() => {
            if (userContract) {
                setRoomDeposit(userContract.roomFee || 0);
            }
        }, [userContract]);
        
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

        const handleChange = (content :any) => {
            setUpdatedContent(content);
        };

        const memberOptions = userContract?.accountAppointments?.map((user) => ({
            value: user.viewerId,
            label: `${user.viewerName} (${statusStringMap[user.status]})`,
        })) || [];

    return (
        <>
        {packageLoading ? (
        <Spin
          spinning={true}
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
        />
      ) : activePackage ? (
        <div>
            <div style={{width: "100%", textAlign: "center", fontSize: "20", fontWeight:"bold", backgroundColor:"aliceblue", padding:"20px"}}>
                <h2>CREATE NEW CONTRACT</h2>
            </div>
            <div style={{marginTop:"30px", padding: "20px"}}>
            <Form
                form={form}
                variant="filled"
                initialValues={{roomFee: "",
                    depositFee: "", waterNumber:"", elecNumber: ""}}
                style={{
                maxWidth: "100%",
                }}  
                autoComplete="off"
            >

                <div style={{display: "flex", justifyContent:"start", marginBottom: "20px"}}>
                    <Card
                    title={<p style={{fontWeight:"bold", textTransform:"uppercase"}}>Date Contract (Rental start date and end date)</p>}
                    className="custom-card"
                    style={{
                        width: "100%",
                    }}
                    >
                    <Form.Item
                    label="Date Start --> Date End :"
                    rules={[
                        {
                        required: true,
                        message: 'Please input data start and date end for contract!',
                        },
                    ]}
                    >
                            <RangePicker style={{width: "600px"}} onChange = {onChangeDate} required/>
                    </Form.Item>
                    </Card>
                </div>

                <div style={{display: "flex", justifyContent:"start", marginBottom: "20px"}}>
                <Card
                    title={<p style={{fontWeight:"bold", textTransform:"uppercase"}}>Hostel and Room</p>}
                    className="custom-card"
                    style={{
                        width: "100%",
                    }}
                    >
                    <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                    <Form.Item
                    label="Hostel :"
                    name = "hostel"
                    rules={[
                        {
                        required: true,
                        message: 'Please select hostel to create contract!',
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
                    name="room"
                    rules={[
                        {
                        required: true,
                        message: 'Please select room to create contract!',
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

                <div style={{display:"flex", justifyContent: "space-between", marginBottom: "10px"}}>
                    <Form.Item
                    label="Room Amount :"
                    name="roomFee"
                    labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                    rules={[
                        {
                        required: true,
                        message: 'Please input your fee room!',
                        },
                        {
                            validator: (_, value) =>
                                value && value > 0
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Please input positive number!')),
                        },
                    ]}
                    >
                   <InputNumber
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        style={{width: "250px", borderRadius:"10px"}}
                        onChange={handleChangeFee}
                        />
                    </Form.Item>

                    <Form.Item
                    label="Deposit Room : "
                    name="depositFee"
                    labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                    rules={[
                        {
                        required: true,
                        message: 'Please input your deposit room!',
                        },
                        {
                            validator: (_, value) =>
                                value && value > 0
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Please input positive number!')),
                        },
                    ]}
                    >
                    <InputNumber
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        style={{width: "250px", borderRadius:"10px"}}
                        onChange={handleChangeDeposit}
                        />
                    </Form.Item>
                    <Form.Item
                    label="Init Water Number :"
                    name="waterNumber"
                    labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                    rules={[
                        {
                        required: true,
                        message: 'Please input the initial of water number!',
                        },
                        {
                            validator: (_, value) =>
                                value && value > 0
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Please input positive number!')),
                        },
                    ]}
                    >
                   <InputNumber
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        style={{width: "250px", borderRadius:"10px"}}
                        onChange={handleChangeWaterNumber}
                        />
                    </Form.Item>

                    <Form.Item
                    label="Init Electric Number : "
                    name="elecNumber"
                    labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                    rules={[
                        {
                        required: true,
                        message: 'Input the initial of electric number!',
                        },
                        {
                            validator: (_, value) =>
                                value && value > 0
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Please input positive number!')),
                        },
                    ]}
                    >
                    <InputNumber
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        style={{width: "250px", borderRadius:"10px"}}
                        onChange={handleChangeElecNumber}
                        />
                    </Form.Item>
                </div>

                    </Card>
                    </div>

                <div style={{display: "flex", justifyContent:"start", marginBottom: "20px"}}>
                <Card
                    title={<p style={{fontWeight:"bold", textTransform:"uppercase"}}>Information of user</p>}
                    className="custom-card"
                    style={{
                        width: "100%",
                    }}
                    >
                    <Form.Item
                    name="name"
                    label="Name :"
                    rules={[
                        {
                        required: true,
                        message: 'Please select user to hire the room!',
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

                <div style={{display:"flex", justifyContent: "space-between", marginBottom: "5px"}}>
                    <Form.Item
                    label="Phone :"
                    >
                    <Input placeholder={selectedMemberAccount?.viewerPhone} style={{width: "200px", borderRadius:"10px", height:"30px"}} disabled value={selectedMemberAccount?.viewerPhone} required/>
                    </Form.Item>
                    <Form.Item
                    label="Citizen Card :"
                    >
                    <Input placeholder={selectedMemberAccount?.viewerCitizenCard} style={{width: "200px", borderRadius:"10px", height:"30px"}} disabled value={selectedMemberAccount?.viewerCitizenCard} />
                    </Form.Item>

                    <Form.Item
                    label="Email :"
                    >
                    <Input placeholder={selectedMemberAccount?.viewerEmail} style={{width: "250px", borderRadius:"10px", height:"30px"}} disabled value={selectedMemberAccount?.viewerEmail} required/>
                    </Form.Item>
                    </div>
                    </Card>
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
                <Form.Item
                    name="Rule General"
                    label={<p style={{fontWeight:"bold"}}><span style={{color:"red"}}>* </span>Rule General :</p>}
                    labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                    >
                        <div style={{display:"flex", justifyContent: "left", marginBottom: "20px"}}>
                    <ReactQuill 
                theme="snow" 
                onChange={handleChange}
                modules={{
                    toolbar: [
                        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                        [{size: []}],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}, 
                        {'indent': '-1'}, {'indent': '+1'}],
                        ['link', 'image', 'video'],
                        ['clean']                                         
                    ],
                }}
                formats={[
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent',
                    'link', 'image', 'video'
                ]}
                style={{ height: '400px', marginBottom: '40px', width: "100%"}}
            />
            </div>
                    </Form.Item> 
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
            {loading ? (
          <Spin
            fullscreen={true}
            spinning={loading}
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          />
        ) :(
            <div>

            </div>
        )
    }
            </div>      
        </div>
    ) : (
      <div className="w-full text-center items-center justify-between">
        <ApiOutlined style={{fontSize:"100px", marginTop:"50px"}}/>
        <p style={{fontWeight: "bold"}}>Your current account has not registered for the package, so you cannot access this page. Please register for a membership package to use.</p>
      </div>
    )}
    </>
    );
    }

    export default OwnerContractCreate;