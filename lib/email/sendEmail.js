import Mailjet from "node-mailjet";

function getMailjetClient() {
  if (
    !process.env.MAILJET_API_KEY ||
    !process.env.MAILJET_SECRET_KEY
  ) {
    throw new Error("Mailjet credentials missing");
  }

  return Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  );
}

/**
 * @param {Array} recipientEmails array of objects
 * @param {String} subject
 * @param {String} body
 */
async function sendEmail(recipientEmails = [], subject = "", body = "") {
  const mailjet = getMailjetClient();

  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: "Golobe Travel Agency",
          },
          To: recipientEmails,
          Subject: subject,
          HTMLPart: body,
        },
      ],
    });
  } catch (error) {
    console.error("Mailjet error:", error);
    throw error;
  }
}

export default sendEmail;
