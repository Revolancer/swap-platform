import { useCallback, useEffect, useState } from "react";
import { FeedPostData } from "@/lib/types";
import { axiosPrivate } from "@/lib/axios";
import { PortfolioProfileCard } from "../user-posts/portfolio-profile-card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { NeedProfileCard } from "../user-posts/need-profile-card";
import { Card } from "../layout/cards";
import { H1 } from "../text/headings";

const AddSomething = () => {
  return (
    <Card flat>
      <H1>Add Something</H1>
    </Card>
  );
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
  const staticPosts = [];
  for (const post of posts) {
    if (post.type == "need") {
      staticPosts.push(
        <NeedProfileCard
          data={post.data}
          key={post.data?.id ?? ""}
          withAuthor
        />
      );
    } else {
      staticPosts.push(
        <PortfolioProfileCard
          data={post.data}
          key={post.data?.id ?? ""}
          withAuthor
          hideIfEmpty
        />
      );
    }
  }
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 905: 2, 1440: 3 }}>
      <Masonry gutter="0.8rem">
        <AddSomething />
        {staticPosts}
      </Masonry>
    </ResponsiveMasonry>
  );
};
