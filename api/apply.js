// Vercel serverless function: emails a job application (with resume attached)
// to the chosen company. The recipient is looked up here from the company id,
// so the form can never be used to send mail to arbitrary addresses.
//
// Required environment variables (set in Vercel → Project → Settings → Environment Variables):
//   SMTP_USER  — the Gmail address that sends the applications (e.g. himahalal.careers@gmail.com)
//   SMTP_PASS  — a Gmail "App password" for that account (not the normal password)
// Optional:
//   SMTP_HOST / SMTP_PORT — to use a mail server other than Gmail
//   CAREERS_BCC           — an address that receives a copy of every application
import nodemailer from "nodemailer";
import { COMPANIES } from "../src/companies.js";

const MAX_FILE_BYTES = 3 * 1024 * 1024; // keeps the request under Vercel's 4.5 MB body limit
const ALLOWED = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const clean = (v, max = 200) => String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot: bots fill hidden fields

  const company = COMPANIES.find((c) => c.id === b.companyId);
  if (!company) return res.status(400).json({ error: "Unknown company." });

  const name = clean(b.name, 120);
  const email = clean(b.email, 160);
  const phone = clean(b.phone, 40);
  const position = clean(b.position, 120);
  const experience = clean(b.experience, 60);
  const message = String(b.message ?? "").trim().slice(0, 3000);

  if (!name || !position || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please fill in your name, a valid email, phone and position." });
  }

  const file = b.resume || {};
  const ext = String(file.name || "").split(".").pop().toLowerCase();
  if (!ALLOWED[ext] || typeof file.data !== "string") {
    return res.status(400).json({ error: "Please attach your resume as a PDF or Word file." });
  }
  const content = Buffer.from(file.data, "base64");
  if (content.length === 0 || content.length > MAX_FILE_BYTES) {
    return res.status(400).json({ error: "Resume must be 3 MB or smaller." });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("SMTP_USER / SMTP_PASS are not set");
    return res.status(500).json({ error: "Applications are not set up yet. Please email the company directly." });
  }

  const to = company.careersEmail || company.contact.email;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const rows = [
    ["Position", position],
    ["Full name", name],
    ["Email", email],
    ["Phone", phone],
    ["Experience", experience || "—"],
  ];
  const html = `
    <p>Dear ${esc(company.legalName)} Hiring Team,</p>
    <p>A new job application was submitted through HIMAHALAL. The resume is attached.</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      ${rows.map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${esc(v)}</strong></td></tr>`).join("")}
    </table>
    ${message ? `<p style="white-space:pre-wrap;font-family:sans-serif">${esc(message)}</p>` : ""}
    <p style="color:#888;font-size:12px">Reply to this email to contact the applicant directly.</p>`;
  const text = [
    `Dear ${company.legalName} Hiring Team,`,
    "",
    "A new job application was submitted through HIMAHALAL. The resume is attached.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: { name: "HIMAHALAL Careers", address: process.env.SMTP_USER },
      to,
      bcc: process.env.CAREERS_BCC || undefined,
      replyTo: { name, address: email },
      subject: `Job Application: ${position} — ${name}`,
      text,
      html,
      attachments: [
        { filename: `Resume - ${name.replace(/[^\w .-]/g, "")}.${ext}`, content, contentType: ALLOWED[ext] },
      ],
    });
    return res.status(200).json({ ok: true, company: company.name });
  } catch (err) {
    console.error("sendMail failed:", err);
    return res.status(502).json({ error: "We couldn't send your application. Please try again later." });
  }
}
