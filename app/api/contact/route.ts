import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
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
        from: `9090 Homes <${fromEmail}>`,
        to: [listingEmail],
        replyTo,
        subject: `New inquiry for ${listingName}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; color: #0f1923; padding: 32px; border-radius: 8px; border: 1px solid #dee2e6;">
            <h2 style="color: #4a7fa5; margin-top: 0; font-size: 18px;">New inquiry — ${listingName}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 13px; width: 80px;">Name</td>
                <td style="padding: 8px 0; font-size: 14px; color: #0f1923;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #4a7fa5;">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding: 8px 0; color: #718096; font-size: 13px;">Phone</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${phone}" style="color: #4a7fa5;">${phone}</a></td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f1f3f5; border-radius: 6px; border-left: 3px solid #4a7fa5;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0f1923; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 20px; color: #718096; font-size: 12px;">
              Reply directly to this email to respond to ${name}.
            </p>
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;" />
            <p style="margin: 0; color: #718096; font-size: 11px;">
              Sent via <a href="https://9090homes.com" style="color: #4a7fa5; text-decoration: none;">9090 Homes</a>
            </p>
          </div>
        `,
      })
    } catch (err) {
      console.error('[9090 Homes] Failed to send operator inquiry email:', err)
    }
  }

  // Send confirmation to inquirer — independent try/catch
  try {
    await resend.emails.send({
      from: `9090 Homes <${fromEmail}>`,
      to: [email],
      subject: `Your inquiry to ${listingName}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; color: #0f1923; padding: 32px; border-radius: 8px; border: 1px solid #dee2e6;">
          <h2 style="color: #4a7fa5; margin-top: 0; font-size: 18px;">Message sent</h2>
          <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
            Hi ${name}, your inquiry to <strong style="color: #0f1923;">${listingName}</strong> has been sent.
            The operator will follow up with you directly.
          </p>
          <div style="margin-top: 16px; padding: 16px; background: #f1f3f5; border-radius: 6px; color: #718096; font-size: 13px;">
            <p style="margin: 0; font-style: italic; white-space: pre-wrap;">"${message}"</p>
          </div>
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;" />
          <p style="margin: 0; color: #718096; font-size: 11px;">
            <a href="https://9090homes.com" style="color: #4a7fa5; text-decoration: none;">9090 Homes</a> — Find a home. Start your 90.
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('[9090 Homes] Failed to send confirmation email:', err)
  }

  return NextResponse.json({ success: true })
}
