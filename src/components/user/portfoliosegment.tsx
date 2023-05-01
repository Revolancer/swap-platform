import { useCallback, useEffect, useState } from "react";
import { PostData } from "@/lib/types";
import { axiosPublic } from "@/lib/axios";
import { Div } from "../layout/utils";
import { PortfolioProfileCard } from "../portfolio/profile-card";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export const PortfolioSegment = ({
  uid = "",
  own = false,
}: {
  uid: string;
  own?: boolean;
}) => {
  const [posts, setPosts] = useState<PostData[]>([]);

  const loadPostsForUser = useCallback(async () => {
    axiosPublic
      .get(`portfolio/for_user/${uid}`, {
        id: `user-portfolio-${uid}`,
      })
      .then((response) => setPosts(response.data ?? []))
      .catch(() => setPosts([]));
  }, [uid]);

  useEffect(() => {
    if (uid != "") {
      loadPostsForUser();
    }
  }, [uid, loadPostsForUser]);
  const staticPosts = [];
  for (const post of posts) {
    staticPosts.push(
      <PortfolioProfileCard data={post} own={own} key={post?.id ?? ""} />
    );
  }
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
      <Masonry gutter="0.8rem">
        {own && <PortfolioProfileCard placeholder />}
        {staticPosts}
      </Masonry>
    </ResponsiveMasonry>
  );
};
