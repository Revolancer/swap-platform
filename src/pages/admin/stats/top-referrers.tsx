import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
//import { H1, H5 } from '@/components/text/headings';
import { axiosPrivate } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { useEffect, useState } from 'react';
//import { FullWidth } from '@/components/layout/columns';
import { styled } from '@revolancer/ui';
//import { P } from '@/components/text/text';
//import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
//import { Crumb } from '@/components/navigation/crumbs/crumb';
import { H1, H5, P } from '@revolancer/ui/text';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { FullWidth } from '@revolancer/ui/layout';

export default function TopReferrers() {
  const [referrers, setReferrers] =
    useState<{ referrer: string; count: number }[]>();

  const load = async () => {
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
      <AdminLayout>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/stats">Stats</Crumb>
          <Crumb href="/admin/stats/top-referrers" active>
            Top Referrers
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <H1>Top Referrers</H1>
          {referrers && (
            <>
              <H5>Referrers</H5>
              {referrers.map((referrer) => (
                <P key={referrer.referrer}>
                  {referrer.referrer}: {referrer.count}
                </P>
              ))}
            </>
          )}
        </FullWidth>
      </AdminLayout>
    </>
  );
}
