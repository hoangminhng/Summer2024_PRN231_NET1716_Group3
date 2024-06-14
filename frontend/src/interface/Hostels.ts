interface Hostel {
  hostelID: number;
  hostelName: string;
  hostelAddress: string;
  hostelDescription: string;
  accountID: number;
  ownerName: string;
  status: number;
  numOfAvailableRoom: number;
  images: string[];
  numOfTotalRoom: number;
  hostelServices: HostelService[];
  createDate: Date;
  phone: string;
  lowestPrice: number;
  lowestArea: number;
}
