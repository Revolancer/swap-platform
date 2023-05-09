import { Flex } from "@/components/layout/flex";
import { Div } from "@/components/layout/utils";
import { H5 } from "@/components/text/headings";
import { axiosPrivate } from "@/lib/axios";
import { faBarsStaggered, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { styled } from "stitches.config";

export const ActiveProjectsTile = () => {
  const [activeProjects, setActiveProjects] = useState(0);
  useEffect(() => {
    axiosPrivate
      .get("projects/count/active")
      .then((response) => {
        setActiveProjects(response.data);
      })
      .catch((e) => setActiveProjects(0));
  }, []);

  const Price = styled("span", {
    color: "$pink500",
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
      <H5>Active Projects</H5>
      <Flex css={{ alignItems: "center" }}>
        <FontAwesomeIcon icon={faBarsStaggered} />
        <Flex css={{ alignItems: "baseline" }}>
          <Price>{activeProjects}/4</Price>
        </Flex>
      </Flex>
    </Div>
  );
};
