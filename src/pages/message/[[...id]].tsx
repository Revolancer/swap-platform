import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserProfileData } from "@/lib/types";
import { version as uuidVersion } from "uuid";
import { axiosPrivate } from "@/lib/axios";
import { MainContentWithSideBar, SideBar } from "@/components/layout/columns";
import { CurrentThreadAuthor } from "@/components/messaging/current-thread-author";
import { Divider } from "@/components/layout/divider";
import { Flex } from "@/components/layout/flex";
import { CurrentThread } from "@/components/messaging/current-thread";
import { ThreadList } from "@/components/messaging/thread-list";

export default function MessageCenter() {
  const router = useRouter();
  const { id } = router.query;
  const [activeThreadProfile, setActiveThreadProfile] =
    useState<UserProfileData>();
  const [activeThread, setActiveThread] = useState("");

  useEffect(() => {
    const loadProfile = async (id: string) => {
      if (id == "") return;
      await axiosPrivate
        .get(`user/profile/by_id/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) === false) {
            setActiveThread("");
          } else {
            setActiveThreadProfile(data);
          }
        })
        .catch((err) => {
          setActiveThreadProfile(undefined);
          setActiveThread("");
        });
    };
    if (typeof id !== "undefined") {
      try {
        //If url param is a valid uuid, we can try to open a thread with that user
        uuidVersion(id[0] ?? "");
        setActiveThread(id[0]);
        loadProfile(id[0] ?? "");
      } catch (err) {}
    }
  }, [id]);

  return (
    <>
      <Title>Messages</Title>
      <PrimaryLayout>
        <SideBar>
          <ThreadList />
        </SideBar>
        <MainContentWithSideBar>
          {activeThreadProfile && (
            <Flex column css={{ maxHeight: "max(400px, 85dvh)" }}>
              <CurrentThreadAuthor data={activeThreadProfile} />
              <Divider />
              <CurrentThread uid={activeThread} />
            </Flex>
          )}
        </MainContentWithSideBar>
      </PrimaryLayout>
    </>
  );
}
