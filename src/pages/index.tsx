import { ChargeBeePortalButton } from "@/components/chargebee/chargebee";
import { FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import { Button } from "@/components/navigation/button";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import store from "@/redux/store";
import { refreshToken } from "@/lib/user/auth";
import { H1 } from "@/components/text/headings";
import { Title } from "@/components/head/title";

export default function Home() {
  const requestVerification = () => {
    axiosPrivate.get("mail/request_verification");
  };
  const requestPasswordResetLink = () => {
    axiosPublic.post("auth/request_reset_password", {
      email: "skye@blueskye.co.uk",
    });
  };
  const refreshTheToken = () => {
    store?.dispatch(refreshToken());
  };
  return (
    <>
      <Title>Discover</Title>
      <PrimaryLayout>
        <FullWidth>
          <Flex column gap="3">
            <Button onClick={requestVerification}>
              Request Verification email
            </Button>
            <Button onClick={requestPasswordResetLink}>
              Request Password Reset email
            </Button>
            <Button onClick={refreshTheToken}>Refresh Token</Button>
            <ChargeBeePortalButton />
          </Flex>
        </FullWidth>
        <H1>Heading</H1>
      </PrimaryLayout>
    </>
  );
}
