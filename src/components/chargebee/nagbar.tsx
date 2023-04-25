import { useAppSelector } from "@/redux/store";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { NagBar } from "../layout/utils";
import { Link } from "../navigation/button";
import { P } from "../text/text";

export const TrialNagBar = () => {
  /*
  const [didMount, setDidMount] = useState(false);
  const license = useAppSelector((state) => state.userData.user?.license);
  useEffect(() => {
    setDidMount(true);
  }, []);
  if (!didMount) return <></>;
  if (!license) return <></>;
  if (license.card_status == "no_card" && license.type == "trial") {
    let trial_message = "";
    const expiry_days = DateTime.fromSeconds(license.expires).diffNow(
      "day"
    ).days;
    if (expiry_days <= 0) {
      trial_message = "Your trial has expired. ";
    } else if (expiry_days <= 1) {
      trial_message = "Your trial will expire today. ";
    } else if (expiry_days <= 2) {
      trial_message = "Your trial will expire tomorrow. ";
    } else {
      trial_message = `Your trial will expire in ${Math.floor(
        expiry_days
      )} days. `;
    }
    return (
      <NagBar>
        <P>
          {trial_message}
          <Link
            href="/settings/subscription"
            css={{ color: "$orange600", "&:hover": { color: "$orange800" } }}
          >
            <strong>Set up payment details</strong>
          </Link>{" "}
          to avoid losing access.
        </P>
      </NagBar>
    );
  }
  */
  return <></>;
};
