import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const company = formData.get("company");
    const service = formData.get("service");
    const details = formData.get("details");
    const contactMethod = formData.get("contactMethod");
    const deliveryMethod = formData.get("deliveryMethod");
    const recaptchaToken = formData.get("g-recaptcha-response") as string;

    // 🧾 Extract attached files
    const files = formData.getAll("attachments") as File[];

    // Convert files to nodemailer attachments
    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      }))
    );

    // ✅ Server-side reCAPTCHA verification
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) throw new Error("reCAPTCHA secret key is not set");

    const recaptchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${recaptchaToken}`,
      }
    );

    const recaptchaJson = await recaptchaRes.json();

    if (!recaptchaJson.success) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // ✅ Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "info.lihana@gmail.com", // your email
        pass: process.env.GMAIL_APP_PASSWORD!, // your Gmail app password
      },
    });

    // 📩 Prepare email
    const mailOptions = {
      from: `"Website Contact Form" <info.lihana@gmail.com>`,
      to: "info.lihana@gmail.com", // receiver email
      subject: `New contact form submission from ${firstName} ${lastName}`,
      text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Company: ${company}
Service: ${service}
Details: ${details}
Preferred Contact: ${contactMethod}
Delivery Method: ${deliveryMethod}
      `,
      attachments, // 🧩 now attached files will be sent
    };

    // ✅ Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
