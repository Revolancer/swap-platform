import { useEffect, useState } from "react";
import { Flex } from "../layout/flex";
import { axiosPrivate } from "@/lib/axios";
import { MessageThreadSummary } from "@/lib/types";

export const ThreadList = () => {
  const [threads, setThreads] = useState<MessageThreadSummary[]>([]);

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

  return (
    <Flex column css={{ maxHeight: "85dvh" }}>
      Threads Here
    </Flex>
  );
};
