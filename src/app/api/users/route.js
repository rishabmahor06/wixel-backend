import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();

    const { fullName, email, projectType, mobile, projectDetails } =
      await req.json();

    if (!fullName || !email || !projectType || !mobile || !projectDetails) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    // Save to DB
    const savedUser = await User.create({
      fullName,
      email,
      projectType,
      mobile,
      projectDetails,
    });

    // ====================== SEND EMAIL ======================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your email
        pass: process.env.GMAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "nikkocct14@gmail.com",  // Admin Email
      subject: "🚀 New Contact Submission",
      html: `
      <div style="margin:0;padding:0;background:#f2f6ff;font-family:Arial;">
      <table align="center" width="600" style="background:white;border-radius:10px;">
      <tr><td style="text-align:center;padding:20px;border-bottom:1px solid #ddd;">
      <h2>New Contact Form Submitted</h2></td></tr>

      <tr><td style="padding:20px;">
      <p><b>Name:</b> ${fullName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Project Type:</b> ${projectType}</p>
      <p><b>Mobile:</b> ${mobile}</p>
      <p><b>Details:</b> ${projectDetails}</p>
      </td></tr>

      <tr><td style="text-align:center;padding:25px;">
      <a href="#" style="background:#0070f3;color:white;padding:10px 25px;border-radius:5px;text-decoration:none;">View Dashboard</a>
      </td></tr>
      
      </table>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Email Sent Successfully");

    return NextResponse.json(
      { message: "Form Saved & Email Sent", data: savedUser },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "https://wixel-ten.vercel.app",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://wixel-ten.vercel.app",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

// CORS Preflight
export function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "https://wixel-ten.vercel.app",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
