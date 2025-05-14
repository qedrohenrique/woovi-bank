import { Resend } from "resend";
import { env } from "../../../../config/environment";
import { randomUUID } from "node:crypto";

type TemplateEmailProps = {
  email: string;
  link: string;
  senderName?: string;
  value?: string;
}

type SendEmailParams = {
  token: string;
  to: string;
  subject: string;
  template: (props: TemplateEmailProps) => React.ReactNode; // TODO: Add type
  linkUri?: string;
  senderName?: string;
  value?: string;
};

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async ({
  token,
  template,
  subject,
  to,
  linkUri,
  senderName,
  value,
}: SendEmailParams) => {
  const link = new URL(linkUri || "");
  link.searchParams.set("token", token);
  link.searchParams.set("redirect", ""); // TODO: Add redirect

  await resend.emails.send({
    from: "Bankinho <noreply@bankinho.br>",
    to,
    subject,
    react: template({
      email: to,
      link: link.toString(),
      senderName,
      value,
    }),
  });

  return {
    token,
  };
};