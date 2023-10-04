import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { P } from '@revolancer/ui/text';
import { TH, TR, TD, DataTable } from '@revolancer/ui/project-hubs';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getCreditLogs } from '@/lib/user/wallet';

export const WalletTable = ({ id }: { id?: string }) => {
  const { creditLog, loading } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getCreditLogs(id));
    } else {
      dispatch(getCreditLogs(''));
    }
  }, [id, dispatch]);

  if (loading)
    return (
      <SkeletonText
        css={{
          borderRadius: '$3',
          backgroundColor: '$neutral300',
          height: '400px',
        }}
      />
    );

  if (creditLog.length < 1) return <P>No transactions just yet!</P>;

  return (
    <DataTable
      renderHeadRow={() => (
        <TR>
          <TH>Date</TH>
          <TH css={{ width: '60%' }}></TH>
          <TH>Change</TH>
          <TH>Balance</TH>
        </TR>
      )}
      renderBodyRows={() => (
        <>
          {creditLog.map((entry) => {
            return (
              <TR key={entry.id}>
                <TD>
                  {DateTime.fromISO(entry.updated_at).toFormat(
                    'yyyy-LL-dd HH:mm',
                  )}
                </TD>
                <TD>{entry.reason}</TD>
                <TD>{entry.change}</TD>
                <TD>{entry.resultant_amount}</TD>
              </TR>
            );
          })}
        </>
      )}
    />
  );
};
