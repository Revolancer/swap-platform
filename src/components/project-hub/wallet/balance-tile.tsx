import { Flex } from "@/components/layout/flex";
import { Div } from "@/components/layout/utils";
import { H5 } from "@/components/text/headings";
import { axiosPrivate } from "@/lib/axios";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { styled } from "stitches.config";

export const BalanceTile = () => {
  const [credits, setCredits] = useState(0);
  useEffect(() => {
    axiosPrivate
      .get("credits")
      .then((response) => {
        setCredits(response.data);
      })
      .catch((e) => setCredits(0));
  }, []);

  const Price = styled("span", {
    color: "$pink500",
    fontFamily: "$heading",
    fontWeight: "$bold",
  });
  const CreditLabel = styled("span", {
    fontSize: "$body1",
    fontFamily: "$heading",
    fontWeight: "$bold",
  });

  return (
    <Div
      css={{
        borderRadius: "$2",
        borderStyle: "$solid",
        borderWidth: "$1",
        borderColor: "$neutral400",
        fontSize: "$h2",
        paddingBlock: "$3",
        paddingInline: "$6",
        boxShadow: "$2",
      }}
    >
      <H5>Current Balance</H5>
      <Flex css={{ alignItems: "center" }}>
        <FontAwesomeIcon icon={faTicket} />
        <Flex css={{ alignItems: "baseline" }}>
          <Price>{credits}</Price>
          <CreditLabel>credits</CreditLabel>
        </Flex>
      </Flex>
    </Div>
  );
};
