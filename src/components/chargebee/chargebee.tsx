import { axiosPrivate } from "@/lib/axios";
import Script from "next/script";
import { useState } from "react";
import { Button } from "../navigation/button";

export const ChargeBeePortalButton = () => {
  const [cbInstance, setCbInstance] = useState(null);

  const initChargeBee = () => {
    if (typeof window !== "undefined") {
      if (!cbInstance && window.Chargebee) {
        setCbInstance(
          (window.Chargebee as any).init({
            site: process.env.NEXT_PUBLIC_CHARGEBEE_SITE,
          })
        );
      }
    }
  };

  const openChargeBeePortal = () => {
    if (typeof window !== "undefined") {
      if (cbInstance) {
        (cbInstance as any).setPortalSession(async () => {
          const response = await axiosPrivate.get("chargebee/session");
          console.log(response.data);
          return response.data;
        });
        (cbInstance as any).createChargebeePortal().open();
      }
    }
  };

  return (
    <>
      <Script
        src="https://js.chargebee.com/v2/chargebee.js"
        onLoad={initChargeBee}
      />
      <Button onClick={openChargeBeePortal}>Manage Subscription</Button>
    </>
  );
};
