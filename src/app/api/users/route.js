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
      return NextResponse.json(
        {
          message: "Form saved + Email sent",
          data: savedUser, // <-- no extra comma, no + symbol
        },
        { status: 201 }
      );
    }

    const userData = new User({
      fullName,
      email,
      projectType,
      mobile,
      projectDetails,
    });

    const savedUser = await userData.save();

    // ===== Send Email =====
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "connect.rishabmahor@gmail.com",
      subject: "New Contact Entry",
      html: `
            <div style="margin:0; padding:0; background:#f4f6fb; font-family:Arial, sans-serif;">
            <table align="center" width="100%" style="max-width:600px;background:white;margin:auto;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            <tr><td style="text-align:center; padding:25px; border-bottom:1px solid #e5e9f2;">
            <img src="https://cdn-icons-png.flaticon.com/512/942/942748.png" width="65"/>
            <h2 style="font-size:22px;font-weight:bold;color:#222;margin-top:10px;">New Contact Submission</h2>
            </td></tr>
            <tr><td style="padding:35px;color:#333;">
            <p style="font-size:15px;">Hello Admin 👋,<br>A new user just submitted the contact form.</p><br>
            <strong>User Details:</strong>
            <table cellpadding="6" style="margin-top:10px;width:100%;">
            <tr><td>Name:</td><td><b>${fullName}</b></td></tr>
            <tr><td>Email:</td><td><b>${email}</b></td></tr>
            <tr><td>Project Type:</td><td><b>${projectType}</b></td></tr>
            <tr><td>Mobile:</td><td><b>${mobile}</b></td></tr>
            <tr><td>Message:</td><td><b>${projectDetails}</b></td></tr>
            </table>
            <div style="text-align:center;margin:30px;">
            <a href="#" style="background:#00b350;padding:12px 32px;color:white;border-radius:6px;text-decoration:none;font-weight:bold;">View in Dashboard</a>
            </div>
            </td></tr></table>
            </div>
            `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Form saved + Email sent", data: savedUser },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}
