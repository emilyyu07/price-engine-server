import nodemailer from "nodemailer";

//use Ethereal Email for testing emails locally
export const sendPriceDrop = async (
  email: string,
  productName: string,
  price: number
) => {
  //create a test account
  const testAccount = await nodemailer.createTestAccount();

  //create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  //email content
  const info = await transporter.sendMail({
    from: "Price Engine <alerts@priceengine.com>",
    to: email,
    subject: `Price Drop Alert: ${productName}`,
    text: `Great news! The price of ${productName} has dropped to $${price}. Don't miss out on this deal!`,
    html: `<b>Great news!</b>The price of <strong>${productName}</strong> has dropped to <strong>$${price}</strong>.<br><a href="#">View Product</a>`,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
