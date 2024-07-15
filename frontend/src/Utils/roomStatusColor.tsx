export const getColorByStatus = (status: number) => {
  switch (status) {
    case 0:
      return "green";
    case 1:
      return "blue";
    case 2:
      return "orange";
    case 3:
      return "red";
    case 4:
      return "yellow";
    default:
      return "default";
  }
};

export const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "Available";
    case 1:
      return "Viewing";
    case 2:
      return "Hiring";
    case 3:
      return "Fixed";
    case 4:
      return "Hire directly";
    default:
      return "Unknown";
  }
};
