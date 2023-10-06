import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { Button } from '@revolancer/ui/buttons';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { ConfirmationDialog } from '@revolancer/ui/modals';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { Span } from '@revolancer/ui/text';
import { useEffect, useState } from 'react';

export default function IndexManagement() {
  const [countAll, setCountAll] = useState(-1);
  const [countNeeds, setCountNeeds] = useState(-1);
  const [countPortfolios, setCountPortfolios] = useState(-1);
  const [countUsers, setCountUsers] = useState(-1);

  useEffect(() => {
    axiosPrivate
      .get('admin/index')
      .then((res) => res.data)
      .then((data) => setCountAll(data))
      .catch();
    axiosPrivate
      .get('admin/index/needs')
      .then((res) => res.data)
      .then((data) => setCountNeeds(data))
      .catch();
    axiosPrivate
      .get('admin/index/portfolios')
      .then((res) => res.data)
      .then((data) => setCountPortfolios(data))
      .catch();
  }, []);
  axiosPrivate
    .get('admin/index/users')
    .then((res) => res.data)
    .then((data) => setCountUsers(data))
    .catch();
  return (
    <>
      <Title>Index Management</Title>
      <AdminLayout roles={['admin']}>
        <CrumbBar>
          <Crumb href="#">Admin</Crumb>
          <Crumb href="/admin/index-management" active>
            Index Management
          </Crumb>
        </CrumbBar>
        {(countAll < 0 ||
          countNeeds < 0 ||
          countPortfolios < 0 ||
          countUsers < 0) && (
          <>
            <Button loading href="#" />
            <Button loading href="#" />
            <Button loading href="#" />
            <Button loading href="#" />
            <FullWidth>
              <Flex column>
                <SkeletonText type="span" />
                <SkeletonText type="span" />
                <SkeletonText type="span" />
                <SkeletonText type="span" />
              </Flex>
            </FullWidth>
          </>
        )}
        {countAll >= 0 &&
          countNeeds >= 0 &&
          countPortfolios >= 0 &&
          countUsers >= 0 && (
            <>
              <ConfirmationDialog
                label="Clear Index"
                onAccept={() => axiosPrivate.delete('admin/index')}
                confirmationMessage="This will completely empty all search indices & remove all discovery feed content"
                dangerous
              />
              <ConfirmationDialog
                label="Index All Users"
                onAccept={() => axiosPrivate.put('admin/index/users')}
                confirmationMessage="This will index all registered user accounts"
              />
              <ConfirmationDialog
                label="Index All Needs"
                onAccept={() => axiosPrivate.put('admin/index/needs')}
                confirmationMessage="This will index all needs"
              />
              <ConfirmationDialog
                label="Index All Portfolios"
                onAccept={() => axiosPrivate.put('admin/index/portfolios')}
                confirmationMessage="This will index all portfolios"
              />
              <FullWidth>
                <Flex column>
                  <Span>Total index entries: {countAll}</Span>
                  <Span>Indexed needs: {countNeeds}</Span>
                  <Span>Indexed portfolios: {countPortfolios}</Span>
                  <Span>Indexed users: {countUsers}</Span>
                </Flex>
              </FullWidth>
            </>
          )}
      </AdminLayout>
    </>
  );
}
