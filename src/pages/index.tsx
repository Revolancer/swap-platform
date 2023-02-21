import { FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import { Button } from "@/components/navigation/button";
import { AuthGuard } from "@/components/navigation/guards/authguard";
import { axiosPrivate, axiosPublic } from "@/lib/axios";

export default function Home() {
  const requestVerification = () => {
    axiosPrivate.get("mail/request_verification");
  };
  const requestPasswordResetLink = () => {
    axiosPublic.post("auth/request_reset_password", {
      email: "skye@blueskye.co.uk",
    });
  };
  return (
    <>
      <PrimaryLayout>
        <AuthGuard>
          <FullWidth>
            <Flex column gap="3">
              <Button onClick={requestVerification}>
                Request Verification email
              </Button>
              <Button onClick={requestPasswordResetLink}>
                Request Password Reset email
              </Button>
            </Flex>
          </FullWidth>
        </AuthGuard>
      </PrimaryLayout>
    </>
  );
}
