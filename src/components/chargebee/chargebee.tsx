import { axiosPrivate } from '@/lib/axios';
import { refreshToken } from '@/lib/user/auth';
import store from '@/redux/store';
import Script from 'next/script';
import { useState } from 'react';
import { Button } from '@revolancer/ui/buttons';

export const ChargeBeePortalButton = () => {
  const [cbInstance, setCbInstance] = useState(null);

  const initChargeBee = () => {
    /*
    if (typeof window !== "undefined") {
      if (!cbInstance && window.Chargebee) {
        setCbInstance(
          (window.Chargebee as any).init({
            site: process.env.NEXT_PUBLIC_CHARGEBEE_SITE,
          })
        );
      }
    }*/
  };

  const openChargeBeePortal = () => {
    if (typeof window !== 'undefined') {
      if (cbInstance) {
        (cbInstance as any).setPortalSession(async () => {
          const response = await axiosPrivate.get('chargebee/portal_session');
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
      <Button
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openChargeBeePortal();
        }}
      >
        Manage Subscription
      </Button>
    </>
  );
};
