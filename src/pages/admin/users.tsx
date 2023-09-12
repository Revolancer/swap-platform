import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { useCallback, useEffect, useState } from 'react';
import { Button, Link } from '@revolancer/ui/buttons';
import { DateTime } from 'luxon';
import { H1, H5, Span } from '@revolancer/ui/text';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { DataTable, TD, TH, TR } from '@revolancer/ui/project-hubs';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { InputInner, InputOuter } from '@revolancer/ui/forms';
import { Form, Formik } from 'formik';

type SortByColumn = 'created_at' | 'first_name' | 'last_name' | 'slug';
type Order = 'ASC' | 'DESC';

export default function Stats() {
  const [users, setUsers] = useState<
    {
      id: string;
      first_name: string;
      last_name: string;
      slug: string;
      roles: string[];
      profile_image: string;
      created_at: string;
    }[]
  >([]);

  const router = useRouter();
  const { page, sortBy, order } = router.query;
  const [userPage, setUserPage] = useState(
    Number.isNaN(Number(page)) ? 1 : Number(page),
  );
  const [sortby, setSortby] = useState<SortByColumn>(
    (sortBy as SortByColumn) || 'created_at',
  );
  const [ord, setOrd] = useState<Order>((order as Order) || 'ASC');
  const load = useCallback(async () => {
    await axiosPrivate
      .get(`admin/users?page=${userPage}&sortBy=${sortby}&order=${ord}`)
      .then((response) => setUsers(response.data ?? []))
      .catch((err) => {});
  }, [ord, sortby, userPage]);

  useEffect(() => {
    if (page) setUserPage(Number.isNaN(Number(page)) ? 1 : Number(page));
    if (sortBy) setSortby(sortBy as SortByColumn);
    if (order) setOrd(order as Order);
    load();
  }, [page, sortBy, order, load]);

  return (
    <>
      <Title>Users</Title>
      <AdminLayout roles={['admin', 'moderator']}>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/users" active>
            List of Users
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <H1>All Users</H1>
          <Flex
            wrap
            css={{
              padding: '$3',
              gap: '$5',
            }}
          >
            <Formik
              initialValues={{ searchText: '' }}
              onSubmit={(values, actions) => {}}
            >
              {(props) => (
                <Form>
                  <Flex
                    css={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <label htmlFor="searchText">Search: </label>
                    <InputOuter>
                      <InputInner
                        type="text"
                        name="searchText"
                        id="searchText"
                        placeholder="Search for an user"
                        onBlur={props.handleBlur}
                      />
                    </InputOuter>
                  </Flex>
                </Form>
              )}
            </Formik>
            <Flex css={{ justifyContent: 'center', alignItems: 'center' }}>
              <label htmlFor="searchText">Page: </label>

              <Flex
                css={{
                  border: '1px solid $neutral500',
                  borderRadius: '$1',
                  padding: '$1',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FontAwesomeIcon
                  icon={faMinus}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    router.push({
                      pathname: '/admin/users',
                      query: {
                        page: userPage - 1,
                        sortBy: sortby,
                        order: ord,
                      },
                    });
                    setUserPage(userPage - 1);
                  }}
                />
                <Span>{userPage}</Span>
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    router.push({
                      pathname: '/admin/users',
                      query: {
                        page: userPage + 1,
                        sortBy: sortby,
                        order: ord,
                      },
                    });
                    setUserPage(userPage + 1);
                  }}
                />
              </Flex>
            </Flex>
            <Flex css={{ justifyContent: 'center', alignItems: 'center' }}>
              <label htmlFor="searchText">Column: </label>

              <select
                defaultValue={'created_at'}
                value={sortby}
                name="sortBy"
                placeholder="Select a property to sort by"
                onChange={(e) => {
                  router.push({
                    pathname: '/admin/users',
                    query: {
                      page: userPage,
                      sortBy: e.target.value,
                      order: ord,
                    },
                  });
                  setSortby(e.target.value as SortByColumn);
                }}
              >
                <option value="created_at">created_at</option>
                <option value="first_name">first_name</option>
                <option value="last_name">last_name</option>
                <option value="slug">profile slug</option>
              </select>
            </Flex>
            <Flex css={{ justifyContent: 'center', alignItems: 'center' }}>
              <label htmlFor="searchText">Order: </label>
              <select
                defaultValue={'ASC'}
                value={ord}
                name="order"
                placeholder="Select the order"
                onChange={(e) => {
                  router.push({
                    pathname: '/admin/users',
                    query: {
                      page: userPage,
                      sortBy: sortby,
                      order: e.target.value,
                    },
                  });
                  setOrd(e.target.value as Order);
                }}
              >
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>
              </select>
            </Flex>
          </Flex>
          <DataTable
            renderHeadRow={() => (
              <TR>
                <TH>
                  <H5>Name</H5>
                </TH>
                <TH>
                  <H5>Created At</H5>
                </TH>
                <TH>
                  <H5>Roles</H5>
                </TH>
                <TH>
                  <H5>Action</H5>
                </TH>
              </TR>
            )}
            renderBodyRows={() =>
              users.map((user) => (
                <TR key={user.id}>
                  <TD>
                    <Link href={`/u/${user.slug}`} target="_blank">
                      {user.first_name + ' ' + user.last_name}
                    </Link>
                  </TD>
                  <TD>{DateTime.fromISO(user.created_at).toFormat('DDD t')}</TD>
                  <TD>
                    {user.roles && user.roles.length ? (
                      user.roles?.join(', ')
                    ) : (
                      <Span css={{ color: '$neutral500' }}>No roles</Span>
                    )}
                  </TD>
                  <TD>
                    <Flex>
                      <Button href="#" role={'primary'}>
                        Edit
                      </Button>
                      <Button href="#" role={'primary'}>
                        Delete
                      </Button>
                    </Flex>
                  </TD>
                </TR>
              ))
            }
          />
        </FullWidth>
      </AdminLayout>
    </>
  );
}
