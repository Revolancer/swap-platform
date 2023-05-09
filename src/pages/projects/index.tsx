import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import { FullWidth, TwoCols } from "@/components/layout/columns";
import { useEffect, useState } from "react";
import { CreditLogEntry } from "@/lib/types";
import { axiosPrivate } from "@/lib/axios";
import { P } from "@/components/text/text";
import { WalletChart } from "@/components/project-hub/wallet/wallet-chart";
import { WalletTable } from "@/components/project-hub/wallet/wallet-table";
import { H1, H5 } from "@/components/text/headings";
import { ProjectTabs } from "@/components/project-hub/tabs";
import { Flex } from "@/components/layout/flex";
import { BalanceTile } from "@/components/project-hub/wallet/balance-tile";
import { ActiveProjectsTile } from "@/components/project-hub/active-projects-tile";

export default function CreditDashboard() {
  const [logEntries, setLogEntries] = useState<CreditLogEntry[]>([]);
  useEffect(() => {
    axiosPrivate
      .get("credits/log")
      .then((res) => res.data)
      .then((data) => setLogEntries(data))
      .catch((err) => setLogEntries([]));
  }, []);

  return (
    <>
      <Title>Your Wallet</Title>
      <PrimaryLayout>
        <FullWidth>
          <Flex column>
            <H1>Project Hub</H1>
            <ProjectTabs active={1} />
            <TwoCols>
              <BalanceTile />
              <ActiveProjectsTile />
            </TwoCols>
            <H5>Transaction History</H5>
            <P css={{ color: "$neutral800" }}>
              This is an overview of your transactions
            </P>
            <WalletChart />
            <WalletTable />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
