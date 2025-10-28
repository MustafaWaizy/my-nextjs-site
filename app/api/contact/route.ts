// app/api/contact/route.ts
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

    const files = formData.getAll("attachments") as File[];

    // ✅ Convert files for nodemailer
    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      }))
    );

    // ✅ reCAPTCHA Verification
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error("❌ Missing RECAPTCHA_SECRET_KEY");
      return NextResponse.json(
        { success: false, message: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const recaptchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${recaptchaToken}`,
      }
    );

    const recaptchaJson = await recaptchaRes.json();
    if (!recaptchaJson.success) {
      console.error("❌ reCAPTCHA verification failed:", recaptchaJson);
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // ✅ Nodemailer transport
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    if (!gmailPassword) {
      console.error("❌ Missing GMAIL_APP_PASSWORD");
      return NextResponse.json(
        { success: false, message: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "info.lihana@gmail.com",
        pass: gmailPassword,
      },
    });

    // 📩 Prepare email
    const mailOptions = {
      from: `"Website Contact Form" <info.lihana@gmail.com>`,
      to: "info.lihana@gmail.com",
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
      attachments,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
