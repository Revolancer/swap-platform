import { Title } from "@/components/head/title";
import { AdminLayout } from "@/components/layout/layouts";
import { H1, H5 } from "@/components/text/headings";
import { axiosPrivate } from "@/lib/axios";
import { Yup } from "@/lib/yup";
import { useEffect, useState } from "react";
import { FullWidth } from "@/components/layout/columns";
import { styled } from "stitches.config";
import { P } from "@/components/text/text";
import { Link } from "@/components/navigation/button";
import { DateTime } from "luxon";

export default function Stats() {
  const [users, setUsers] = useState<{ slug: string; created_at: string }[]>(
    []
  );

  const load = async () => {
    await axiosPrivate
      .get("admin/users")
      .then((response) => setUsers(response.data ?? []))
      .catch((err) => {});
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Title>Admin Tools</Title>
      <AdminLayout>
        <FullWidth>
          <H1>Admin Tools</H1>
          <P>
            <Link href={`/admin/tags`}>Tags</Link>
          </P>
          <P>
            <Link href={`/admin/stats`}>Stats</Link>
          </P>
          <P>
            <Link href={`/admin/users`}>List Users</Link>
          </P>
          <P>
            <Link href={`/admin/credits`}>Add Credits</Link>
          </P>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
