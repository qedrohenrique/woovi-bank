import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import React from "react";

interface Props {
  link: string;
}

export function UserConfirmationTemplate({ link }: Props) {
  const previewText = "Confirme seu usuário na Bank";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Button
              className="bg-sky-500 rounded text-white px-5 py-3 text-[12px] font-semibold no-underline text-center"
              href={link}
            >
              Confirme agora
            </Button>
            <Text>
              {link}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}