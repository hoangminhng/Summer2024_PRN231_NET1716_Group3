interface BillPaymentMonthlyMember {
  billPaymentID: number;
  contractId: number;
  billAmount: number;
  totalAmount: number;
  createdDate: Date;
  month: number;
  year: number;
  billPaymentStatus: number;
  roomID: number;
  roomName: string;
}
