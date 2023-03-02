import { Flex } from "@/components/layout/flex";
import { OnboardingLayout } from "@/components/layout/layouts";
import { H4 } from "@/components/text/headings";
import { Title } from "@/components/head/title";
import { Card } from "@/components/layout/cards";
import Image from "next/image";
import { Div } from "@/components/layout/utils";
import { Progress } from "@/components/forms/progress";
import { Yup } from "@/lib/yup";

const OnboardingSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Please provide a valid email address"),
  firstName: Yup.string()
    .required("Please provide your first name")
    .ensure()
    .min(2, "Please provide your first name")
    .max(35, "Your first name may not be longer than 35 characters"),
  lastName: Yup.string()
    .required("Please provide your surname")
    .ensure()
    .min(2, "Please provide your surname")
    .max(35, "Your surname may not be longer than 35 characters"),
  dateOfBirth: Yup.string().test(
    "DOB",
    "You must be at least 13 years old to use Revolancer",
    (value) => {
      console.log(value);
      return true;
    }
  ),
});

export default function GetStarted() {
  return (
    <>
      <Title>Get Started</Title>
      <OnboardingLayout>
        <Card
          css={{
            gridColumn: "1 / 5",
            "@sm": { gridColumn: "1 / 9" },
            "@md": { gridColumn: "2 / 12" },
            "@xl": { gridColumn: "3 / 11" },
            gap: "$7",
            padding: "$7",
          }}
        >
          <Flex gap={7}>
            <Div
              css={{
                height: "100%",
                minHeight: "600px",
                display: "none",
                width: "0",
                position: "relative",
                borderRadius: "$2",
                overflow: "hidden",
                "@md": { display: "block", width: "168px" },
              }}
            >
              <Image
                fill
                style={{ objectFit: "cover" }}
                alt=""
                src="/img/onboarding/onboarding1.jpg"
              />
            </Div>
            <Flex column css={{ flexGrow: "1" }}>
              <Progress />
              <H4>Personal information</H4>
            </Flex>
          </Flex>
        </Card>
      </OnboardingLayout>
    </>
  );
}
