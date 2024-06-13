import { useParams } from "react-router-dom";

const BillDetail: React.FC = () => {
  const { billPaymentId } = useParams<{ billPaymentId: string }>();

  return (
    <div>
      <h1>Bill detail {billPaymentId}</h1>
    </div>
  );
};

export default BillDetail;
