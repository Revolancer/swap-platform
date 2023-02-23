import { axiosPrivate } from "@/lib/axios";
import { refreshToken } from "@/lib/user/auth";
import store, { useAppSelector } from "@/redux/store";
import Script from "next/script";
import { useState } from "react";
import { Button } from "../navigation/button";

const ChargeBeePortalButton = () => {
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
          const response = await axiosPrivate.get("chargebee/portal_session");
          console.log(response.data);
          return response.data;
        });
        (cbInstance as any).createChargebeePortal().open({
          close: async () => {
            await store?.dispatch(refreshToken());
          },
        });
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

const ChargeBeeCheckoutButton = () => {
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

  const openChargeBeeCheckout = () => {
    if (typeof window !== "undefined") {
      if (cbInstance) {
        (cbInstance as any).openCheckout({
          hostedPage: async () => {
            const response = await axiosPrivate.get(
              "chargebee/checkout_session"
            );
            console.log(response.data);
            return response.data;
          },
          success: async () => {
            await store?.dispatch(refreshToken());
          },
        });
      }
    }
  };

  return (
    <>
      <Script
        src="https://js.chargebee.com/v2/chargebee.js"
        onLoad={initChargeBee}
      />
      <Button onClick={openChargeBeeCheckout}>Manage Subscription</Button>
    </>
  );
};

export const ChargebeeButton = () => {
  const license = useAppSelector((state) => state.userData.user?.license);
  if (!license) return <ChargeBeeCheckoutButton />;
  if (license.type == "paid") return <ChargeBeePortalButton />;
  return <ChargeBeeCheckoutButton />;
};
