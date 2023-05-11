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
import { ActiveProjectsTable } from "@/components/project-hub/active/active-projects-table";
import { CompletedProjectsTable } from "@/components/project-hub/active/completed-projects-table";

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
      <Title>Completed Projects</Title>
      <PrimaryLayout>
        <FullWidth>
          <Flex column>
            <H1>Project Hub</H1>
            <ProjectTabs />
            <H5>Completed Projects</H5>
            <CompletedProjectsTable />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
