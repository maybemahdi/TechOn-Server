import nodemailer from "nodemailer";
export const sendOrderConfirmation = async (
  email: string,
  html: string
) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.MAIL_PASS,
    },
  });
  // Set up email data
  const mailOptions = {
    from: `"no-reply"<${process.env.ADMIN_EMAIL}>`,
    to: email,
    subject: "Your ORDER Confirmation",
    text: "",
    html,
  };

  // Send mail with defined transport object
  await transporter.sendMail(mailOptions);
};
