import { useCallback, useEffect, useState } from "react";
import { PostData } from "@/lib/types";
import { axiosPublic } from "@/lib/axios";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Flex } from "../layout/flex";
import { H5 } from "../text/headings";
import { NeedProfileCard } from "../user-posts/need-profile-card";

export const ProposalsSegment = ({ uid = "" }: { uid: string }) => {
  const [posts, setPosts] = useState<PostData[]>([]);

  const loadPostsForUser = useCallback(async () => {
    axiosPublic
      .get(`proposal/for_user/${uid}`, {
        id: `user-proposals-${uid}`,
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
    staticPosts.push(<NeedProfileCard data={post} key={post?.id ?? ""} />);
  }
  return staticPosts.length > 0 ? (
    <Flex column gap={4}>
      <H5>My Proposals</H5>
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
        <Masonry gutter="0.8rem">{staticPosts}</Masonry>
      </ResponsiveMasonry>
    </Flex>
  ) : (
    <>No proposals yet buddy</>
  );
};
