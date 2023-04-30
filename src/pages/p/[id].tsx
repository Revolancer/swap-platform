import { FullWidth } from "@/components/layout/columns";
import { PrimaryLayout } from "@/components/layout/layouts";
import { axiosPublic } from "@/lib/axios";
import { Title } from "@/components/head/title";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PostData } from "@/lib/types";
import Blocks, { DataProp } from "editorjs-blocks-react-renderer";
import { H1 } from "@/components/text/headings";
import { Tags } from "@/components/portfolio/tags";
import { Flex } from "@/components/layout/flex";
import { Author } from "@/components/portfolio/author";
import { styled } from "stitches.config";
import store from "@/redux/store";
import { Button } from "@/components/navigation/button";

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [postData, setPostData] = useState<PostData>({});
  const [own, setOwn] = useState(false);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (id != null) {
        const response = await axiosPublic.get(`portfolio/${id}`);
        if ((response?.data ?? null) != null) {
          setPostData(response.data);
          const self = store?.getState()?.userData?.user?.id ?? "guest";
          console.log(self, response.data?.user?.id ?? "");
          if ((response.data?.user?.id ?? "") == self) {
            setOwn(true);
          }
        }
      }
    };
    getUserProfileData();
  }, [id]);

  const StyledBlocksContainer = styled("div", {
    "& .image-block--stretched": {
      "& img": {
        width: "100%",
      },
    },
    "& figcaption": {
      color: "$neutral700",
      fontStyle: "italic",
      textAlign: "end",
    },
    "& ul": {
      marginBlock: "$3",
    },
    "& ol": {
      marginBlock: "$3",
    },
    "& p": {
      marginBlock: "$3",
    },
    "& table": {
      width: "100%",
      borderSpacing: "0",
      borderCollapse: "collapse",
      marginBlock: "$3",
    },
    "& th": {
      border: "1px solid black",
      textAlign: "center",
    },
    "& td": {
      border: "1px solid black",
      textAlign: "center",
    },
    "& pre": {
      backgroundColor: "$neutral800",
      color: "$neutral100",
      padding: "$3",
    },
    "& blockquote": {
      background: "$neutral100",
      borderLeft: "10px solid $neutral600",
      margin: "1.5em 10px",
      padding: "0.5em 10px",
      quotes: "“”‘’",
    },
    "& blockquote:before": {
      color: "$neutral800",
      content: "open-quote",
      fontSize: "4em",
      lineHeight: "0.1em",
      marginRight: "0.25em",
      verticalAlign: "-0.4em",
    },
    "& blockquote p": {
      display: "inline",
    },
  });
  console.log(own);

  return (
    <>
      <Title>{postData?.title ? postData?.title : "Portfolio Post"}</Title>
      <PrimaryLayout>
        <FullWidth>
          <Flex column gap={3} css={{ paddingBlockEnd: "$16" }}>
            <H1>{postData?.title ?? "Loading..."}</H1>
            {postData?.user && <Author uid={postData.user?.id ?? ""} />}
            {postData?.tags && <Tags tags={postData.tags} />}
            {own && (
              <Button
                role="secondary"
                href={`/portfolio/${postData?.id ?? ""}`}
              >
                Edit
              </Button>
            )}
            {postData?.data && (
              <StyledBlocksContainer>
                <Blocks data={JSON.parse(postData.data) as DataProp} />
              </StyledBlocksContainer>
            )}
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
