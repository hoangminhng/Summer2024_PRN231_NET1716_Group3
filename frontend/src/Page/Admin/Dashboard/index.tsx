import React from "react";
import { Card, Col, Row } from "antd";
import Summary from "./Summary";
import Total from "./Card";
import DemoLine from "./ProfitChart";
import PropertiesPie from "./PieChart";

const Dashboard: React.FC = () => (
  <>
    <Summary />

    <Card>
      <Card.Grid
        style={{ width: "100%", textAlign: "center", padding: 0 }}
        hoverable={false}
      >
        <Total />
      </Card.Grid>
    </Card>
    <Row>
      <Col span={16}>
        <DemoLine />
      </Col>
      <Col span={8}>
        <PropertiesPie />
      </Col>
    </Row>
  </>
);

export default Dashboard;
