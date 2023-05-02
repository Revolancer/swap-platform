import { axiosPrivate } from "@/lib/axios";
import { Message, UserProfileData } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { LabelledDivider } from "../layout/divider";
import { Div } from "../layout/utils";
import { MessageInput } from "./message-input";
import { DateTime } from "luxon";
import store from "@/redux/store";
import { MessageAuthor } from "./message-author";

export const CurrentThread = ({ uid }: { uid: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myProfile, setMyProfile] = useState<UserProfileData>();
  const [theirProfile, setTheirProfile] = useState<UserProfileData>();

  const loadActiveThread = useCallback(() => {
    if (uid == "") return;
    axiosPrivate
      .get(`message/${uid}`, {
        id: `mesage-threads-${uid}`,
        cache: {
          ttl: 10 * 1000,
        },
      })
      .then((res) => res.data)
      .then((data) => setMessages(data))
      .catch((err) => setMessages([]));
  }, [uid]);

  useEffect(() => {
    const loadProfiles = async () => {
      if (uid == "") return;
      const self = store?.getState()?.userData?.user?.id ?? "";
      if (self == "") return;
      await axiosPrivate
        .get(`user/profile/by_id/${uid}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) === false) {
            setTheirProfile(undefined);
          } else {
            setTheirProfile(data);
          }
        })
        .catch((err) => {
          setTheirProfile(undefined);
        });
      await axiosPrivate
        .get(`user/profile/by_id/${self}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) === false) {
            setMyProfile(undefined);
          } else {
            setMyProfile(data);
          }
        })
        .catch((err) => {
          setMyProfile(undefined);
        });
    };
    loadProfiles();
    loadActiveThread();
    const refreshActiveThread = setInterval(loadActiveThread, 20 * 1000);
    return () => {
      clearInterval(refreshActiveThread);
    };
  }, [loadActiveThread, uid]);

  const renderMessageArray = () => {
    const rendered = [];
    let lastSender = "";
    let lastTime = DateTime.fromMillis(0);
    let now = DateTime.now().toLocal();
    for (const message of messages) {
      const thisTime = DateTime.fromISO(message.created_at);
      //Divider for date
      if (lastTime.startOf("day") < thisTime.startOf("day")) {
        if (thisTime.plus({ days: 180 }) < now) {
          rendered.push(
            <LabelledDivider
              label={thisTime
                .toLocal()
                .startOf("day")
                .toFormat("cccc, LLLL d yyyy")}
              key={`divider-${message.id}`}
            />
          );
        } else {
          rendered.push(
            <LabelledDivider
              label={thisTime.toLocal().startOf("day").toFormat("cccc, LLLL d")}
              key={`divider-${message.id}`}
            />
          );
        }
      }
      //Sender chip
      if (
        lastTime.plus({ hours: 6 }) < thisTime ||
        lastSender != message.sender
      ) {
        if (theirProfile?.user?.id == message.sender) {
          rendered.push(
            <MessageAuthor
              profile={theirProfile}
              time={thisTime}
              key={`authorchip-${message.id}`}
            />
          );
        } else if (myProfile?.user?.id == message.sender) {
          rendered.push(
            <MessageAuthor
              profile={myProfile}
              time={thisTime}
              key={`authorchip-${message.id}`}
            />
          );
        }
      }

      //Actual message body
      rendered.push(
        message.body.split("\n").map(function (item, idx) {
          return (
            <span key={`${message.id}-${idx}`}>
              {item}
              <br />
            </span>
          );
        })
      );

      lastTime = thisTime;
      lastSender = message.sender;
    }
    return rendered;
  };

  return (
    <>
      <Div css={{ flexGrow: "1", overflowY: "auto" }}>
        {renderMessageArray()}
      </Div>
      <MessageInput uid={uid} refresh={loadActiveThread} />
    </>
  );
};
