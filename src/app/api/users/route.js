import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();

    const { fullName, email, projectType, mobile, projectDetails } =
      await req.json();

    const savedUser = await User.create({
      fullName,
      email,
      projectType,
      mobile,
      projectDetails,
    });

    return NextResponse.json(
      { message: "Form saved + Email sent", data: savedUser },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "https://wixel-ten.vercel.app",  // FRONTEND URL
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://wixel-ten.vercel.app",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      }
    );
  }
}


export function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "https://wixel-ten.vercel.app",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
