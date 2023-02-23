import { ChargebeeButton } from "@/components/chargebee/chargebee";
import { FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import { Button } from "@/components/navigation/button";
import { AuthGuard } from "@/components/navigation/guards/authguard";
import Head from "next/head";

export default function Settings() {
  return (
    <>
      <Head>
        <title>Settings - Revolancer Beta</title>
      </Head>
      <PrimaryLayout></PrimaryLayout>
    </>
  );
}
