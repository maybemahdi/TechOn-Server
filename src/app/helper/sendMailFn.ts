// utils/sendEmail.ts
import SibApiV3Sdk from "sib-api-v3-sdk";
import { prisma } from "../../utils/prisma";


// export const sendEmailFn = async (email: string, otp: number) => {
//   const findUser = await prisma.user.findUnique({
//     where: { email },
//   });

//   const companyName = "TechOn";

//   const htmlContent = `
//     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); background-color: #ffffff; border: 1px solid #e0e0e0;">
//       <h2 style="color: #2c3e50; margin-bottom: 10px;">🔐 One-Time Password (OTP)</h2>
//       <p style="font-size: 16px; color: #555;">Hello, ${findUser?.name}</p>
//       <p style="font-size: 16px; color: #555;">Your one-time password (OTP) for verification is:</p>

//       <div style="text-align: center; margin: 30px 0;">
//         <span style="display: inline-block; font-size: 28px; font-weight: bold; color: #2c3e50; padding: 15px 30px; border: 2px dashed #3498db; border-radius: 10px; background-color: #ecf5fc;">
//           ${otp}
//         </span>
//       </div>

//       <p style="font-size: 16px; color: #555;">Please enter this code within <strong>5 minutes</strong> to complete your verification.</p>
//       <p style="font-size: 16px; color: #888; font-style: italic;">If you didn’t request this code, you can safely ignore this message.</p>

//       <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

//       <p style="font-size: 16px; color: #555;">Best regards,</p>
//       <p style="font-size: 16px; color: #3498db; font-weight: bold;">${companyName} Team</p>
//       <p style="font-size: 14px; color: #bbb; margin-top: 40px; text-align: center;">
//         This is an automated message. Please do not reply to this email.
//       </p>
//     </div>
//   `;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.ADMIN_EMAIL,
//       pass: process.env.APP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.ADMIN_EMAIL,
//     to: email,
//     subject: "Your One-Time Password (OTP)",
//     text: "",
//     html: htmlContent,
//   });
// };

// using brevo
export const sendEmailFn = async (email: string, otp: number) => {
  const findUser = await prisma.user.findUnique({
    where: { email },
  });

  const companyName = "TechOn";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); background-color: #ffffff; border: 1px solid #e0e0e0;">
      <h2 style="color: #2c3e50; margin-bottom: 10px;">🔐 One-Time Password (OTP)</h2>
      <p style="font-size: 16px; color: #555;">Hello, ${findUser?.name}</p>
      <p style="font-size: 16px; color: #555;">Your one-time password (OTP) for verification is:</p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 28px; font-weight: bold; color: #2c3e50; padding: 15px 30px; border: 2px dashed #3498db; border-radius: 10px; background-color: #ecf5fc;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 16px; color: #555;">Please enter this code within <strong>5 minutes</strong> to complete your verification.</p>
      <p style="font-size: 16px; color: #888; font-style: italic;">If you didn’t request this code, you can safely ignore this message.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

      <p style="font-size: 16px; color: #555;">Best regards,</p>
      <p style="font-size: 16px; color: #3498db; font-weight: bold;">${companyName} Team</p>
      <p style="font-size: 14px; color: #bbb; margin-top: 40px; text-align: center;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;

  // Configure Brevo API
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY!;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    sender: { email: process.env.BREVO_EMAIL, name: companyName },
    to: [{ email }],
    subject: "Your One-Time Password (OTP)",
    htmlContent,
  });

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};
