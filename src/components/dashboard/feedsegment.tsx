import { useCallback, useEffect, useState } from "react";
import { FeedPostData } from "@/lib/types";
import { axiosPrivate } from "@/lib/axios";
import { PortfolioProfileCard } from "../user-posts/portfolio-profile-card";
import { Masonry } from "masonic";
import { NeedProfileCard } from "../user-posts/need-profile-card";

const FeedEntry = ({ index, data }: { index: number; data: FeedPostData }) => {
  if (data.type == "need") {
    return (
      <NeedProfileCard data={data.data} key={data.data?.id ?? ""} withAuthor />
    );
  } else {
    return (
      <PortfolioProfileCard
        data={data.data}
        key={data.data?.id ?? ""}
        withAuthor
      />
    );
  }
};

export const FeedSegment = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([]);

  const loadPostsForUser = useCallback(async () => {
    axiosPrivate
      .get(`feed`, {
        id: "feed-data",
        cache: {
          ttl: 1000 * 60, // 1 minute.
        },
      })
      .then((response) => {
        const firstRendered = posts.length > 0 ? posts[0].data.id : "";
        const firstFetched =
          response.data.length > 0 ? response.data[0].data.id : "";
        if (firstRendered !== firstFetched) {
          setPosts(response.data ?? []);
        }
      })
      .catch(() => {
        return;
      });
  }, [posts]);

  useEffect(() => {
    const interval = setInterval(loadPostsForUser, 10 * 60 * 1000);
    loadPostsForUser();
    return () => {
      clearInterval(interval);
    };
  }, [loadPostsForUser]);

  return (
    <Masonry
      items={posts}
      render={FeedEntry}
      columnGutter={16}
      maxColumnCount={3}
      overscanBy={3}
    />
  );
};
