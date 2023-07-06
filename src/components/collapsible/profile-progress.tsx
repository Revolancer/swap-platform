import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "../layout/cards";
import { P } from "../text/text";
import { ProgressTraffic } from "../forms/progress-traffic";
import { Link, UnstyledLink } from "../navigation/button";
import { Flex } from "../layout/flex";
import { styled } from "stitches.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { CheckedProgressItem } from "../forms/checked-progress-item";
import { axiosPublic } from "@/lib/axios";
import store from "@/redux/store";

const Expander = styled("div", {
  borderRadius: "100%",
  borderStyle: "$solid",
  borderWidth: "$1",
  borderColor: "$neutral500",
  width: "$8",
  height: "$8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "$neutral600",
});

const CheckColumns = styled("div", {
  display: "grid",
  gap: "$4",

  "@md": {
    gridTemplateRows: "1fr 1fr 1fr",
    gridAutoFlow: "column",
  },

  "@lg": {
    gridTemplateRows: "1fr 1fr",
  },
});

export const ProfileProgress = () => {
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  //Progress Items
  const [taglineComplete, setTaglineComplete] = useState(false);
  const [aboutComplete, setAboutComplete] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [needCount, setNeedCount] = useState(0);

  const percent = useMemo(() => {
    if (loading) return 0;
    let pct = 30;
    if (taglineComplete) pct += 5;
    if (aboutComplete) pct += 5;
    pct += 10 * Math.min(postCount, 3);
    pct += 10 * Math.min(needCount, 3);
    return pct;
  }, [aboutComplete, needCount, postCount, taglineComplete, loading]);

  const uid = store?.getState()?.userData?.user?.id ?? "";

  const emoji = useMemo(() => {
    if (percent >= 100) {
      return "✅";
    }
    if (percent >= 70) {
      return "🌤️";
    }
    if (percent >= 40) {
      return "🟠";
    }
    return "🚨";
  }, [percent]);

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const loadTagline = useCallback(async () => {
    await axiosPublic
      .get(`user/tagline/${uid}`, { id: `user-tagline-${uid}` })
      .then((response) =>
        setTaglineComplete(response.data?.tagline !== "" ?? false)
      )
      .catch(() => setTaglineComplete(false));
  }, [uid]);
  const loadAbout = useCallback(async () => {
    await axiosPublic
      .get(`user/about/${uid}`, { id: `user-about-${uid}` })
      .then((response) =>
        setAboutComplete(
          response.data?.about !== "" && response.data?.about !== null
        )
      )
      .catch(() => setAboutComplete(false));
  }, [uid]);
  const loadNeeds = useCallback(async () => {
    await axiosPublic
      .get(`need/for_user/${uid}`, {
        id: `user-needs-${uid}`,
      })
      .then((response) => setNeedCount((response.data ?? []).length))
      .catch(() => setNeedCount(0));
  }, [uid]);
  const loadPosts = useCallback(async () => {
    await axiosPublic
      .get(`portfolio/for_user/${uid}`, {
        id: `user-portfolio-${uid}`,
      })
      .then((response) => setPostCount((response.data ?? []).length))
      .catch(() => setPostCount(0));
  }, [uid]);

  const loadEverything = useCallback(async () => {
    await Promise.all([loadPosts(), loadNeeds(), loadTagline(), loadAbout()]);
    setLoading(false);
  }, [loadAbout, loadNeeds, loadPosts, loadTagline, setLoading]);

  useEffect(() => {
    loadEverything();
  }, [loadEverything]);

  if (loading) return <></>;

  return (
    <Card>
      <P
        css={{ fontSize: "$body1", lineHeight: "$body1", fontWeight: "$bold" }}
      >
        {emoji} Your profile is {percent}% complete.
      </P>
      <P css={{ color: "$neutral600" }}>
        Completed profiles on Revolancer get more views, messages and requests!
        ✨
      </P>
      <ProgressTraffic progress={percent} />
      {expanded && (
        <>
          <CheckColumns>
            <CheckedProgressItem checked>Add your name</CheckedProgressItem>
            <CheckedProgressItem checked>
              Add a profile picture
            </CheckedProgressItem>
            <CheckedProgressItem checked={aboutComplete}>
              Fill in your About section
            </CheckedProgressItem>
            <CheckedProgressItem checked={taglineComplete}>
              Add a tagline
            </CheckedProgressItem>
            <CheckedProgressItem checked={postCount >= 3}>
              Add 3 Portfolio Posts ({postCount}/3)
            </CheckedProgressItem>
            <CheckedProgressItem checked={needCount >= 3}>
              Post 3 Needs ({needCount}/3)
            </CheckedProgressItem>
          </CheckColumns>
          <P css={{ color: "$neutral600" }}>
            💡 Need some help? Check out our{" "}
            <Link
              href="https://support.revolancer.com/hc/en-gb/articles/11727086964253-How-to-Complete-your-Profile"
              target="_blank"
            >
              guide
            </Link>{" "}
            on completing your profile.
          </P>
        </>
      )}
      <UnstyledLink
        href="#"
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
      >
        <Flex css={{ alignItems: "center" }}>
          <Expander>
            <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} />
          </Expander>
          <P>{expanded ? "Close" : "Open"} Checklist</P>
        </Flex>
      </UnstyledLink>
    </Card>
  );
};
