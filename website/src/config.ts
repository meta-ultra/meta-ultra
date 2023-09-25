export default {
  MOCK_ENABLE: Boolean(process.env.REACT_APP_MOCK_ENABLE) || false,
  MOCK_DELAY_RESPONSE: Number(process.env.REACT_APP_MOCK_DELAY_RESPONSE) || 0,
  PUBLIC_URL: process.env.PUBLIC_URL || "",
  BASE_URL: process.env.REACT_APP_BASE_URL || "",
  BASE_FILE_URL: process.env.REACT_APP_BASE_FILE_URL || "",
  TOKEN: process.env.REACT_APP_TOKEN || "",
  TOKEN_USER_INFO: process.env.REACT_APP_TOKEN_USER_INFO || "token_user_info",
};
