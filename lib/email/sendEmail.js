import Mailjet from "node-mailjet";

function getMailjetClient() {
  if (
    !process.env.MAILJET_API_KEY ||
    !process.env.MAILJET_SECRET_KEY
  ) {
    // 🔕 During build or misconfig → do NOTHING
    return null;
  }

  return Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  );
}

async function sendEmail(recipientEmails = [], subject = "", body = "") {
  const mailjet = getMailjetClient();

  // ✅ Prevent build-time crash
  if (!mailjet) {
    console.warn("Mailjet not initialized — email skipped");
    return;
  }

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
}

export default sendEmail;
