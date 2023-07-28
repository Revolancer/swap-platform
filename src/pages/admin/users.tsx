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
import { CrumbBar } from "@/components/navigation/crumbs/crumbbar";
import { Crumb } from "@/components/navigation/crumbs/crumb";

export default function Stats() {
  const [users, setUsers] = useState<{ slug: string; created_at: string }[]>(
    [],
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
      <Title>Stats</Title>
      <AdminLayout>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/users" active>
            List of Users
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <H1>All Users</H1>
          {users.map((user) => {
            return (
              <P key={user.slug}>
                <Link href={`/u/${user.slug}`} target="_blank">
                  {user.slug}
                </Link>{" "}
                ({DateTime.fromISO(user.created_at).toFormat("DDD t")})
              </P>
            );
          })}
        </FullWidth>
      </AdminLayout>
    </>
  );
}
