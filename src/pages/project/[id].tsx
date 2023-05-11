import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import { axiosPrivate } from "@/lib/axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Project } from "@/lib/types";
import { H1 } from "@/components/text/headings";
import FourOhFour from "../404";
import { validate as isValidUUID } from "uuid";
import { FullWidth } from "@/components/layout/columns";
import { Div } from "@/components/layout/utils";
import { Flex } from "@/components/layout/flex";
import { P } from "@/components/text/text";
import { ProjectCompletionToggle } from "@/components/project-hub/active/project-completion-toggle";
import { Tags } from "@/components/user-posts/tags";
import { OutputData } from "@editorjs/editorjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { Divider } from "@/components/layout/divider";
import { ProjectThread } from "@/components/messaging/project-messaging/project-thread";

export default function ProjectPage() {
  const router = useRouter();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadedData, setLoadedData] = useState<Project | undefined>(undefined);
  const [isNotFound, setNotFound] = useState(false);
  const { id } = router.query;

  useEffect(() => {
    const loadProject = async () => {
      if (id != null) {
        if (Array.isArray(id)) {
          setNotFound(true);
        } else if (!isValidUUID(id)) {
          setNotFound(true);
        } else {
          await axiosPrivate
            .get(`projects/${id}`)
            .then((response) => {
              if ((response?.data ?? null) != null) {
                if ((response?.data?.id ?? "") == "") {
                  setNotFound(true);
                }
                setLoadedData(response.data);
                setHasLoaded(true);
              }
            })
            .catch((err) => {
              setNotFound(true);
            });
        }
      }
    };
    loadProject();
  }, [id]);

  const cleanData = useMemo(() => {
    try {
      return JSON.parse(loadedData?.need?.data ?? "{}")?.version ?? false
        ? JSON.parse(loadedData?.need?.data ?? "{}")
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
  }, [loadedData]);

  const getSummary = (data: OutputData) => {
    for (const block of data.blocks) {
      if (block.type == "paragraph") {
        return block.data;
      }
    }
  };
  const summary = getSummary(cleanData);

  if (isNotFound) {
    return <FourOhFour />;
  }

  return (
    <>
      <Title>
        {hasLoaded ? loadedData?.need?.title ?? "Your Project" : "Your Project"}
      </Title>
      <PrimaryLayout>
        <FullWidth>
          <Div
            css={{
              borderWidth: "$1",
              borderStyle: "$solid",
              borderColor: "$neutral300",
              borderRadius: "$2",
              padding: "$5",
            }}
          >
            {!hasLoaded && <H1>Loading...</H1>}
            {hasLoaded && (
              <Flex column>
                <Flex css={{ justifyContent: "space-between" }}>
                  <H1 css={{ fontSize: "$body1", lineHeight: "$body1" }}>
                    {loadedData?.need?.title ?? "Untitled Project"}
                  </H1>
                  {loadedData && (
                    <ProjectCompletionToggle project={loadedData} />
                  )}
                </Flex>
                <Tags tags={loadedData?.need?.tags ?? []} />
                <P css={{ color: "$neutral600" }}>{summary}</P>
                <P css={{ color: "$neutral600" }}>
                  <strong>
                    Price: <FontAwesomeIcon icon={faTicket} />
                  </strong>{" "}
                  {loadedData?.proposal.price}
                </P>
                <Divider />
                <ProjectThread projectId={loadedData?.id ?? ""} />
              </Flex>
            )}
          </Div>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
