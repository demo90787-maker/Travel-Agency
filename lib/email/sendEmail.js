/**
 * BUILD-SAFE Mailjet email sender for Next.js (App Router)
 * - Never imports Mailjet during `next build`
 * - Prevents Vercel build crash
 * - Works normally at runtime
 */

async function sendEmail(recipientEmails = [], subject = "", body = "") {
  // 🚫 Skip completely during build phase
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return;
  }

  // 🚫 Skip if env vars are missing
  if (
    !process.env.MAILJET_API_KEY ||
    !process.env.MAILJET_SECRET_KEY ||
    !process.env.MAILJET_SENDER_EMAIL
  ) {
    console.warn("Mailjet env vars missing — email skipped");
    return;
  }

  // ✅ Runtime-only dynamic import (CRITICAL FIX)
  const { default: Mailjet } = await import("node-mailjet");

  const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  );

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
