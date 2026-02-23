import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInviteEmail = async (
  email: string,
  token: string,
  organizationName: string
) => {
  const acceptUrl = `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `You're invited to join ${organizationName}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>You’ve been invited to join ${organizationName}</h2>
        <p>
          You’ve been invited to join <strong>${organizationName}</strong>.
        </p>
        <p>
          Click the button below to accept your invitation:
        </p>
        <p>
          <a href="${acceptUrl}" 
             style="background:#000;color:#fff;padding:10px 16px;text-decoration:none;border-radius:4px;display:inline-block;">
            Accept Invitation
          </a>
        </p>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
  });
};
