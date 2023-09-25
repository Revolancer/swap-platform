import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button } from '@revolancer/ui/buttons';
import { H2, H5, P, Span } from '@revolancer/ui/text';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { DataTable, TD, TH, TR } from '@revolancer/ui/project-hubs';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {
  InputInner,
  InputOuter,
  SelectGroup,
  SelectItem,
  Select,
} from '@revolancer/ui/forms';
import { Form, Formik } from 'formik';
import { Checkbox } from '@/components/forms/checkbox';
import { RoundedSquareImage } from '@revolancer/ui/user';
import { ChangeRoleModal } from '@/components/modals/change-role-modal';
import { DeleteAccountModal } from '@/components/modals/delete-account-modal';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import debounce from 'lodash.debounce';
import { DebouncedFunc } from 'lodash';

type SortByColumn = 'created_at' | 'first_name' | 'last_name' | 'slug';
type Order = 'ASC' | 'DESC';
type UserFilter = 'all' | 'admin' | 'moderator' | 'viewer' | 'user';
interface User {
  id: string;
  first_name: string;
  last_name: string;
  slug: string;
  roles: string[];
  profile_image: string;
  created_at: string;
  selected: boolean;
  email: string;
  user_id: string;
}

const getInitialSortColumn = (
  column: SortByColumn,
  order: Order,
): '0' | '1' | '2' | '3' => {
  if (column == 'created_at' && order == 'DESC') return '0';
  else if (column == 'created_at' && order == 'ASC') return '1';
  else if (column == 'first_name' && order == 'ASC') return '2';
  else if (column == 'first_name' && order == 'DESC') return '3';
  else return '0';
};

function UserTable({
  users,
  allSelected,
  userFilter,
  toggleAllSelected,
  setUsers,
  load,
  selectedUsers,
  setSelectedUsers,
}: {
  users: User[];
  allSelected: boolean;
  toggleAllSelected: () => void;
  setUsers: Dispatch<SetStateAction<User[]>>;
  userFilter: UserFilter;
  load: () => Promise<void>;
  selectedUsers: string[];
  setSelectedUsers: Dispatch<SetStateAction<string[]>>;
}) {
  useEffect(() => {
    load();
  }, [userFilter, load]);

  return (
    <DataTable
      renderHeadRow={() => (
        <TR>
          <TH css={{ width: '1%' }}>
            <Checkbox
              id="checked"
              name="checked"
              checked={allSelected}
              onChange={(value: boolean) => {
                toggleAllSelected();
                if (value) setSelectedUsers(users.map((u) => u.user_id));
                else setSelectedUsers([]);
              }}
            >
              {''}
            </Checkbox>
          </TH>
          <TH>
            <H5>User</H5>
          </TH>
          <TH>
            <H5>Email</H5>
          </TH>
          <TH>
            <H5>Role</H5>
          </TH>
          <TH css={{ width: '1%' }}></TH>
        </TR>
      )}
      renderBodyRows={() =>
        users
          .filter(
            (user) => userFilter == 'all' || user.roles?.includes(userFilter),
          )
          .map((user) => (
            <TR key={user.id}>
              <TD>
                <Checkbox
                  key={user.id}
                  name="checked"
                  id={user.id}
                  checked={selectedUsers.includes(user.user_id)}
                  onChange={(value: boolean) => {
                    if (value && !selectedUsers.includes(user.user_id)) {
                      setSelectedUsers((prev) => [...prev, user.user_id]);
                    } else {
                      setSelectedUsers((prev) => {
                        let newSelected = [];
                        for (let u of prev) {
                          if (u != user.user_id) newSelected.push(u);
                        }
                        return newSelected;
                      });
                    }
                  }}
                >
                  {''}
                </Checkbox>
              </TD>
              <TD>
                <Flex css={{ alignItems: 'center' }}>
                  <RoundedSquareImage size="small" url={user.profile_image} />
                  {user.first_name + ' ' + user.last_name}
                </Flex>
              </TD>
              <TD>{user.email}</TD>
              <TD>
                {user.roles && user.roles.length ? (
                  user.roles?.join(', ')
                ) : (
                  <Span css={{ color: '$neutral500' }}>No roles</Span>
                )}
              </TD>
              <TD>
                <Flex>
                  <Button href={`/admin/users/${user.id}`} role={'secondary'}>
                    Edit User
                  </Button>
                  <Button
                    href={`/u/${user.slug}`}
                    target="_blank"
                    role={'secondary'}
                  >
                    View Profile
                  </Button>
                </Flex>
              </TD>
            </TR>
          ))
      }
    />
  );
}

