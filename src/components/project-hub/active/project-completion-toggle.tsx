import { Flex } from "@/components/layout/flex";
import { Button } from "@/components/navigation/button";
import { P } from "@/components/text/text";
import { axiosPrivate } from "@/lib/axios";
import { Project, UserProfileData } from "@/lib/types";
import store from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const ProjectCompletionToggle = ({ project }: { project: Project }) => {
  const [otherProfile, setOtherProfile] = useState<UserProfileData>();
  const [hasApproved, setHasApproved] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [otherHasApproved, setOtherHasApproved] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const self = store?.getState()?.userData?.user?.id ?? "";
    const isClient = project.client.id == self;
    setHasApproved(
      isClient ? project.client_approval : project.contractor_approval
    );
    setOtherHasApproved(
      !isClient ? project.client_approval : project.contractor_approval
    );
    const otherUserID = isClient ? project.contractor.id : project.client.id;
    const loadProfile = async (id: string) => {
      if (id == "") return;
      return await axiosPrivate
        .get(`user/profile/by_id/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) !== false) {
            setOtherProfile(data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          return;
        });
    };
    loadProfile(otherUserID);
    if (project.status == "complete") {
      setIsComplete(true);
      setIsLoading(false);
    }
  }, [project]);

  const markComplete = () => {
    axiosPrivate
      .put(`projects/approval/${project.id}`)
      .then(() => router.reload())
      .catch(() => {});
  };

  const markIncomplete = () => {
    axiosPrivate
      .delete(`projects/approval/${project.id}`)
      .then(() => router.reload())
      .catch(() => {});
  };

  if (isLoading) return <></>;
  if (isComplete)
    return (
      <P css={{ color: "$green500", fontWeight: "$bold" }}>
        This project is complete
      </P>
    );
  if (!hasApproved)
    return (
      <Flex css={{ alignItems: "center" }}>
        {otherHasApproved && (
          <P css={{ color: "$orange500" }}>
            {otherProfile?.first_name ?? "The other user"} is awaiting your
            approval
          </P>
        )}
        <Button
          href="#"
          role="secondary"
          size={"small"}
          onClick={(e) => {
            e.preventDefault();
            markComplete();
          }}
        >
          Mark Complete
        </Button>
      </Flex>
    );

  return (
    <Flex css={{ alignItems: "center" }}>
      <P css={{ color: "$orange500" }}>
        Waiting for {otherProfile?.first_name ?? "the other user"} to approve
        this project
      </P>
      <Button
        href="#"
        role="secondary"
        size={"small"}
        onClick={(e) => {
          e.preventDefault();
          markIncomplete();
        }}
      >
        Mark Not Complete
      </Button>
    </Flex>
  );
};
