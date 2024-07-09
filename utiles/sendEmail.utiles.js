import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import { ApiError } from "./errorClass.js";
dotenv.config();
// Configure API key authorization: api-key
const apiKey = SibApiV3Sdk.ApiClient.instance.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // Replace with your Brevo API key

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async (to, subject, htmlContent) => {
  let isError = false;
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = to;
  sendSmtpEmail.sender = {
    email: "mohmedaref2003@gmail.com",
    name: "Social Media App",
  };
  sendSmtpEmail.subject = subject;
  // sendSmtpEmail.textContent = 'This is a test email sent using Brevo';
  sendSmtpEmail.htmlContent = htmlContent;

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

// sendEmail(
//   [{email:"mohmedwork2003@gmail.com", name:"mohamed Aref"}],
//   "Password Reset Code (valid for 5 minutes)",
//   "<html><body><h1>your reset code is 111111</h1></body></html>"
// );
