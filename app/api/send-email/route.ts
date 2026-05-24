import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailData {
  firstname: string;
  lastname: string;
  email: string;
  number: string;
  service: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const { EMAIL_USER, EMAIL_PASSWORD, RECEIVER_EMAIL } = process.env;

    // Check that required environment variables are configured
    if (!EMAIL_USER || !EMAIL_PASSWORD || !RECEIVER_EMAIL) {
      console.error(
        'Missing email environment variables:',
        `EMAIL_USER=${EMAIL_USER ? 'SET' : 'MISSING'}, ` +
          `EMAIL_PASSWORD=${EMAIL_PASSWORD ? 'SET' : 'MISSING'}, ` +
          `RECEIVER_EMAIL=${RECEIVER_EMAIL ? 'SET' : 'MISSING'}`,
      );
      return NextResponse.json(
        {
          message:
            'Server email configuration is incomplete. Please configure EMAIL_USER, EMAIL_PASSWORD, and RECEIVER_EMAIL in .env.local.',
        },
        { status: 500 },
      );
    }

    const body: EmailData = await req.json();
    const { firstname, lastname, number, service, subject, email, message } = body;

    // Validate required form fields
    if (!firstname || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Missing required fields: firstname, email, subject, and message are required.' },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      replyTo: email,
      to: RECEIVER_EMAIL,
      subject: `${subject} [${service || 'General inquiry'}] from ${firstname} ${lastname}`,
      text: [
        `Name: ${firstname} ${lastname}`,
        `Email: ${email}`,
        `Phone: ${number || 'Not provided'}`,
        `Service: ${service || 'Not specified'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      headers: {
        'X-Priority': '1',
        Importance: 'high',
      },
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { message: 'Failed to send email. Please try again later.' },
      { status: 500 },
    );
  }
}
