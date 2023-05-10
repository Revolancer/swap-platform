import { P } from "../text/text";
import { Flex } from "../layout/flex";
import { Button } from "../navigation/button";
import { Author } from "../user-posts/author";
import { Proposal } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import store from "@/redux/store";
import { axiosPrivate } from "@/lib/axios";
import { useRouter } from "next/router";
import { MouseEvent } from "react";

export const ProposalCard = ({
  index,
  data,
}: {
  index: number;
  data: Proposal;
}) => {
  const router = useRouter();
  const own = (store?.getState().userData.user?.id ?? "guest") == data.user.id;

  const deleteProposal = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await axiosPrivate.delete(`need/proposal/${data.id}`).catch((err) => {});
    router.reload();
  };

  const acceptProposal = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await axiosPrivate
      .put(`projects`, { need: data.need.id, proposal: data.id })
      .then((res) => res.data)
      .then((data) => router.push(`project/${data}`))
      .catch((err) => {});
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
      <Flex column gap={4} css={{ padding: "$6" }}>
        <>
          <Author uid={data.user.id ?? ""} />
          <P css={{ fontSize: "$h5", fontWeight: "$bold" }}>
            <FontAwesomeIcon icon={faTicket} /> {data.price}
          </P>
          <P>
            {data.message.split("\n").map(function (item, idx) {
              return (
                <span key={`${data.id}-${idx}`}>
                  {item}
                  <br />
                </span>
              );
            })}
          </P>
          {own && (
            <Flex gap={6} css={{ alignItems: "center" }}>
              <Button href="#" onClick={deleteProposal}>
                Delete
              </Button>
            </Flex>
          )}
          {!own && (
            <Flex gap={6} css={{ alignItems: "center" }}>
              <Button href="#" onClick={acceptProposal}>
                Accept
              </Button>
            </Flex>
          )}
        </>
      </Flex>
    </Flex>
  );
};
