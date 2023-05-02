import { axiosPrivate } from "@/lib/axios";
import { Message } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { LabelledDivider } from "../layout/divider";
import { Div } from "../layout/utils";
import { MessageInput } from "./message-input";

export const CurrentThread = ({ uid }: { uid: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);

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
    console.log("rerendered");
    loadActiveThread();
    const refreshActiveThread = setInterval(loadActiveThread, 20 * 1000);
    return () => {
      clearInterval(refreshActiveThread);
    };
  }, [loadActiveThread]);

  return (
    <>
      <Div css={{ flexGrow: "1", overflowY: "auto" }}>
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
        <LabelledDivider label="Friday, February 3rd" />
      </Div>
      <MessageInput uid={uid} refresh={loadActiveThread} />
    </>
  );
};
