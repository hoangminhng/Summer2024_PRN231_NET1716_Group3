interface BillPaymentDto {
  BillPaymentID?: number;
  ContractId?: number;
  BillAmount?: number;
  Month?: number;
  Year?: number;
  CreatedDate?: Date;
  PaidDate?: Date;
  TotalAmount?: number;
  BillPaymentStatus?: number;
  BillType?: number;
  TnxRef?: string;
  // BillPaymentDetails: BillPaymentDetailResponseDto[];
}

const PaymentHistory: React.FC = () => {
  const billPayment: BillPaymentDto = {
    BillPaymentID: 123,
    ContractId: 456,
    BillAmount: 789.0,
    Month: 6,
    Year: 2024,
    CreatedDate: new Date(),
    PaidDate: new Date(),
    TotalAmount: 789.0,
    BillPaymentStatus: 1,
    BillType: 2,
    TnxRef: "TXN123456789",
  };
  return (
    <>
      <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Bill Payment Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <p>
              <strong>Bill Payment ID:</strong> {billPayment.BillPaymentID}
            </p>
            <p>
              <strong>Contract ID:</strong> {billPayment.ContractId}
            </p>
            <p>
              <strong>Bill Amount:</strong> {billPayment.BillAmount}
            </p>
            <p>
              <strong>Month:</strong> {billPayment.Month}
            </p>
            <p>
              <strong>Year:</strong> {billPayment.Year}
            </p>
          </div>
          <div className="col-span-1">
            <p>
              <strong>Created Date:</strong>{" "}
              {billPayment.CreatedDate?.toLocaleDateString()}
            </p>
            <p>
              <strong>Paid Date:</strong>{" "}
              {billPayment.PaidDate?.toLocaleDateString()}
            </p>
            <p>
              <strong>Total Amount:</strong> {billPayment.TotalAmount}
            </p>
            <p>
              <strong>Bill Payment Status:</strong>{" "}
              {billPayment.BillPaymentStatus}
            </p>
            <p>
              <strong>Bill Type:</strong> {billPayment.BillType}
            </p>
            <p>
              <strong>Transaction Reference:</strong> {billPayment.TnxRef}
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mt-4">Bill Payment Details</h3>
        
      </div>
    </>
  );
};

export default PaymentHistory;
