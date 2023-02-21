import { FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import { Button } from "@/components/navigation/button";
import { AuthGuard } from "@/components/navigation/guards/authguard";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import store, { useAppSelector } from "@/redux/store";

export default function Home() {
  const token = useAppSelector((state) => state.userData.user?.refreshToken);
  const requestVerification = () => {
    axiosPrivate.get("mail/request_verification");
  };
  const requestPasswordResetLink = () => {
    axiosPublic.post("auth/request_reset_password", {
      email: "skye@blueskye.co.uk",
    });
  };
  const checkRefreshToken = () => {
    axiosPublic.get(`auth/refresh_token_check`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  const checkToken = () => {
    axiosPrivate.get(`auth/token_check`);
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
              <Button onClick={checkRefreshToken}>Check Refresh Token</Button>
              <Button onClick={checkToken}>Check Token</Button>
            </Flex>
          </FullWidth>
        </AuthGuard>
      </PrimaryLayout>
    </>
  );
}
