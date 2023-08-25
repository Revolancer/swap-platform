import { ChargeBeePortalButton } from '@/components/chargebee/chargebee';
//import { FullWidth } from '@/components/layout/columns';
//import { Flex } from '@/components/layout/flex';
import { PrimaryLayout } from '@/components/layout/layouts';
//import { H1, H5 } from '@/components/text/headings';
//import { P } from '@/components/text/text';
import Head from 'next/head';
import { FullWidth, Flex } from '@revolancer/ui/layout';
import { H1, H5, P } from '@revolancer/ui/text';

export default function Settings() {
  return (
    <>
      <Head>
        <title>Settings - Revolancer Beta</title>
      </Head>
      <PrimaryLayout>
        <FullWidth>
          <Flex column gap={8}>
            <H1>Settings</H1>
            <Flex column gap={4}>
              <Flex column>
                <H5>Manage Subscription</H5>
                <P>
                  To make any changes regarding your subscription or payment
                  method please click the button below
                </P>
              </Flex>
              <ChargeBeePortalButton />
            </Flex>
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