function RoleSelector({
  onSubmit,
  roles,
}: {
  onSubmit: (role: string) => void;
  roles: string[];
}) {
  return (
    <Formik
      initialValues={{ role: roles[0] }}
      onSubmit={(values, actions) => {
        onSubmit(values.role);
      }}
    >
      {(props) => (
        <Form onChange={props.submitForm}>
          <Select name="role" placeholder="Roles">
            <SelectGroup id="role">
              {roles.map((role) => (
                <SelectItem key={role} id={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectGroup>
          </Select>
        </Form>
      )}
    </Formik>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [userFilter, setUserFilter] = useState<UserFilter>('all');
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [changeRole, setChangeRole] = useState('user');

  const router = useRouter();

  const { search: srch, page, sortBy, order } = router.query;

  const [userPage, setUserPage] = useState(
    Number.isNaN(Number(page)) ? 1 : Number(page),
  );
  const [sortby, setSortby] = useState<SortByColumn>(
    (sortBy as SortByColumn) || 'created_at',
  );
  const [ord, setOrd] = useState<Order>((order as Order) || 'DESC');
  const [search, setSearch] = useState(srch || '');

  const load = useCallback(async () => {
    await axiosPrivate
      .get(
        `admin/users?search=${search}&page=${userPage}&sortBy=${sortby}&order=${ord}&timestamp=${new Date().getTime()}`,
      )
      .then((response) => {
        setUsers(response.data.data ?? []);
        setTotalPageCount(response.data.totalPages ?? 0);
      })
      .catch((err) => {});
  }, [userPage, sortby, ord, search]);

  const debouncedLoad = debounce(load, 500);

  useEffect(() => {
    if (page) setUserPage(Number.isNaN(Number(page)) ? 1 : Number(page));
    if (sortBy) setSortby(sortBy as SortByColumn);
    if (order) setOrd(order as Order);
  }, [page, sortBy, order]);

  return (
    <>
      <Title>Users</Title>
      <AdminLayout roles={['admin', 'moderator']}>
        <CrumbBar>
          <Crumb href="#">Admin</Crumb>
          <Crumb href="/admin/users" active>
            User Management
          </Crumb>
        </CrumbBar>
        <FullWidth css={{ padding: '$5' }}>
          <FullWidth>
            <H2>User Management</H2>
          </FullWidth>
          <FullWidth>
            <H5>USERS</H5>
            <P>
              View & Manage your users. To search for multiple users separate
              their usernames by a comma.{' '}
            </P>
            <Flex
              css={{
                width: '100%',
                padding: '$3',
                gap: '$5',
              }}
            >
              <Formik
                initialValues={{ searchText: '' }}
                onSubmit={(values, actions) => {}}
              >
                {(props) => (
                  <Form style={{ width: '65%' }}>
                    <Flex
                      css={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <InputOuter key={'searchText'} css={{ width: '100%' }}>
                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ marginRight: '5px' }}
                        />
                        <InputInner
                          autoFocus
                          type="text"
                          name="searchText"
                          id="searchText"
                          placeholder="Search"
                          onBlur={props.handleBlur}
                          value={search}
                          onChange={(e) => {
                            router.push({
                              pathname: '/admin/users',
                              query: {
                                search: e.target.value,
                                page: userPage,
                                sortBy: sortby,
                                order: ord,
                              },
                            });
                            setSearch(e.target.value);
                            debouncedLoad();
                          }}
                        />
                      </InputOuter>
                    </Flex>
                  </Form>
                )}
              </Formik>
              <Button
                href="#"
                role="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenRoleModal(true);
                }}
              >
                Change role
              </Button>
              <Button
                href="#"
                role="dangerous"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDeleteModal(true);
                }}
              >
                Delete
              </Button>
            </Flex>
            <Flex
              css={{
                width: '100%',
                padding: '$3',
                gap: '$5',
              }}
            >
              <Formik
                initialValues={{ sortBy: getInitialSortColumn(sortby, ord) }}
                onSubmit={(values, actions) => {
                  switch (values.sortBy) {
                    case '0':
                      router.push({
                        pathname: '/admin/users',
                        query: {
                          search: search,
                          page: userPage,
                          sortBy: 'created_at',
                          order: 'DESC',
                        },
                      });
                      setOrd('DESC');
                      setSortby('created_at');
                      break;
                    case '1':
                      router.push({
                        pathname: '/admin/users',
                        query: {
                          search: search,
                          page: userPage,
                          sortBy: 'created_at',
                          order: 'ASC',
                        },
                      });
                      setOrd('ASC');
                      setSortby('created_at');
                      break;
                    case '2':
                      router.push({
                        pathname: '/admin/users',
                        query: {
                          search: search,
                          page: userPage,
                          sortBy: 'first_name',
                          order: 'ASC',
                        },
                      });
                      setOrd('ASC');
                      setSortby('first_name');
                      break;
                    case '3':
                      router.push({
                        pathname: '/admin/users',
                        query: {
                          search: search,
                          page: userPage,
                          sortBy: 'first_name',
                          order: 'DESC',
                        },
                      });
                      setOrd('DESC');
                      setSortby('first_name');
                      break;
                    default:
                      router.push({
                        pathname: '/admin/users',
                        query: {
                          search: search,
                          page: userPage,
                          sortBy: 'created_at',
                          order: 'ASC',
                        },
                      });
                      setOrd('DESC');
                      setSortby('first_name');
                  }
                }}
              >
                {(props) => (
                  <Form onChange={props.submitForm}>
                    <Select name="sortBy" placeholder="Order">
                      <SelectGroup id="sortBy">
                        <SelectItem id="0" value="0">
                          Newest First
                        </SelectItem>
                        <SelectItem id="1" value="1">
                          Oldest First
                        </SelectItem>
                        <SelectItem id="2" value="2">
                          Alphabetically A-Z
                        </SelectItem>
                        <SelectItem id="3" value="3">
                          Alphabetically Z-A
                        </SelectItem>
                      </SelectGroup>
                    </Select>
                  </Form>
                )}
              </Formik>
              <RoleSelector
                roles={['all', 'admin', 'moderator', 'viewer', 'user']}
                onSubmit={(role) => setUserFilter(role as UserFilter)}
              />
              <Flex
                css={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 'auto',
                  color: '$neutral700',
                }}
              >
                {totalPageCount == 0 ? (
                  <Span>No results found</Span>
                ) : (
                  <>
                    <Span>
                      page {userPage} of {totalPageCount}
                    </Span>
                    {userPage > 1 && (
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          router.push({
                            pathname: '/admin/users',
                            query: {
                              search: search,
                              page: userPage - 1,
                              sortBy: sortby,
                              order: ord,
                            },
                          });
                          setUserPage(userPage - 1);
                        }}
                      />
                    )}
                    {userPage < totalPageCount && (
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          router.push({
                            pathname: '/admin/users',
                            query: {
                              search: search,
                              page: userPage + 1,
                              sortBy: sortby,
                              order: ord,
                            },
                          });
                          setUserPage(userPage + 1);
                        }}
                      />
                    )}
                  </>
                )}
              </Flex>
            </Flex>
          </FullWidth>
          <UserTable
            users={users}
            setUsers={setUsers}
            allSelected={allSelected}
            toggleAllSelected={() => setAllSelected(!allSelected)}
            userFilter={userFilter}
            load={load}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </FullWidth>
        <ChangeRoleModal
          modalIsOpen={openRoleModal}
          closeModal={() => setOpenRoleModal(false)}
          onSave={() => {
            axiosPrivate
              .put(`admin/users/role`, {
                usersToChangeRole: selectedUsers,
                role: changeRole,
              })
              .then((response) => {
                axiosPrivate
                  .get(
                    `admin/users?search=${search}&page=${1}&sortBy=${sortby}&order=${ord}&timestamp=${new Date().getTime()}`,
                  )
                  .then((response) => {
                    setUsers(response.data.data ?? []);
                    setTotalPageCount(response.data.totalPages ?? 0);
                  })
                  .catch((err) => {});
              })
              .catch((err) => {});
          }}
          selectedUsers={users
            .filter((u) => selectedUsers.includes(u.user_id))
            .map((u) => u.first_name + ' ' + u.last_name)}
          RoleChangerComponent={
            <RoleSelector
              roles={['admin', 'moderator', 'stats_viewer', 'user']}
              onSubmit={(role) => setChangeRole(role)}
            />
          }
        />
        <DeleteAccountModal
          onDelete={() => {
            axiosPrivate
              .delete(`admin/users`, {
                data: {
                  usersToDelete: selectedUsers,
                },
              })
              .then((response) => {
                axiosPrivate
                  .get(
                    `admin/users?search=${search}&page=${1}&sortBy=${sortby}&order=${ord}&timestamp=${new Date().getTime()}`,
                  )
                  .then((response) => {
                    setUsers(response.data.data ?? []);
                    setTotalPageCount(response.data.totalPages ?? 0);
                  })
                  .catch((err) => {});
              })
              .catch((err) => {});
          }}
          modalIsOpen={openDeleteModal}
          closeModal={() => setOpenDeleteModal(false)}
          selectedUsers={users
            .filter((u) => selectedUsers.includes(u.user_id))
            .map((u) => u.first_name + ' ' + u.last_name)}
        />
      </AdminLayout>
    </>
  );
}
