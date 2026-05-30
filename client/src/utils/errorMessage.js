const SERVER_DOWN_MESSAGE =
  "Khong the ket noi server. Vui long kiem tra backend dang chay o cong 5001.";

const getErrorMessage = (error, fallbackMessage = "Co loi xay ra") => {
  if (!error) {
    return fallbackMessage;
  }

  const messageFromApi = error?.response?.data?.message;

  if (messageFromApi && typeof messageFromApi === "string") {
    return messageFromApi;
  }

  if (!error.response) {
    return SERVER_DOWN_MESSAGE;
  }

  return fallbackMessage;
};

export { SERVER_DOWN_MESSAGE, getErrorMessage };
