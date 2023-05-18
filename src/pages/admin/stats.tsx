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
  const [wau, setWau] = useState(0);
  const [mau, setMau] = useState(0);
  const [dauOverMau, setDauOverMau] = useState(0);
  const [dauOverWau, setDauOverWau] = useState(0);
  const [wauOverMau, setWauOverMau] = useState(0);
  const [dailyPortfolios, setDailyPortfolios] = useState(0);
  const [weeklyPortfolios, setWeeklyPortfolios] = useState(0);
  const [monthlyPortfolios, setMonthlyPortfolios] = useState(0);
  const [dailyNeeds, setDailyNeeds] = useState(0);
  const [weeklyNeeds, setWeeklyNeeds] = useState(0);
  const [monthlyNeeds, setMonthlyNeeds] = useState(0);
  const [dailyProposals, setDailyProposals] = useState(0);
  const [weeklyProposals, setWeeklyProposals] = useState(0);
  const [monthlyProposals, setMonthlyProposals] = useState(0);

  const load = async () => {
    await axiosPrivate
      .get("admin/stats/count_users")
      .then((response) => setUserCount(response.data ?? 0))
      .catch((err) => setUserCount(0));
    await axiosPrivate
      .get("admin/stats/count_active_users")
      .then((response) => {
        const { dau, wau, mau, dauOverMau, dauOverWau, wauOverMau } =
          response.data;
        setDau(dau);
        setWau(wau);
        setMau(mau);
        setDauOverMau(dauOverMau);
        setDauOverWau(dauOverWau);
        setWauOverMau(wauOverMau);
      })
      .catch(() => {});
    await axiosPrivate
      .get("admin/stats/count_new_posts")
      .then((response) => {
        const {
          dailyPortfolios,
          dailyNeeds,
          dailyProposals,
          weeklyPortfolios,
          weeklyNeeds,
          weeklyProposals,
          monthlyPortfolios,
          monthlyNeeds,
          monthlyProposals,
        } = response.data;
        setDailyPortfolios(dailyPortfolios);
        setWeeklyPortfolios(weeklyPortfolios);
        setMonthlyPortfolios(monthlyPortfolios);
        setDailyNeeds(dailyNeeds);
        setWeeklyNeeds(weeklyNeeds);
        setMonthlyNeeds(monthlyNeeds);
        setDailyProposals(dailyProposals);
        setWeeklyProposals(weeklyProposals);
        setMonthlyProposals(monthlyProposals);
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
          <P>WAU: {wau}</P>
          <P>MAU: {mau}</P>
          <P>DAU/WAU: {dauOverWau}</P>
          <P>WAU/MAU: {wauOverMau}</P>
          <P>DAU/MAU: {dauOverMau}</P>
          <H5>User Content</H5>
          <P css={{ fontWeight: "$bold" }}>Daily</P>
          <P>
            Portfolios: {dailyPortfolios} (
            {(dailyPortfolios / Math.max(1, dau)).toFixed(2)} of DAU)
          </P>
          <P>
            Needs: {dailyNeeds} ({(dailyNeeds / Math.max(1, dau)).toFixed(2)} of
            DAU)
          </P>
          <P>
            Proposals: {dailyProposals} (
            {(dailyProposals / Math.max(1, dau)).toFixed(2)} of DAU)
          </P>
          <P css={{ fontWeight: "$bold" }}>Weekly</P>
          <P>
            Portfolios: {weeklyPortfolios} (
            {(weeklyPortfolios / Math.max(1, wau)).toFixed(2)} of @AU)
          </P>
          <P>
            Needs: {weeklyNeeds} ({(weeklyNeeds / Math.max(1, wau)).toFixed(2)}{" "}
            of @AU)
          </P>
          <P>
            Proposals: {weeklyProposals} (
            {(weeklyProposals / Math.max(1, wau)).toFixed(2)} of @AU)
          </P>
          <P css={{ fontWeight: "$bold" }}>Monthly</P>
          <P>
            Portfolios: {monthlyPortfolios} (
            {(monthlyPortfolios / Math.max(1, mau)).toFixed(2)} of MAU)
          </P>
          <P>
            Needs: {monthlyNeeds} (
            {(monthlyNeeds / Math.max(1, mau)).toFixed(2)} of MAU)
          </P>
          <P>
            Proposals: {monthlyProposals} (
            {(monthlyProposals / Math.max(1, mau)).toFixed(2)} of MAU)
          </P>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
