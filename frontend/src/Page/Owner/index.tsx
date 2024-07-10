import React, { useContext, useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  HomeOutlined,
  FormOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CalendarFilled,
  UserOutlined,
  DesktopOutlined,
  ExceptionOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
const { Sider, Header, Footer } = Layout;
import type { MenuProps } from "antd";
import { UserContext } from "../../context/userContext";
import { Odata } from "../../interface/Odata";
import { getMemberNotifications } from "../../api/Member/memberNotification";

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const OwnerLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { logout } = useContext(UserContext);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const { token, userId } = useContext(UserContext);
  const fetchNotificationList = async () => {
    try {
      if (token != undefined) {
        let data: Odata<notification> | undefined;
        data = await getMemberNotifications(token, userId);
        const unreadCount =
          data?.value.filter((notification) => !notification.IsRead).length ||
          0;
        setNotificationCount(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching contract list:", error);
    }
  };

  useEffect(() => {
    fetchNotificationList();
  }, []);

  const items: MenuItem[] = [
    getItem("Profile", "1", <UserOutlined />),
    getItem("Hostel", "2", <HomeOutlined />),
    getItem("Contract", "sub1", <FormOutlined />, [
      getItem("Contract", "3"),
      getItem("Create Contract", "4"),
    ]),
    getItem("Bill", "sub2", <DollarOutlined />, [
      getItem("Bill", "5"),
      getItem("Create Bill", "6"),
    ]),
    getItem("Package", "sub3", <ShoppingOutlined />, [
      getItem("Package", "7"),
      getItem("Register History", "11"),
    ]),
    getItem("Appointment", "8", <CalendarFilled />),
    getItem("Complains", "12", <ExceptionOutlined />),
    getItem(
      <>
        Notification{" "}
        {notificationCount > 0 && (
          <span style={{ color: "red" }}>({notificationCount})</span>
        )}
      </>,
      "13",
      <BellOutlined />
    ),
    getItem("View Home", "9", <DesktopOutlined />),
    getItem("Logout", "10", <LogoutOutlined />),
  ].filter(Boolean) as MenuItem[];

  const handleMenuClick = (key: React.Key) => {
    switch (key) {
      case "1":
        navigate("/owner/profile");
        break;
      case "2":
        navigate("/owner/hostels");
        break;
      case "3":
        navigate("/owner/contracts");
        break;
      case "4":
        navigate("/owner/contract/create");
        break;
      case "5":
        navigate("/owner/bill-payment");
        break;
      case "6":
        navigate("/owner/bill-payment/create");
        break;
      case "7":
        navigate("/owner/package");
        break;
      case "8":
        navigate("/owner/appointments");
        break;
      case "9":
        navigate("/");
        break;
      case "10":
        logout();
        navigate("/");
        break;
      case "11":
        navigate("/owner/package/history");
        break;
      case "12":
        navigate("/owner/complains");
        break;
      case "13":
        navigate("/owner/notifications");
        break;
      default:
        break;
    }
  };

  return (
    <nav
      className="fixed w-full z-20 top-0 start-0 h-full overflow-y-auto"
      style={{ textAlign: "left" }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          style={{ background: colorBgContainer }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            // defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            onClick={({ key }) => handleMenuClick(key)}
            style={{ background: colorBgContainer }}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              textAlign: "left",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Hostel Management Platform ©{new Date().getFullYear()} Created by
            Group 3
          </Footer>
        </Layout>
      </Layout>
    </nav>
  );
};

export default OwnerLayout;
