import { PostData } from "@/lib/types";
import { ParagraphBlock } from "editorjs-blocks-react-renderer";
import { OutputData } from "@editorjs/editorjs";
import { P } from "../text/text";
import { Flex } from "../layout/flex";
import { Tags } from "./tags";
import { Button, TertiaryButton } from "../navigation/button";
import { Author } from "./author";
import { useMemo } from "react";
import { ProposalDialog } from "../need/proposal-dialog";
export const NeedProfileCard = ({
  data = {},
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
  const getSummary = (data: OutputData) => {
    if (placeholder) return {};
    for (const block of data.blocks) {
      if (block.type == "paragraph") {
        return block.data;
      }
    }
  };
  const summary = getSummary(cleanData);

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
      <Flex column gap={4} css={{ padding: "$6" }}>
        {placeholder ? (
          <>
            <P css={{ fontWeight: "$bold" }}>Add a need</P>
            <P>
              Do you need to outsource some work? Share your project with the
              community and get help.
            </P>
            <Button href="/need/new">Add</Button>
          </>
        ) : (
          <>
            <P css={{ fontWeight: "$bold" }}>{data.title}</P>
            {withAuthor && data?.user?.id && <Author uid={data.user.id} />}
            <Tags tags={data?.tags ?? []} />
            {summary && <ParagraphBlock data={summary} />}
            {data?.id && (
              <Flex gap={6} css={{ alignItems: "center" }}>
                <ProposalDialog id={data.id} />
                <TertiaryButton href={`/n/${data.id}`}>
                  Read More
                </TertiaryButton>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};
