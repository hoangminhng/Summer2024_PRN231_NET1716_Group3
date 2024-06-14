import {
  Button,
  Input,
  Descriptions,
  notification,
} from "antd";
import { useState, useContext } from "react";
import { createPackage } from "../../../../api/Admin/adminPackages";
import { UserContext } from "../../../../context/userContext";

const AdminNewPackage: React.FC = () => {
  const { token } = useContext(UserContext);
  const [errorContent, setErrorContent] = useState<string>("");
  const initialPackageData = {
    capacityHostel: 0,
    memberShipFee: 0,
    memberShipName: "",
    month: 0
  };
  const [packageData, setPackageData] = useState<NewPackage>(initialPackageData);

  const fetchCreatePackage = async (Package: NewPackage) => {
    try {
      if (token != undefined) {
        let data = await createPackage(Package, token);
        return data;
      }
    } catch (error: any) {
      setErrorContent(error.message);
      throw error;
    }
  };

  const handleChange = (fieldName: keyof NewPackage, value: string) => {
    if (fieldName === "memberShipName") {
      value = value.trimStart();
    }

    setPackageData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleKeyDown = (fieldName: keyof NewPackage, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (fieldName === "memberShipName" && e.key === ' ' && e.currentTarget.selectionStart === 0) {
      e.preventDefault();
    }
  };

  const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
    notification[type]({
      message: "Notification Title",
      description: description,
    });
  };

  const CreatePackage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (packageData.memberShipFee == undefined) {
      packageData.memberShipFee = 0;
    }
    if (packageData.month == undefined) {
      packageData.month = 0;
    }
    if (packageData.capacityHostel == undefined) {
      packageData.capacityHostel = 0;
    }
    try{
      const response = await fetchCreatePackage(packageData);
      if (response != undefined && !errorContent) {
        openNotificationWithIcon("success", "Create new package successfully!");
        setPackageData(initialPackageData);
      }
    }catch(error : any){
      openNotificationWithIcon("error", error.message || "Have some error");
      setErrorContent("");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={CreatePackage}>
          <Descriptions bordered title="Create New Package">
            <Descriptions.Item label="Package Name" span={3}>
              <Input
                placeholder="Enter package"
                required
                onChange={(e) => handleChange("memberShipName", e.target.value)}
                onKeyDown={(e) => handleKeyDown("memberShipName", e)}
                value={packageData.memberShipName} 
              />
            </Descriptions.Item>
            <Descriptions.Item label="Capacity Hostel" span={3}>
              <Input
                type="number"
                required
                placeholder="Enter capacity hostel"
                onChange={(e) => handleChange("capacityHostel", e.target.value)}
                value={packageData.capacityHostel.toString() == "0" ? "": packageData.capacityHostel.toString()} 
              />
            </Descriptions.Item>
            <Descriptions.Item label="Package Fee" span={3}>
              <Input
                type="number"
                required
                placeholder="Enter your fee"
                onChange={(e) => handleChange("memberShipFee", e.target.value)}
                value={packageData.memberShipFee.toString() == "0" ? "": packageData.memberShipFee.toString()} 
              />
            </Descriptions.Item>
            <Descriptions.Item label="Month" span={3}>
              <Input
                type="number"
                required
                placeholder="Enter month"
                onChange={(e) => handleChange("month", e.target.value)}
                value={packageData.month.toString() == "0" ? "": packageData.month.toString()}
              />
            </Descriptions.Item>
          </Descriptions>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button type="primary" htmlType="submit">Create</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminNewPackage;
