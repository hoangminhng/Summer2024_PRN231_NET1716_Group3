import React, { useState, useContext } from "react";
import {
  PieChartOutlined,
  HomeOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BookOutlined,
  LogoutOutlined,
  MoneyCollectOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Col, Layout, Menu, Row, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

const { Header, Content, Footer, Sider } = Layout;

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

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(UserContext);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const items: MenuItem[] = [
    getItem("Dashboard", "1", <PieChartOutlined />),
    getItem("Account", "sub1", <UserOutlined />, [
      getItem("Accounts", "2"),
      getItem("MemberShips", "3"),
    ]),
    getItem("Hostel", "sub3", <HomeOutlined />, [
      getItem("Hostels", "4"),
    ]),
    getItem("Package", "sub4", <BookOutlined />, [
      getItem("Member Package", "5"),
      getItem("Create Package", "6"),
    ]),
    getItem("Transaction", "7", <MoneyCollectOutlined />),
    getItem("Logout", "8", <LogoutOutlined />),
  ].filter(Boolean) as MenuItem[];

  const handleMenuClick = (key: React.Key) => {
    switch (key) {
      case "1":
        navigate("/admin");
        break;
      case "2":
        navigate("/admin/accounts");
        break;
      case "3":
        navigate("/admin/memberships");
        break;
      case "4":
        navigate("/admin/hostels");
        break;
      case "5":
        navigate("/admin/packages");
        break;
      case "6":
      navigate("/admin/packages/new");
      break;
      case "7":
      navigate("/admin/transactions");
      break;
      case "8":
        logout();
        navigate("/");
        break;
      default:
        break;
    }
  };
  return (
    <Layout style={{ minHeight: "100vh"}}>
      <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, textAlign: "left" }}>
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
        <Content className="w-full">
          <Row
            gutter={[16, 16]}
            style={{
              margin: 0,
            }}
          >
            <Col span={24}>
              <main>
                <Outlet />
              </main>
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: "center" , marginTop:"100px"}}>
          Hostel Management Flatform ©{new Date().getFullYear()} Created by Group 3
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
