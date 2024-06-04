export const getColorByStatus = (status: number) => {
  switch (status) {
    case 0:
      return "default";
    case 1:
      return "green";
    case 2:
      return "red";
    default:
      return "default";
  }
};

export const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "Prepare";
    case 1:
      return "Available";
    case 2:
      return "Block";
    default:
      return "Unknown";
  }
};
