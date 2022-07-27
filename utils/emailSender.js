import sgmail from "@sendgrid/mail";
import { config } from "dotenv";
config();

sgmail.setApiKey(process.env.SENDGRID_API);

const sendMail = async (email, subject, text, html) => {
  try {
    const msg = {
      to: email,
      from: process.env.APP_HOST_EMAIL,
      subject,
      text,
      html,
    };
    await sgmail.send(msg);
    console.log("MAIL_SENT");
  } catch (error) {
    console.log("ERROR MAILING", error.message);
    //console.log(error);
  } finally {
    return;
  }
};

export default sendMail;
