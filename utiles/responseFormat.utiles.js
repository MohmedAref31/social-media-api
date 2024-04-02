export const resFormat = (status, message,data) => {
  return {
    status: status || "sucess",
    message: message || "all thisngs are good",
    data: data || {},
  };
};
