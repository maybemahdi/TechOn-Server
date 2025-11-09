
import nodemailer from "nodemailer";
export const createContact = async (
    payload: {name: string, email: string,subject: string,message: string}
) => {

  const adminEmail = process.env.ADMIN_EMAIL;
  const companyName = "TechOn";

  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service provider
    auth: {
      user: adminEmail, // Your email address
      pass: process.env.MAIL_PASS, // Your email password
    },
  });

  // Set up email data
  const mailOptions = {
    from: `"no-reply"<${adminEmail}>`, // Sender address
    to: payload.email, // List of receivers
    subject: `${payload.subject}`, // Subject line
    text: "",
    html: `
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

 `, // HTML body
  };

  // Send mail with defined transport object
  await transporter.sendMail(mailOptions);
};
