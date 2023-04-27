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
import { H1, H2, H5 } from "@/components/text/headings";
import { Title } from "@/components/head/title";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserProfileData } from "@/lib/types";
import { ProfileImage } from "@/components/user/profileimage";
import { SkillSegment } from "@/components/user/skillsegment";
import { Timezone } from "@/components/user/timezone";
import { Tagline } from "@/components/user/tagline";
import { AboutSegment } from "@/components/user/aboutsegment";

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
          <Flex column gap={3}>
            <Flex
              column
              gap={3}
              css={{
                alignItems: "center",
              }}
            >
              <ProfileImage uid={userProfile?.user?.id ?? ""} />
              <H1 style={{ fontSize: "32px" }}>
                {userProfile?.first_name
                  ? `${userProfile?.first_name} ${userProfile?.last_name}`
                  : "User Profile"}
              </H1>
            </Flex>
            <AboutSegment uid={userProfile?.user?.id ?? ""} />
            <Timezone uid={userProfile?.user?.id ?? ""} />
            <SkillSegment uid={userProfile?.user?.id ?? ""} />
          </Flex>
        </SideBar>
        <MainContentWithSideBar>
          <Tagline uid={userProfile?.user?.id ?? ""} />
          <H5>
            {userProfile?.first_name ? `${userProfile?.first_name}'s` : "My"}{" "}
            Needs
          </H5>
          <H5>
            {userProfile?.first_name ? `${userProfile?.first_name}'s` : "My"}{" "}
            Portfolio
          </H5>
        </MainContentWithSideBar>
      </PrimaryLayout>
    </>
  );
}
