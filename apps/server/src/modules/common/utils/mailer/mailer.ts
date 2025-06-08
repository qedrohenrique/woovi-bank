import { Resend } from "resend";
import { env } from "../../../../config/environment";

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

  const {data, error} = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject,
    react: template({
      email: to,
      link: link.toString(),
      senderName,
      value,
    }),
  });

  console.log(data, error)

  return {
    token,
  };
};