import { Title } from "@/components/head/title";
import { AdminLayout } from "@/components/layout/layouts";
import { H1 } from "@/components/text/headings";
import { axiosPrivate } from "@/lib/axios";
import { Yup } from "@/lib/yup";
import { useEffect, useState } from "react";
import { FullWidth } from "@/components/layout/columns";
import { styled } from "stitches.config";
import { P } from "@/components/text/text";

export default function Stats() {
  const [userCount, setUserCount] = useState(0);

  const load = async () => {
    await axiosPrivate
      .get("admin/stats/users")
      .then((response) => setUserCount(response.data ?? 0))
      .catch((err) => setUserCount(0));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Title>Stats</Title>
      <AdminLayout>
        <FullWidth>
          <H1>Stats</H1>
          <P>Total Users: {userCount}</P>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
