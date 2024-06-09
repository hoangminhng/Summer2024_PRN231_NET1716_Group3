interface Hostel {
  hostelID: number;
  hostelName: string;
  hostelAddress: string;
  hostelDescription: string;
  accountID: number;
  ownerName: string;
  status: number;
  numOfAvailableRoom: number;
  thumbnail: string;
  numOfTotalRoom: number;
  hostelServices: HostelService[];
}
