import nodemailer from "nodemailer";
import SibApiV3Sdk from "sib-api-v3-sdk";
export const sendOrderConfirmation = async (email: string, html: string) => {
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.ADMIN_EMAIL,
  //     pass: process.env.APP_PASS,
  //   },
  // });
  // Set up email data
  // const mailOptions = {
  //   from: process.env.ADMIN_EMAIL,
  //   to: email,
  //   subject: "Your ORDER Confirmation",
  //   text: "",
  //   html,
  // };

  // Send mail with defined transport object
  // await transporter.sendMail(mailOptions);

  // Configure Brevo API
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY!;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    sender: { email: process.env.BREVO_EMAIL, name: "TechOn" },
    to: [{ email }],
    subject: "Your One-Time Password (OTP)",
    htmlContent: html,
  });
  await apiInstance.sendTransacEmail(sendSmtpEmail);
};
