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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { SkillSegment } from "@/components/user/skillsegment";

export default function UserProfile() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileData>({});

  useEffect(() => {
    const getUserProfileData = async () => {
      const response = await axiosPrivate.get(`user/profile`);
      if ((response?.data ?? null) != null) {
        setUserProfile(response.data);
      }
    };
    getUserProfileData();
  }, []);
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
            style={{
              alignItems: "center",
            }}
          >
            <ProfileImage uid={userProfile?.user?.id ?? ""} own />
            <H1 style={{ fontSize: "32px" }}>
              {userProfile?.first_name
                ? `${userProfile?.first_name} ${userProfile?.last_name}`
                : "User Profile"}
            </H1>
            <SkillSegment uid={userProfile?.user?.id ?? ""} own />
          </Flex>
        </SideBar>
        <MainContentWithSideBar>
          <Flex column gap={3}>
            <H2>
              Add a tagline <FontAwesomeIcon icon={faPencil} />
            </H2>
            <H5>Your Needs</H5>
            <H5>Your Portfolio</H5>
          </Flex>
        </MainContentWithSideBar>
      </PrimaryLayout>
    </>
  );
}
