import { Title } from "@/components/head/title";
import { AdminLayout } from "@/components/layout/layouts";
import { H1, H5 } from "@/components/text/headings";
import { axiosPrivate } from "@/lib/axios";
import { Yup } from "@/lib/yup";
import { useEffect, useState } from "react";
import { FullWidth } from "@/components/layout/columns";
import { styled } from "stitches.config";
import { P } from "@/components/text/text";

export default function Stats() {
  const [userCount, setUserCount] = useState(0);
  const [dau, setDau] = useState(0);
  const [mau, setMau] = useState(0);
  const [dauOverMau, setDauOverMau] = useState(0);

  const load = async () => {
    await axiosPrivate
      .get("admin/stats/count_users")
      .then((response) => setUserCount(response.data ?? 0))
      .catch((err) => setUserCount(0));
    await axiosPrivate
      .get("admin/stats/count_active_users")
      .then((response) => {
        const { dau, mau, dauOverMau } = response.data;
        setDau(dau);
        setMau(mau);
        setDauOverMau(dauOverMau);
      })
      .catch(() => {});
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
          <H5>User Activity</H5>
          <P>DAU: {dau}</P>
          <P>MAU: {mau}</P>
          <P>DAU/MAU: {dauOverMau}</P>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
