import { Message, UserProfileData } from "@/lib/types";
import { Flex } from "../layout/flex";
import { styled } from "stitches.config";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/lib/axios";
import store from "@/redux/store";
import { P } from "../text/text";
import { Divider } from "../layout/divider";
import { DateTime } from "luxon";
import { UnstyledLink } from "../navigation/button";
import { Div } from "../layout/utils";

export const ThreadListEntry = ({
  message,
  activeThread,
}: {
  message: Message;
  activeThread: string;
}) => {
  const [threadProfile, setThreadProfile] = useState<UserProfileData>();
  const [id, setId] = useState("");

  const ProfileImageContainer = styled("div", {
    backgroundColor: "$neutral300",
    overflow: "hidden",
    width: `48px`,
    height: `48px`,
    borderRadius: "$2",
  });

  const ProfileImage = styled(Image, {
    objectFit: "cover",
  });

  useEffect(() => {
    const loadProfile = async (id: string) => {
      if (id == "") return;
      await axiosPrivate
        .get(`user/profile/by_id/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) === false) {
            setThreadProfile(undefined);
          } else {
            setThreadProfile(data);
          }
        })
        .catch((err) => {
          setThreadProfile(undefined);
        });
    };
    const self = store?.getState()?.userData?.user?.id ?? "";
    let id;
    if ((message.reciever as any as string) == self) {
      id = message.sender as any as string;
    } else {
      id = message.reciever as any as string;
    }
    loadProfile(id);
    setId(id);
  }, [message]);

  const time = DateTime.fromISO(message.created_at).toLocal();
  const now = DateTime.now().toLocal();

  let timeStr = "";
  if (!(time.startOf("day") < now.startOf("day"))) {
    timeStr = time.toFormat("t");
  } else if (time.startOf("year") < now.startOf("year")) {
    timeStr = time.toFormat("LLLL d yyyy");
  } else {
    timeStr = time.toFormat("LLLL d");
  }
  return (
    <>
      <Div
        css={{
          backgroundColor: activeThread == id ? "$neutral100" : "inherit",
          borderTopWidth: "$1",
          borderTopStyle: "$solid",
          borderTopColor: "$neutral600",
          paddingBlock: "$3",
          paddingInline: "$2",
        }}
      >
        <UnstyledLink href={`/message/${id}`}>
          <Flex>
            <ProfileImageContainer>
              {threadProfile?.profile_image && (
                <ProfileImage
                  src={threadProfile?.profile_image ?? ""}
                  height={48}
                  width={48}
                  alt={`${threadProfile?.first_name} ${threadProfile?.last_name}`}
                ></ProfileImage>
              )}
            </ProfileImageContainer>
            <Flex column css={{ flexGrow: "1" }}>
              <Flex css={{ justifyContent: "space-between" }}>
                <P
                  css={{ fontWeight: "bold" }}
                >{`${threadProfile?.first_name} ${threadProfile?.last_name}`}</P>
                <P css={{ color: "$neutral600" }}>{timeStr}</P>
              </Flex>
              <P css={{ color: "$neutral600" }}>
                {message.body.substring(0, 60).replaceAll("\n", " ")}
              </P>
            </Flex>
          </Flex>
        </UnstyledLink>
      </Div>
    </>
  );
};
