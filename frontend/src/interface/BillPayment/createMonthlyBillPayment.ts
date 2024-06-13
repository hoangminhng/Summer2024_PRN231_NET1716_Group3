interface CreateMonthlyBillPayment {
  contractId: number;
  billType: number;
  serviceReadings: ServiceReading[];
}

interface ServiceReading {
  roomServiceId: number;
  newNumberService: number;
}
