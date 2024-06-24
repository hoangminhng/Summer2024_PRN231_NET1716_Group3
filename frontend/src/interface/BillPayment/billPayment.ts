interface BillPaymentList {
  billPaymentDtos: BillPayment[];
}

interface BillPayment {
  billPaymentID: number;
  contractId: number;
  billAmount: number;
  month: number;
  year: number;
  createdDate: string;
  paidDate: string | null;
  totalAmount: number;
  billPaymentStatus: number;
  billType: number;
  tnxRef: string | null;
  billPaymentDetails: BillPaymentDetail[];
  roomName: string;
  renterName: string;
  roomId: number;
  startDate: string;
  endDate: string;
  isFirstBill: boolean;
}

interface BillPaymentDetail {
  billPaymentDetailID: number;
  roomServiceID: number;
  oldNumberService: number;
  newNumberService: number;
  quantity: number;
  serviceTotalAmount: number;
  servicePrice: number;
  serviceType: string;
  serviceUnit: string;
}
