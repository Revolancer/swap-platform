import { PostData } from "@/lib/types";
import { ParagraphBlock } from "editorjs-blocks-react-renderer";
import { OutputData } from "@editorjs/editorjs";
import { P } from "../text/text";
import { Flex } from "../layout/flex";
import { Tags } from "./tags";
import { Button, TertiaryButton } from "../navigation/button";
import { styled } from "stitches.config";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { Author } from "./author";
import { useMemo } from "react";
import { ConfirmationDialog } from "../navigation/confirmation-dialog";
import { axiosPrivate } from "@/lib/axios";
import { useRouter } from "next/router";
export const PortfolioProfileCard = ({
  data,
  own = false,
  placeholder = false,
  withAuthor = false,
}: {
  data?: PostData;
  own?: boolean;
  placeholder?: boolean;
  withAuthor?: boolean;
}) => {
  const cleanData = useMemo(() => {
    try {
      return JSON.parse(data?.data ?? "{}")?.version ?? false
        ? JSON.parse(data?.data ?? "{}")
        : {
            time: 1682956618189,
            blocks: [],
            version: "2.26.5",
          };
    } catch (err) {
      return {
        time: 1682956618189,
        blocks: [],
        version: "2.26.5",
      };
    }
  }, [data]);
  const getFirstImage = (data: OutputData) => {
    if (placeholder) return "";
    for (const block of data.blocks) {
      if (block.type == "image") {
        return block.data.file.url;
      }
    }
  };
  const firstImage = getFirstImage(cleanData);
  const getSummary = (data: OutputData) => {
    if (placeholder) return {};
    for (const block of data.blocks) {
      if (block.type == "paragraph") {
        return block.data;
      }
    }
  };
  const summary = getSummary(cleanData);

  const PostImageContainer = styled("div", {
    backgroundColor: "$neutral300",
    overflow: "hidden",
    width: `100%`,
    height: `200px`,
  });

  const PostImage = styled(Image, {
    objectFit: "cover",
    width: "100%",
  });

  const router = useRouter();

  const deletePost = async () => {
    if (data) {
      await axiosPrivate.delete(`portfolio/${data.id}`).catch((err) => {});
    }
    router.reload();
  };

  return (
    <Flex
      column
      css={{
        borderColor: "$neutral200",
        borderStyle: "$solid",
        borderWidth: "$1",
        borderRadius: "$2",
        overflow: "hidden",
      }}
    >
      {(placeholder || firstImage) && (
        <PostImageContainer>
          {placeholder && (
            <Flex
              css={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "$h1",
                color: "$neutral600",
              }}
            >
              <FontAwesomeIcon icon={faImage} />
            </Flex>
          )}
          {firstImage && (
            <PostImage
              src={firstImage}
              alt="Cover Image for this post"
              width={360}
              height={200}
            />
          )}
        </PostImageContainer>
      )}
      <Flex column gap={4} css={{ padding: "$6" }}>
        {placeholder ? (
          <>
            <P css={{ fontWeight: "$bold" }}>Add an example of your work</P>
            <P>Describe a past project you want to show off.</P>
            <Button href="/portfolio/new">Add portfolio post</Button>
          </>
        ) : (
          <>
            <P css={{ fontWeight: "$bold" }}>{data?.title}</P>
            {withAuthor && data?.user?.id && <Author uid={data.user.id} />}
            <Tags tags={data?.tags ?? []} />
            {summary && <ParagraphBlock data={summary} />}
            <Flex gap={6} css={{ alignItems: "center" }}>
              {data?.id && <Button href={`/p/${data.id}`}>Read More</Button>}
              {own && data?.id && (
                <>
                  <ConfirmationDialog
                    dangerous
                    onAccept={deletePost}
                    label="Delete"
                    title="Deleting Portfolio Article"
                    labelAccept="Delete"
                  />
                  <TertiaryButton href={`/portfolio/${data.id}`}>
                    Edit
                  </TertiaryButton>
                </>
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};
