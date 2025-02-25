import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key validation
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error('RESEND_API_KEY is not set in environment variables');
}

const resend = new Resend(resendApiKey);

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { bookingData } = await request.json();

    if (!bookingData) {
      console.error('No booking data provided');
      return NextResponse.json(
        { error: 'Booking data is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to send email with booking data:', {
      name: bookingData.full_name,
      email: bookingData.email,
      event: bookingData.event_type,
      date: bookingData.event_date
    });

    const { data, error } = await resend.emails.send({
      from: 'Bookceleb <booking@bookceleb.com>',
      to: ['oluwaladen@gmail.com'],
      cc: [bookingData.email],
      subject: `New Booking Request from ${bookingData.full_name}`,
      html: `
        <h2>New Booking Request Details</h2>
        <p><strong>Celebrity:</strong> ${bookingData.celebrityName}</p>
        <p><strong>Event Date:</strong> ${new Date(bookingData.event_date).toLocaleDateString()}</p>
        <p><strong>Event Type:</strong> ${bookingData.event_type}</p>
        <p><strong>Budget:</strong> ${bookingData.budget}</p>
        <p><strong>Location:</strong> ${bookingData.location}</p>
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${bookingData.full_name}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
        <p><strong>Job Title:</strong> ${bookingData.job_title}</p>
        <p><strong>Message:</strong> ${bookingData.message || 'No message provided'}</p>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: `Failed to send email: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Unexpected error in email sending:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email notification' },
      { status: 500 }
    );
  }
}