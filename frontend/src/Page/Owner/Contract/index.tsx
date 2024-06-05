import {  DatePicker, Select, Input } from "antd";
const { RangePicker } = DatePicker;
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { useState, useEffect } from "react";

const OwnerContractCreate : React.FC = () => {
    const [updatedContent, setUpdatedContent] = useState<string>("");
    const onChangeDate = (dates : any) => {
        const dateStart = new Date(dates[0].$d);
        const dateEnd = new Date(dates[1].$d);
        console.log(dateStart.toISOString(), dateEnd.toISOString());
    };

    const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}
const handleChange = (value : any) => {
  console.log(`selected ${value}`);
};

return (
    <>
    <div>
        <div style={{width: "100%", textAlign: "center", fontSize: "20", fontWeight:"bold", backgroundColor:"aliceblue", padding:"20px"}}>
            <h2>CREATE NEW CONTRACT</h2>
        </div>
        <div style={{marginTop:"30px", padding: "20px"}}>
            <div style={{display: "flex", justifyContent:"start", marginBottom: "20px"}}>
                <h2>Date Start --{">"} Date End : &nbsp;&nbsp;&nbsp; <span><RangePicker style={{width: "600px"}} onChange = {onChangeDate}/></span></h2>
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
                    options={[
                        {
                            value: 0,
                            label: ' '
                        },
                        {
                            value: 1,
                            label: 'Not Identified',
                        },
                        {
                            value: 2,
                            label: 'Closed',
                        },
                        {
                            value: 3,
                            label: 'Communicated',
                        },
                        {
                            value: 4,
                            label: 'Identified',
                        },
                        {
                            value: 5,
                            label: 'Resolved',
                        },
                        {
                            value: 6,
                            label: 'Cancelled',
                        },
                    ]}
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
                    options={[
                        {
                            value: 0,
                            label: ' '
                        },
                        {
                            value: 1,
                            label: 'Not Identified',
                        },
                        {
                            value: 2,
                            label: 'Closed',
                        },
                        {
                            value: 3,
                            label: 'Communicated',
                        },
                        {
                            value: 4,
                            label: 'Identified',
                        },
                        {
                            value: 5,
                            label: 'Resolved',
                        },
                        {
                            value: 6,
                            label: 'Cancelled',
                        },
                    ]}
                /></h2>
            </div>
            <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                <h2>Room Fee : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span><Input placeholder="Room Fee" style={{width: "200px", borderRadius:"10px"}} disabled/></span></h2>
                    <h2>Room Deposit : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span><Input placeholder="Room Deposit" style={{width: "200px", borderRadius:"10px"}} disabled/></span></h2>
            </div>
            <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
                <h2>Student Name : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span><Input placeholder="Student Name" style={{width: "200px", borderRadius:"10px"}} disabled/></span></h2>
                <h2>Phone : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span><Input placeholder="Phone" style={{width: "200px", borderRadius:"10px"}} disabled/></span></h2>
            </div>
            <div style={{display:"flex", justifyContent: "space-between", marginBottom: "20px"}}>
            <h2>Citizen Identification Card : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span><Input placeholder="Citizen Identification Card" style={{width: "200px", borderRadius:"10px"}} disabled/></span></h2>
                <h2>Email : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span><Input placeholder="Email" style={{width: "200px", borderRadius:"10px"}} disabled/></span></h2>
            </div>
            <div style={{display: "flex", justifyContent:"start", marginBottom: "20px", width: "100%", textAlign: "left"}}>
            <h2 style={{width: "100px"}}>Service : </h2><Select
                    mode="multiple"
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Please service"
                    onChange={handleChange}
                    options={options}
            />
            </div>
            <div style={{display: "flex", justifyContent:"start", marginBottom: "20px"}}>
                <h2>Contract Term : </h2>
            </div>
                <CKEditor
                    editor={ClassicEditor}
                    onChange={(_e, editor) => setUpdatedContent(editor.getData())}
                />
        </div>
    </div>
    </>
);
}

export default OwnerContractCreate;