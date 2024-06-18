interface CreateContract{
    ownerAccountID : number,
    studentAccountID : number,
    roomID : number,
    contractTerm : string,
    dateStart : Date,
    dateEnd : Date,
    roomFee : number,
    depositFee : number,
    initWater : number,
    initElec : number,
    contractMember : MemberContract[],
    roomService : number[]
}