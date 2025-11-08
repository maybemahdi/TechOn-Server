import nodemailer from "nodemailer";
export const sendOrderConfirmation = async (
  email: string,
  html: string
) => {

  const adminEmail = "mahmudhasan.hb@gmail.com";

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
    to: email, // List of receivers
    subject: "Your ORDER Confirmation", // Subject line
    // text: `Your OTP code is ${otp}` // Plain text body
    html, // HTML body
  };

  // Send mail with defined transport object
  await transporter.sendMail(mailOptions);
};
