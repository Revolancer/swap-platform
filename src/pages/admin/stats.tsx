import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { Link } from '@revolancer/ui/buttons';
import { H1, H5, P } from '@revolancer/ui/text';
import { FullWidth } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

export default function Stats() {
  const [userCount, setUserCount] = useState(0);
  const [userCountAllTime, setUserCountAllTime] = useState(0);
  const [userCountDeleted, setUserCountDeleted] = useState(0);
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
  const [dailyNewUsers, setDailyNewUsers] = useState(0);
  const [weeklyNewUsers, setWeeklyNewUsers] = useState(0);
  const [monthlyNewUsers, setMonthlyNewUsers] = useState(0);
  const [dailyProjects, setDailyProjects] = useState(0);
  const [weeklyProjects, setWeeklyProjects] = useState(0);
  const [monthlyProjects, setMonthlyProjects] = useState(0);
  const [referrers, setReferrers] =
    useState<{ referrer: string; count: number }[]>();

  const load = async () => {
    await axiosPrivate
      .get('admin/stats/count_users')
      .then((response) => {
        const { count, deleted, allTime } = response.data;
        setUserCount(count);
        setUserCountAllTime(allTime);
        setUserCountDeleted(deleted);
      })
      .catch((err) => {});
    await axiosPrivate
      .get('admin/stats/count_active_users')
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
      .get('admin/stats/count_new_posts')
      .then((response) => {
        const {
          dailyPortfolios,
          dailyNeeds,
          dailyProposals,
          dailyProjects,
          weeklyPortfolios,
          weeklyNeeds,
          weeklyProposals,
          weeklyProjects,
          monthlyPortfolios,
          monthlyNeeds,
          monthlyProposals,
          monthlyProjects,
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
        setDailyProjects(dailyProjects);
        setWeeklyProjects(weeklyProjects);
        setMonthlyProjects(monthlyProjects);
      })
      .catch(() => {});
    await axiosPrivate
      .get('admin/stats/count_new_users')
      .then((response) => {
        const { daily, weekly, monthly } = response.data;
        setDailyNewUsers(daily);
        setWeeklyNewUsers(weekly);
        setMonthlyNewUsers(monthly);
      })
      .catch(() => {});
    await axiosPrivate
      .get('admin/stats/referrers')
      .then((response) => {
        setReferrers(response.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Title>Stats</Title>
      <AdminLayout roles={['admin', 'moderator', 'stats_viewer']}>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/stats" active>
            Stats
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <H1>Stats</H1>
          <P>
            <Link href={`/admin/stats/top-profile-skills`}>
              Top Skills by Number of Profiles
            </Link>
          </P>
          <P>
            <Link href={`/admin/stats/top-referrers`}>Top Referrers</Link>
          </P>
          <P>Total Users: {userCount}</P>
          <H5>User Activity</H5>
          <P>DAU: {dau}</P>
          <P>WAU: {wau}</P>
          <P>MAU: {mau}</P>
          <P>DAU/WAU: {dauOverWau}</P>
          <P>WAU/MAU: {wauOverMau}</P>
          <P>DAU/MAU: {dauOverMau}</P>
          <H5>User Content</H5>
          <P css={{ fontWeight: '$bold' }}>Daily</P>
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
          <P>
            Projects: {dailyProjects} (
            {(dailyProjects / Math.max(1, dau)).toFixed(2)} of DAU)
          </P>
          <P css={{ fontWeight: '$bold' }}>Weekly</P>
          <P>
            Portfolios: {weeklyPortfolios} (
            {(weeklyPortfolios / Math.max(1, wau)).toFixed(2)} of WAU)
          </P>
          <P>
            Needs: {weeklyNeeds} ({(weeklyNeeds / Math.max(1, wau)).toFixed(2)}{' '}
            of WAU)
          </P>
          <P>
            Proposals: {weeklyProposals} (
            {(weeklyProposals / Math.max(1, wau)).toFixed(2)} of WAU)
          </P>
          <P>
            Projects: {weeklyProjects} (
            {(weeklyProjects / Math.max(1, wau)).toFixed(2)} of WAU)
          </P>
          <P css={{ fontWeight: '$bold' }}>Monthly</P>
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
          <P>
            Projects: {monthlyProjects} (
            {(monthlyProjects / Math.max(1, mau)).toFixed(2)} of MAU)
          </P>
          <H5>New Users</H5>
          <P>Daily: {dailyNewUsers}</P>
          <P>Weekly: {weeklyNewUsers}</P>
          <P>Monthly: {monthlyNewUsers}</P>
          <H5>Other Stats</H5>
          <P>All time accounts created: {userCountAllTime}</P>
          <P>Deleted users: {userCountDeleted}</P>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
