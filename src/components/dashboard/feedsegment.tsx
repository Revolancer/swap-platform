import { useCallback, useEffect, useState } from "react";
import { PostData } from "@/lib/types";
import { axiosPrivate } from "@/lib/axios";
import { PortfolioProfileCard } from "../portfolio/profile-card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export const FeedSegment = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  const loadPostsForUser = useCallback(async () => {
    axiosPrivate
      .get(`feed`)
      .then((response) => setPosts(response.data ?? []))
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    loadPostsForUser();
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
