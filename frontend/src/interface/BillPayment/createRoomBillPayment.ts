interface ServiceReading {
    roomServiceID: number;
    newNumberService: number;
  }
  
  interface RoomBillPayment {
    contractId: number;
    serviceReadings: ServiceReading[];
  }
  
  interface PostData {
    roomBillPayments: RoomBillPayment[];
  }