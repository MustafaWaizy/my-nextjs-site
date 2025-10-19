import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let mobile = "";
    let services: string[] = [];
    let customService = "";
    let vision = "";
    let budget = "";
    let customBudget = "";
    let timeline = "";
    let customTimeline = "";
    let recaptchaToken = "";
    let attachments: any[] = [];

    // ✅ Handle multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name") as string;
      email = formData.get("email") as string;
      mobile = formData.get("mobile") as string;
      services = formData.getAll("services") as string[];
      customService = (formData.get("customService") as string) || "";
      vision = (formData.get("vision") as string) || "";
      budget = (formData.get("budget") as string) || "";
      customBudget = (formData.get("customBudget") as string) || "";
      timeline = (formData.get("timeline") as string) || "";
      customTimeline = (formData.get("customTimeline") as string) || "";
      recaptchaToken = (formData.get("g-recaptcha-response") as string) || "";

      const files = formData.getAll("attachments") as File[];
      attachments = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
        }))
      );
    }

    // ✅ Handle application/json
    else if (contentType.includes("application/json")) {
      const body = await req.json();
      name = body.name;
      email = body.email;
      mobile = body.mobile;
      services = body.services || [];
      customService = body.customService || "";
      vision = body.vision || "";
      budget = body.budget || "";
      customBudget = body.customBudget || "";
      timeline = body.timeline || "";
      customTimeline = body.customTimeline || "";
      recaptchaToken = body.recaptchaToken || "";

      if (body.attachments && Array.isArray(body.attachments)) {
        attachments = body.attachments.map((file: any) => ({
          filename: file.name,
          content: Buffer.from(file.data, "base64"),
        }));
      }
    }

    // 🧠 Validate reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA token missing" },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) throw new Error("reCAPTCHA secret key is not set");

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
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // ✉️ Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "info.lihana@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD!,
      },
    });

    // 📩 Email content
    const mailOptions = {
      from: `"Request a Quote Form" <info.lihana@gmail.com>`,
      to: "info.lihana@gmail.com",
      subject: `New Request a Quote from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Mobile: ${mobile}
Services: ${services.join(", ")} ${services.includes("Other") ? `(${customService})` : ""}
Project Vision: ${vision}
Budget: ${budget === "Other" ? customBudget : budget}
Timeline: ${timeline === "Other" ? customTimeline : timeline}
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
