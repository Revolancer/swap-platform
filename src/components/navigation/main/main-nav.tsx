import { useAppDispatch, useAppSelector } from "@/redux/store";
import { darkTheme, styled } from "stitches.config";
import { Logo } from "../../branding/logo";
import { MobileNav } from "./mobile";
import { contract, expand } from "./nav-toggle";
import { Flex } from "@/components/layout/flex";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faBriefcase,
  faChartPie,
  faCog,
  faHouse,
  faLayerGroup,
  faRightFromBracket,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { logout } from "@/lib/user/auth";
import { axiosPrivate } from "@/lib/axios";
import { UserProfileData } from "@/lib/types";
import { RoundedSquareImage } from "@/components/user/roundedsquareimage";
import { Divider } from "@/components/layout/divider";
import { SidebarMessagesIndicator } from "@/components/messaging/sidebar-messages-indicator";

const Container = styled("div", {
  backgroundColor: "$navy900",
  top: 0,
  left: 0,
  position: "sticky",
  color: "$white",
  variants: {
    expanded: {
      true: {
        "@sm": {
          width: "360px",
        },
      },
    },
  },
  zIndex: "$4",

  "@sm": {
    width: "72px",
    position: "fixed",
    transition: "width 0.2s ease-in-out",
  },

  [`.${darkTheme} &`]: {
    backgroundColor: "$black",
  },
});

const DesktopItemContainer = styled("div", {
  display: "none",

  "@sm": {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: "$5",
  },

  variants: {
    expanded: {
      true: {
        alignItems: "baseline",
      },
    },
  },
});

const NavLink = styled(Link, {
  color: "$white",
  fontSize: "$body1",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "$4",

  variants: {
    expanded: {
      false: {
        justifyContent: "center",
      },
    },
  },
});

const Navigable = ({
  icon,
  label,
  href,
  expanded,
  target = "_self",
}: {
  icon: any;
  label: string;
  href: string;
  expanded: boolean;
  target?: string;
}) => {
  return (
    <NavLink href={href} expanded={expanded} target={target}>
      <FontAwesomeIcon icon={icon} style={{ fontSize: "1.4rem" }} />{" "}
      {expanded && <span>{label}</span>}
    </NavLink>
  );
};

export const MainNav = () => {
  const expanded = useAppSelector((state) => state.navigation.toggle.expanded);
  const loggedIn = useAppSelector((state) => state.userData.user != null);
  const dispatch = useAppDispatch();
  const [didMount, setDidMount] = useState(false);
  const [ownProfile, setOwnProfile] = useState<UserProfileData>({});
  useEffect(() => {
    setDidMount(true);
    axiosPrivate
      .get("user/profile")
      .then((response) => {
        setOwnProfile(response.data);
      })
      .catch((e) => setOwnProfile({}));
  }, []);

  const navItems = (expanded: boolean) => {
    if (loggedIn && didMount) {
      return (
        <>
          <Flex
            column
            css={{
              justifyContent: "space-between",
              height: "100%",
              width: "100%",
            }}
            id="container-112"
          >
            <Flex column css={{ marginBlockStart: "$10" }} gap={4}>
              <SidebarMessagesIndicator expanded={expanded} />
              <Divider color="white" />
              <Navigable
                label="Discovery Feed"
                icon={faHouse}
                expanded={expanded}
                href="/"
              />
              <Navigable
                label="Project Hub"
                icon={faLayerGroup}
                expanded={expanded}
                href="/projects/active"
              />
              <Navigable
                label="My Needs"
                icon={faChartPie}
                expanded={expanded}
                href="/projects/needs"
              />
              <Navigable
                label="Job Board"
                icon={faBriefcase}
                expanded={expanded}
                href="https://revolancer.com/magazine/get-clients/"
                target="_blank"
              />
            </Flex>
            <Flex column gap={4}>
              <Navigable
                label="Wallet"
                icon={faWallet}
                expanded={expanded}
                href="/projects"
              />
              <Navigable
                label="Settings"
                icon={faCog}
                expanded={expanded}
                href="/settings"
              />
              <Flex
                gap={4}
                css={{ justifyContent: expanded ? "flex-start" : "center" }}
              >
                <NavLink href="/u/profile">
                  <RoundedSquareImage
                    size="small"
                    url={
                      ownProfile?.first_name ?? "" != ""
                        ? ownProfile?.profile_image
                        : ""
                    }
                  />
                  {expanded &&
                    (ownProfile?.first_name ?? "" != ""
                      ? `${ownProfile?.first_name} ${ownProfile?.last_name}`
                      : "My Profile")}
                </NavLink>
              </Flex>
              {expanded && (
                <Flex
                  gap={4}
                  css={{ justifyContent: expanded ? "flex-start" : "center" }}
                >
                  <NavLink href="#" onClick={() => dispatch(logout())}>
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      style={{ fontSize: "1.4rem" }}
                    />
                    Log Out
                  </NavLink>
                </Flex>
              )}
            </Flex>
          </Flex>
        </>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Container expanded={expanded}>
      <DesktopItemContainer
        expanded={expanded}
        id="container-111"
        onMouseEnter={(e) => {
          if (!expanded) dispatch(expand());
        }}
        onMouseLeave={(e) => {
          if (expanded) dispatch(contract());
        }}
      >
        <Flex
          css={{
            justifyContent: expanded ? "space-between" : "center",
            width: "100%",
          }}
        >
          <Link href="/" aria-label="Revolancer">
            <Logo expanded={expanded} />
          </Link>
          {expanded && (
            <FontAwesomeIcon
              icon={faAnglesLeft}
              style={{ fontSize: "1.4rem", cursor: "pointer" }}
              onClick={() => dispatch(contract())}
            />
          )}
        </Flex>
        {navItems(expanded)}
      </DesktopItemContainer>
      <MobileNav items={navItems(true)} />
    </Container>
  );
};
