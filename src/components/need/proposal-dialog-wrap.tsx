import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProposalNoPortfolioModal } from '../modals/proposal-no-portfolio-modal';
import { ProposalDialog } from './proposal-dialog';
import { axiosPublic } from '@/lib/axios';
import store from '@/redux/store';
import { useRouter } from 'next/router';

export const ProposalDialogWrap = ({ id }: { id: string }) => {
  const [success, setSuccess] = useState(false);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [loading, setLoading] = useState(true);
  const self = useMemo(() => store?.getState()?.userData?.user?.id ?? '', []);

  const loadPostsForUser = useCallback(async () => {
    if (self == '') return;
    axiosPublic
      .get(`portfolio/for_user/${self}`, {
        id: `user-portfolio-${self}`,
      })
      .then((response) => setHasPortfolio((response.data ?? []).length > 0))
      .catch(() => {});
  }, [self]);

  useEffect(() => {
    loadPostsForUser();
    setLoading(false);
  }, [loadPostsForUser]);

  const router = useRouter();

  if (loading) return <></>;

  return (
    <>
      {success && !hasPortfolio && (
        <ProposalNoPortfolioModal
          onClose={() => {
            setSuccess(false);
            router.reload();
          }}
        />
      )}
      <ProposalDialog
        id={id}
        setSuccess={
          hasPortfolio
            ? () => {
                router.reload();
              }
            : setSuccess
        }
      />
    </>
  );
};
