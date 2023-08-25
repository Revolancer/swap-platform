import { useCallback, useEffect, useState } from 'react';
import { Link } from '@revolancer/ui/buttons';
import store from '@/redux/store';
import { axiosPublic } from '@/lib/axios';
import { useRouter } from 'next/router';
import { P } from '@revolancer/ui/text';
import { NagBar } from '@revolancer/ui/layout';

export const NoPortfolioNagbar = () => {
  const [hasPosts, setHasPosts] = useState(true);
  const [onEditor, setOnEditor] = useState(false);

  const uid = store?.getState()?.userData?.user?.id ?? '';

  const router = useRouter();

  const loadPosts = useCallback(async () => {
    await axiosPublic
      .get(`portfolio/for_user/${uid}`, {
        id: `user-portfolio-${uid}`,
      })
      .then((response) => {
        setHasPosts((response.data ?? []).length > 0);
      })
      .catch(() => {});
  }, [uid]);

  useEffect(() => {
    loadPosts();
    setOnEditor(router.pathname == '/portfolio/[id]');
  }, [loadPosts, router.pathname]);

  if (hasPosts || onEditor) return <></>;

  return (
    <NagBar>
      <P>
        Users with active portfolios get 30% more interest.{' '}
        <Link
          href="/portfolio/new"
          css={{ color: '$orange600', '&:hover': { color: '$orange800' } }}
        >
          <strong>Add to my portfolio</strong>
        </Link>
      </P>
    </NagBar>
  );
};
