import { useEffect, useState } from "react";
import { Project } from "@/lib/types";
import { axiosPrivate } from "@/lib/axios";
import { Div } from "../../layout/utils";
import { styled } from "stitches.config";
import { P } from "@/components/text/text";
import store from "@/redux/store";
import { Button } from "@/components/navigation/button";

const Table = styled("table", {
  borderCollapse: "collapse",
  overflow: "hidden",
  width: "100%",
  borderStyle: "$solid",
  borderColor: "$neutral300",
  borderWidth: "$1",
});
const THead = styled("thead", {
  backgroundColor: "$neutral300",
});
const TH = styled("th", {
  padding: "$2",
  textAlign: "start",
});
const TR = styled("tr", {});
const TD = styled("td", { padding: "$2" });

export const CompletedProjectsTable = () => {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosPrivate
      .get("projects/complete")
      .then((res) => res.data)
      .then((data) => {
        setActiveProjects(data);
        setLoading(false);
      })
      .catch((err) => setActiveProjects([]));
  }, []);

  if (loading)
    return (
      <Div
        css={{
          borderRadius: "$3",
          backgroundColor: "$neutral300",
          height: "400px",
        }}
      />
    );

  if (setActiveProjects.length < 1) return <P>No active projects</P>;

  const self = store?.getState()?.userData?.user?.id ?? "";

  return (
    <Table>
      <THead>
        <TH css={{ width: "100%" }}>Project</TH>
        <TH></TH>
      </THead>
      {activeProjects.map((project) => {
        return (
          <TR key={project.id}>
            <TD>{project.need.title ?? "Untitled Project"}</TD>
            <TD>
              <Button href={`/project/${project.id}`}>View</Button>
            </TD>
          </TR>
        );
      })}
    </Table>
  );
};
