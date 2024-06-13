interface ContractDetail{
    contractID : number,
    hostelName : string,
    hostelAddress : string,
    roomName : string,
    roomFee : number,
    roomDescription : string,
    depositFee : number,
    studentLeadAccountName : string,
    studentLeadPhone : string,
    studentLeadCitizen : string,
    ownerAccountName : string,
    ownerPhone : string,
    ownerCitizen : string,
    contractTerm : string,
    createdDate : Date,
    dateSign : Date,
    dateStart : Date,
    dateEnd : Date,
    memberContract : MemberContract[],
    service : ServiceRoomContract[],
    status : number
}