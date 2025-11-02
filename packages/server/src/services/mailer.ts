import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendWelcomeEmail(to: string, userId: string) {
  const { data, error } = await resend.emails.send({
    from: "sandbox@resend.dev",
    to: to,
    subject: "Bienvenue sur MatchMyPet !",
    html: `
      <p>Bonjour,</p>
      <p>Merci de vous être inscrit sur notre application. (ID utilisateur : ${userId})</p>
      <p>Cordialement,<br/>L’équipe MatchMyPet</p>
    `,
  });

  if (error) {
    console.error("Erreur envoi email Resend :", error);
  } else {
    console.log("Email envoyé via Resend :", data);
  }
}
