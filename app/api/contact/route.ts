import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const body = await request.json()
  const { listingId, listingName, listingEmail, name, email, phone, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const fromEmail = 'inquiries@9090homes.com'
  const replyTo = email

  try {
    // Email to operator
    if (listingEmail) {
      await resend.emails.send({
        from: `9090 Homes <${fromEmail}>`,
        to: [listingEmail],
        replyTo,
        subject: `New inquiry for ${listingName}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; background: #1a1a1a; color: #f0ede8; padding: 32px; border-radius: 8px;">
            <h2 style="color: #7a9e7e; margin-top: 0;">New inquiry — ${listingName}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #a09b96; font-size: 13px; width: 80px;">Name</td>
                <td style="padding: 8px 0; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a09b96; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #7a9e7e;">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding: 8px 0; color: #a09b96; font-size: 13px;">Phone</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${phone}" style="color: #7a9e7e;">${phone}</a></td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #222; border-radius: 6px; border-left: 3px solid #7a9e7e;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 20px; color: #5c5652; font-size: 12px;">
              Reply directly to this email to respond to ${name}.
            </p>
            <hr style="border: none; border-top: 1px solid #252525; margin: 20px 0;" />
            <p style="margin: 0; color: #5c5652; font-size: 11px;">
              Sent via <a href="https://9090homes.com" style="color: #7a9e7e; text-decoration: none;">9090 Homes</a>
            </p>
          </div>
        `,
      })
    }

    // Confirmation to inquirer
    await resend.emails.send({
      from: `9090 Homes <${fromEmail}>`,
      to: [email],
      subject: `Your inquiry to ${listingName}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; background: #1a1a1a; color: #f0ede8; padding: 32px; border-radius: 8px;">
          <h2 style="color: #7a9e7e; margin-top: 0;">Message sent</h2>
          <p style="color: #a09b96; font-size: 14px; line-height: 1.6;">
            Hi ${name}, your inquiry to <strong style="color: #f0ede8;">${listingName}</strong> has been sent.
            The operator will follow up with you directly.
          </p>
          <div style="margin-top: 16px; padding: 16px; background: #222; border-radius: 6px; color: #a09b96; font-size: 13px;">
            <p style="margin: 0; font-style: italic; white-space: pre-wrap;">"${message}"</p>
          </div>
          <hr style="border: none; border-top: 1px solid #252525; margin: 20px 0;" />
          <p style="margin: 0; color: #5c5652; font-size: 11px;">
            <a href="https://9090homes.com" style="color: #7a9e7e; text-decoration: none;">9090 Homes</a> — Find a home. Start your 90.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
