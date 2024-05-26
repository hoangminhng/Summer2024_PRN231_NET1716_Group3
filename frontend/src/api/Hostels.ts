export const GetHostelCard = () => {
  const fakeHouses: Hostel[] = [
    {
      id: 1,
      address: "Croton Loop",
      price: 9615,
      description: "2 bedroom apartment",
      imageUrl: "src/assets/Housebanner.png",
      isForRent: true,
    },
    {
      id: 2,
      address: "Irving Avenue",
      price: 6701,
      description: "1 bedroom apartment",
      imageUrl: "src/assets/Housebanner.png",
      isForRent: true,
    },
    {
      id: 3,
      address: "Suydam Place",
      price: 3913,
      description: "4 bedroom apartment",
      imageUrl: "src/assets/Housebanner.png",
      isForRent: true,
    },
    {
      id: 4,
      address: "Livingston Street",
      price: 6751,
      description: "4 bedroom apartment",
      imageUrl: "src/assets/Housebanner.png",
      isForRent: true,
    },
    {
      id: 5,
      address: "Prince Street",
      price: 9718,
      description: "4 bedroom apartment",
      imageUrl: "src/assets/Housebanner.png",
      isForRent: true,
    },
    {
      id: 6,
      address: "Lawrence Avenue",
      price: 1793,
      description: "4 bedroom apartment",
      imageUrl: "src/assets/Housebanner.png",
      isForRent: false,
    },
    {
      id: 7,
      address: "Elizabeth Place",
      price: 4413,
      description: "3 bedroom apartment",
      imageUrl: "src/assets/Housebanner.png",
      isForRent: true,
    },
  ];

  return fakeHouses;
};
