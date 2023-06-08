import { axiosPrivate } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Div } from "../layout/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { styled } from "stitches.config";
import { faBell, faMessage } from "@fortawesome/free-regular-svg-icons";

export const SidebarNotificationIndicator = ({
  expanded,
}: {
  expanded: boolean;
}) => {
  const [countUnread, setCountUnread] = useState(0);
  useEffect(() => {
    const checkUnreadNotificationCount = async () => {
      await axiosPrivate
        .get("notifications/count/unread", {
          id: "unread-notification-count",
          cache: { ttl: 30 * 1000 },
        })
        .then((res) => res.data)
        .then((data) => setCountUnread((data as number) ?? 0))
        .catch((err) => {});
    };
    checkUnreadNotificationCount();
    const timer = setInterval(checkUnreadNotificationCount, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const NotificationBadgeContainer = styled(Link, {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: expanded ? "flex-start" : "center",
    fontSize: "$body1",
    gap: "$4",
    color: "$white",
    textDecoration: "none",
  });
  return (
    <NotificationBadgeContainer href="/notifications">
      <Div
        css={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon icon={faBell} style={{ fontSize: "1.4rem" }} />
        {countUnread > 0 && (
          <Div
            css={{
              position: "absolute",
              width: "$4",
              height: "$4",
              borderRadius: "100%",
              backgroundColor: "$pink500",
              top: "-0.4rem",
              right: "-0.4rem",
            }}
          ></Div>
        )}
      </Div>
      {expanded && <span>Notifications</span>}
    </NotificationBadgeContainer>
  );
};
