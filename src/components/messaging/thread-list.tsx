import { useEffect, useState } from "react";
import { Flex } from "../layout/flex";
import { axiosPrivate } from "@/lib/axios";
import { Message } from "@/lib/types";
import { ThreadListEntry } from "./thread-list-entry";

export const ThreadList = ({ activeThread }: { activeThread: string }) => {
  const [threads, setThreads] = useState<Message[]>([]);

  useEffect(() => {
    const loadThreads = async () => {
      axiosPrivate
        .get("message", {
          id: `message-threads`,
          cache: {
            ttl: 60 * 1000,
          },
        })
        .then((res) => res.data)
        .then((data) => setThreads(data))
        .catch((err) => setThreads([]));
    };
    loadThreads();
    const refreshThreads = setInterval(loadThreads, 5 * 60 * 1000);
    return () => {
      clearInterval(refreshThreads);
    };
  }, []);

  const displayThreads = () => {
    const rendered = [];
    for (const thread of threads) {
      rendered.push(
        <ThreadListEntry
          message={thread}
          key={thread.id}
          activeThread={activeThread}
        />
      );
    }
    return rendered;
  };

  return (
    <Flex column css={{ maxHeight: "85dvh" }} gap={0}>
      {displayThreads()}
    </Flex>
  );
};
