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
import { PortfolioSegment } from "@/components/user/portfoliosegment";
import { Div } from "@/components/layout/utils";
import store from "@/redux/store";
import { NeedsSegment } from "@/components/user/needssegment";

export default function UserProfile() {
  const router = useRouter();
  const { slug } = router.query;
  const [userProfile, setUserProfile] = useState<UserProfileData>({});
  const [own, setOwn] = useState(false);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (slug === "profile") {
        setOwn(true);
        const response = await axiosPrivate.get(`user/profile`);
        if ((response?.data ?? null) != null) {
          setUserProfile(response.data);
        }
      } else if (slug != null) {
        const response = await axiosPrivate.get(`user/profile/${slug}`);
        if ((response?.data ?? null) != null) {
          setUserProfile(response.data);
          const self = store?.getState()?.userData?.user?.id ?? "guest";
          if ((userProfile?.user?.id ?? "") == self) {
            setOwn(true);
          } else {
            setOwn(false);
          }
        }
      }
    };
    getUserProfileData();
  }, [slug, userProfile?.user?.id]);
  return (
    <>
      <Title>
        {userProfile?.first_name
          ? `${userProfile?.first_name} ${userProfile?.last_name}`
          : "User Profile"}
      </Title>
      <PrimaryLayout>
        <SideBar>
          <Div
            css={{
              padding: "$6",
              borderWidth: "$1",
              borderColor: "$neutral200",
              borderRadius: "$2",
              borderStyle: "$solid",
            }}
          >
            <Flex column gap={3}>
              <Flex
                column
                gap={3}
                css={{
                  alignItems: "center",
                }}
              >
                <ProfileImage uid={userProfile?.user?.id ?? ""} own={own} />
                <H1 style={{ fontSize: "32px" }}>
                  {userProfile?.first_name
                    ? `${userProfile?.first_name} ${userProfile?.last_name}`
                    : "User Profile"}
                </H1>
              </Flex>
              <AboutSegment uid={userProfile?.user?.id ?? ""} own={own} />
              <Timezone uid={userProfile?.user?.id ?? ""} own={own} />
              <SkillSegment uid={userProfile?.user?.id ?? ""} own={own} />
            </Flex>
          </Div>
        </SideBar>
        <MainContentWithSideBar>
          <Flex column gap={8}>
            <Tagline uid={userProfile?.user?.id ?? ""} own={own} />
            <NeedsSegment
              name={userProfile?.first_name ?? ""}
              uid={userProfile?.user?.id ?? ""}
              own={own}
            />
            <PortfolioSegment
              name={userProfile?.first_name ?? ""}
              uid={userProfile?.user?.id ?? ""}
              own={own}
            />
          </Flex>
        </MainContentWithSideBar>
      </PrimaryLayout>
    </>
  );
}
