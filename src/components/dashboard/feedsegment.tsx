import { useCallback, useEffect, useState } from "react";
import { PostData } from "@/lib/types";
import { axiosPrivate } from "@/lib/axios";
import { PortfolioProfileCard } from "../user-posts/portfolio-profile-card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export const FeedSegment = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  const loadPostsForUser = useCallback(async () => {
    axiosPrivate
      .get(`feed`, {
        id: "feed-data",
        cache: {
          ttl: 1000 * 60, // 1 minute.
        },
      })
      .then((response) => {
        const firstRendered = posts.length > 0 ? posts[0].id : "";
        const firstFetched =
          response.data.length > 0 ? response.data[0].id : "";
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
    staticPosts.push(
      <PortfolioProfileCard data={post} key={post?.id ?? ""} withAuthor />
    );
  }
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 905: 2, 1440: 3 }}>
      <Masonry gutter="0.8rem">{staticPosts}</Masonry>
    </ResponsiveMasonry>
  );
};
