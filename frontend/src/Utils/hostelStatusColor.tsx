export const getColorByStatus = (status: number) => {
  switch (status) {
    case 0:
      return "default";
    case 1:
      return "green";
    case 2:
      return "red";
    case 3:
      return "blue";
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
    case 3:
      return "Full";
    default:
      return "Unknown";
  }
};
