import type { APIRoute } from "astro";
import { Resend } from "resend";

// The one route that opts out of the static build. Everything else prerenders.
export const prerender = false;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  // Honeypot filled in means a bot. Return the success page so it doesn't retry.
  if (form.get("company")) {
    return redirect("/thanks", 303);
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return redirect("/contact?error=missing", 303);
  }

  // The Resend constructor throws on a missing key, which would surface as an
  // unhandled 500. Fail into the same friendly error path as a send failure.
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — cannot send contact email.");
    return redirect("/contact?error=send", 303);
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: import.meta.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
    to: import.meta.env.CONTACT_TO_EMAIL ?? "hello@boxandpixel.com",
    subject: `New message from ${name}`,
    replyTo: email,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    console.error("Resend send failed:", error);
    return redirect("/contact?error=send", 303);
  }

  return redirect("/thanks", 303);
};
