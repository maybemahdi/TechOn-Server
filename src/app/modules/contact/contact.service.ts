import nodemailer from "nodemailer";
import SibApiV3Sdk from "sib-api-v3-sdk";
export const createContact = async (payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const companyName = "TechOn";

  // const transporter = nodemailer.createTransport({
  //   service: "gmail", // Use your email service provider
  //   auth: {
  //     user: adminEmail, // Your email address
  //     pass: process.env.APP_PASS, // Your email password
  //   },
  // });
  const html = `
      <!-- Email Card -->
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #eef6ff; text-align: center;">
  <span style="font-size: 18px; font-weight: bold; color: #2c3e50;">
    From: ${payload.email}
  </span>
</div>

<!-- Message Card -->
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
  <!-- Subject -->
  <h2 style="font-size: 20px; color: #333; margin-bottom: 15px;">
    ${payload.subject}
  </h2>

  <!-- Message -->
  <p style="font-size: 16px; color: #555; line-height: 1.5;">
    ${payload.message}
  </p>
</div>

 `;

  // Set up email data
  // const mailOptions = {
  //   from: adminEmail, // Sender address
  //   to: payload.email, // List of receivers
  //   subject: `${payload.subject}`, // Subject line
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
    sender: { email: process.env.BREVO_EMAIL, name: companyName },
    to: [{ email: payload.email }],
    subject: "Your One-Time Password (OTP)",
    htmlContent: html,
  });

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};
