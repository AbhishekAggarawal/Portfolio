// pages/api/send-email.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailData {
    firstname: string;
    lastname: string;
    email: string;
    number: string;
    subject: string;
    message: string;
}

export  async function POST(req: NextRequest) {
  try {
    const { firstname, lastname , number , subject, email, message }: EmailData = await req.json();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Or another email service provider
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASSWORD, // your email password
      },
    });

    // Email options
    const mailOptions = {
      from: `${firstname} <${email}>`, // sender's email
      to: process.env.RECEIVER_EMAIL, // receiver's email address
      subject: `${subject} from ${firstname}`,
      text: message,
      headers: {
        'X-Priority': '1', // Highest priority
        'Importance': 'high' // High importance
      }
    };

    
      // Send the email
      await transporter.sendMail(mailOptions);
      
      return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
     
    }
   catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
}
}
