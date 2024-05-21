import {
    Button,
    Input,
    Descriptions,
    notification
  } from "antd";
  import { useState } from "react";
  import {
    createPackage
  } from "../../../../api/Admin/adminPackages";
  import { useContext } from "react";
  import { UserContext } from "../../../../context/userContext";
  
  const AdminNewPackage: React.FC = () => {
  
    const { token } = useContext(UserContext);
    const [packageData, setPackageData] = useState<Package>({
        capacityHostel: 0,
        memberShipFee: 0,
        memberShipName: "",
        month: 0,
        status: 0,
        memberShipID: 0,
      });
  

    const fetchCreatePackage = async (Package: Package) => {
        try {
          if (token) {
            let data: Message | undefined;
            data = await createPackage(Package, token);
            return data;
          }
        } catch (error) {
          console.error("Error fetching add staff:", error);
        }
      };
    
  
  
    const handleChange = (fieldName: keyof Package, value: string) => {
        setPackageData((prevData) => ({
          ...prevData,
          [fieldName]: value,
        }));
      };

      const openNotificationWithIcon = (type: 'success' | 'error', description: string) => {
        notification[type]({
          message: "Notification Title",
          description: description,
        });
      };

      const CreatePackage = async () => {
        packageData.status = 0;
        const response = await fetchCreatePackage(packageData);
        if (response != undefined && response) {
          if (response.statusCode == "MSG04") {
            openNotificationWithIcon("success", response.message);
          } else {
            openNotificationWithIcon("error", "Something went wrong when executing operation. Please try again!");
          }
      }
    };
  
    const items = [
        {
          key: "1",
          label: "Package Name",
          children: (
            <Input
              placeholder="Enter package"
              required
              onChange={(e) => handleChange("memberShipName", e.target.value)}
            />
          ),
          span: 3,
        },
        {
          key: "2",
          label: "Capacity Hostel",
          children: (
            <Input
              type="number"
              required
              placeholder="Enter capacity hostel"
              onChange={(e) => handleChange("capacityHostel", e.target.value)}
            />
          ),
          span: 3,
        },
        {
          key: "3",
          label: "Package Fee",
          children: (
            <Input
              type="number"
              required
              placeholder="Enter your fee"
              onChange={(e) => handleChange("memberShipFee", e.target.value)}
            />
          ),
          span: 3,
        },
        {
          key: "4",
          label: "Month",
          children: (
            <Input
              type="number"
              placeholder="Enter month"
              required
              onChange={(e) => handleChange("month", e.target.value)}
            />
          ),
          span: 3,
        },
      ];
   
   
    return (
      <>
          <div>

            <Descriptions bordered title="Create New Package" items={items}></Descriptions>
            <br />
            <div
                style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                }}
            >
                <Button onClick={CreatePackage}>Create</Button>
            </div>
          </div>
      </>
    );
  };
  
  export default AdminNewPackage;
  