import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const body = await request.json()
  const { listingId, listingName, listingEmail, name, email, phone, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const replyTo = email

  // Send to operator — independent try/catch so failure doesn't block confirmation
  if (listingEmail) {
    try {
      await resend.emails.send({
        from: `Northstar Sober <${fromEmail}>`,
        to: [listingEmail],
        replyTo,
        subject: `New inquiry for ${listingName}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; color: #1a1208; padding: 32px; border-radius: 8px; border: 1px solid #e8ddc8;">
            <h2 style="color: #c97b2e; margin-top: 0; font-size: 18px;">New inquiry — ${listingName}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #9c7f52; font-size: 13px; width: 80px;">Name</td>
                <td style="padding: 8px 0; font-size: 14px; color: #1a1208;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9c7f52; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #c97b2e;">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding: 8px 0; color: #9c7f52; font-size: 13px;">Phone</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${phone}" style="color: #c97b2e;">${phone}</a></td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f5f0e8; border-radius: 6px; border-left: 3px solid #c97b2e;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1a1208; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 20px; color: #9c7f52; font-size: 12px;">
              Reply directly to this email to respond to ${name}.
            </p>
            <hr style="border: none; border-top: 1px solid #e8ddc8; margin: 20px 0;" />
            <p style="margin: 0; color: #9c7f52; font-size: 11px;">
              Sent via <a href="https://cashpaysober.com" style="color: #c97b2e; text-decoration: none;">Northstar Sober</a>
            </p>
          </div>
        `,
      })
    } catch (err) {
      console.error('[Northstar Sober] Failed to send operator inquiry email:', err)
    }
  }

  // Send confirmation to inquirer — independent try/catch
  try {
    await resend.emails.send({
      from: `Northstar Sober <${fromEmail}>`,
      to: [email],
      subject: `Your inquiry to ${listingName}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; color: #1a1208; padding: 32px; border-radius: 8px; border: 1px solid #e8ddc8;">
          <h2 style="color: #c97b2e; margin-top: 0; font-size: 18px;">Message sent</h2>
          <p style="color: #5c4a2a; font-size: 14px; line-height: 1.6;">
            Hi ${name}, your inquiry to <strong style="color: #1a1208;">${listingName}</strong> has been sent.
            The operator will follow up with you directly.
          </p>
          <div style="margin-top: 16px; padding: 16px; background: #f5f0e8; border-radius: 6px; color: #9c7f52; font-size: 13px;">
            <p style="margin: 0; font-style: italic; white-space: pre-wrap;">"${message}"</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e8ddc8; margin: 20px 0;" />
          <p style="margin: 0; color: #9c7f52; font-size: 11px;">
            <a href="https://cashpaysober.com" style="color: #c97b2e; text-decoration: none;">Northstar Sober</a> — Find your footing. Start now.
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('[Northstar Sober] Failed to send confirmation email:', err)
  }

  return NextResponse.json({ success: true })
}
