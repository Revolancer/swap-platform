import { ChargeBeePortalButton } from "@/components/chargebee/chargebee";
import {
  FullWidth,
  MainContentWithSideBar,
  SideBar,
} from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import { Button } from "@/components/navigation/button";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { H1 } from "@/components/text/headings";
import { Title } from "@/components/head/title";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserProfileData } from "@/lib/types";
import { ProfileImage } from "@/components/user/profileimage";

export default function UserProfile() {
  const router = useRouter();
  const { slug } = router.query;
  const [userProfile, setUserProfile] = useState<UserProfileData>({});

  useEffect(() => {
    const getUserProfileData = async () => {
      if (slug != null) {
        const response = await axiosPrivate.get(`user/profile/${slug}`);
        if ((response?.data ?? null) != null) {
          setUserProfile(response.data);
        }
      }
    };
    getUserProfileData();
  }, [slug]);
  return (
    <>
      <Title>
        {userProfile?.first_name
          ? `${userProfile?.first_name} ${userProfile?.last_name}`
          : "User Profile"}
      </Title>
      <PrimaryLayout>
        <SideBar>
          <Flex
            column
            gap={3}
            css={{
              alignItems: "center",
            }}
          >
            <ProfileImage url={userProfile?.profile_image ?? ""} size="xl" />
            <H1 style={{ fontSize: "32px" }}>
              {userProfile?.first_name
                ? `${userProfile?.first_name} ${userProfile?.last_name}`
                : "User Profile"}
            </H1>
          </Flex>
        </SideBar>
        <MainContentWithSideBar></MainContentWithSideBar>
      </PrimaryLayout>
    </>
  );
}
