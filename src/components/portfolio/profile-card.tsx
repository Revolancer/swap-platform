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
import { Div } from "../layout/utils";
import { Author } from "./author";
export const PortfolioProfileCard = ({
  data = {},
  own = false,
  placeholder = false,
  withAuthor = false,
}: {
  data?: PostData;
  own?: boolean;
  placeholder?: boolean;
  withAuthor?: boolean;
}) => {
  const getFirstImage = (data: OutputData) => {
    if (placeholder) return "";
    for (const block of data.blocks) {
      if (block.type == "image") {
        return block.data.file.url;
      }
    }
  };
  const firstImage = getFirstImage(JSON.parse(data?.data ?? "{}"));
  const getSummary = (data: OutputData) => {
    if (placeholder) return {};
    for (const block of data.blocks) {
      if (block.type == "paragraph") {
        return block.data;
      }
    }
  };
  const summary = getSummary(JSON.parse(data?.data ?? "{}"));

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
            <P css={{ fontWeight: "$bold" }}>{data.title}</P>
            {withAuthor && data?.user?.id && <Author uid={data.user.id} />}
            <Tags tags={data?.tags ?? []} />
            {summary && <ParagraphBlock data={summary} />}
            <Flex gap={6} css={{ alignItems: "center" }}>
              <Button href={`/p/${data?.id ?? ""}`}>Read More</Button>
              {own && (
                <TertiaryButton href={`/portfolio/${data?.id ?? ""}`}>
                  Edit
                </TertiaryButton>
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};
