import { FullWidth } from "@/components/layout/columns";
import { PrimaryLayout } from "@/components/layout/layouts";
import { axiosPublic } from "@/lib/axios";
import { Title } from "@/components/head/title";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { PostData } from "@/lib/types";
import Blocks from "editorjs-blocks-react-renderer";
import { H1, H3 } from "@/components/text/headings";
import { Tags } from "@/components/user-posts/tags";
import { Flex } from "@/components/layout/flex";
import { Author } from "@/components/user-posts/author";
import store from "@/redux/store";
import FourOhFour from "../404";
import { P } from "@/components/text/text";
import { DateTime } from "luxon";
import { NeedDialog } from "@/components/need/need-dialog";
import {
  StyledBlocksContainer,
  cleanBlockData,
} from "@/components/user-posts/styledblockscontainer";

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [postData, setPostData] = useState<PostData>({});
  const [own, setOwn] = useState(false);
  const [isNotFound, setNotFound] = useState(false);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (id != null) {
        await axiosPublic
          .get(`need/${id}`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.id ?? "") == "") {
                setNotFound(true);
              }
              setPostData(response.data);
              const self = store?.getState()?.userData?.user?.id ?? "guest";
              if ((response.data?.user?.id ?? "") == self) {
                setOwn(true);
              }
            }
          })
          .catch((err) => setNotFound(true));
      }
    };
    getUserProfileData();
  }, [id]);

  if (isNotFound) {
    return <FourOhFour />;
  }

  return (
    <>
      <Title>{postData?.title ? postData?.title : "Need"}</Title>
      <PrimaryLayout>
        <FullWidth>
          <Flex column gap={3}>
            {postData?.title && <H3>I Need...</H3>}
            <H1>{postData?.title ?? "Loading..."}</H1>
            {postData?.user && <Author uid={postData.user?.id ?? ""} />}
            {postData?.tags && <Tags tags={postData.tags} />}
            {postData?.unpublish_at && (
              <P css={{ color: "$neutral600" }}>
                Respond by{" "}
                {DateTime.fromISO(postData.unpublish_at).toFormat(
                  "cccc, LLLL d"
                )}
              </P>
            )}
            {postData?.id && <NeedDialog id={postData.id} />}
            {postData?.data && (
              <StyledBlocksContainer>
                <Blocks data={cleanBlockData(postData.data)} />
              </StyledBlocksContainer>
            )}
            {own && <P css={{ color: "$neutral600" }}></P>}
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
