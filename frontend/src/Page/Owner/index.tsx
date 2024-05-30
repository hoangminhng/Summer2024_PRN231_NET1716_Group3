import React, { useContext, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
const { Sider, Header, Footer } = Layout;
import type { MenuProps } from "antd";
import { UserContext } from "../../context/userContext";

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
  const { logout } = useContext(UserContext);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const items: MenuItem[] = [
    getItem("Hostel", "1", <HomeOutlined />),
    getItem("Logout", "2", <LogoutOutlined />),
  ].filter(Boolean) as MenuItem[];

  const handleMenuClick = (key: React.Key) => {
    switch (key) {
      case "1":
        navigate("/owner/hostel");
        break;
      case "2":
        logout();
        navigate("/");
        break;
      default:
        break;
    }
  };

  return (
    <nav
      className="fixed w-full z-20 top-0 start-0"
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
