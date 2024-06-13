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
