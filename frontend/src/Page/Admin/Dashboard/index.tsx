import React from "react";
import {Col, Row } from "antd";
import Summary from "./Summary";
import DemoLine from "./ProfitChart";
import PropertiesPie from "./PieChart";
import AccountLine from "./AccountChart";

const Dashboard: React.FC = () => (
  <>
  <Summary />

<Row>
  <Col span={16} >
    <DemoLine />
  </Col>
  <Col span={8}>
    <PropertiesPie />
  </Col>
  <Col span={24}>
    <AccountLine style={{height:'400px'}} />
  </Col>
</Row>
  </>
);

export default Dashboard;
