import { useEffect, useState } from 'react';
import { CreditLogEntry } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import { DateTime } from 'luxon';
import { P } from '@revolancer/ui/text';
import { TH, TR, TD, DataTable } from '@revolancer/ui/project-hubs';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const WalletTable = () => {
  const [logEntries, setLogEntries] = useState<CreditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosPrivate
      .get('credits/log')
      .then((res) => res.data)
      .then((data) => {
        setLogEntries(data);
        setLoading(false);
      })
      .catch((err) => setLogEntries([]));
  }, []);

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

  if (logEntries.length < 1) return <P>No transactions just yet!</P>;

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
          {logEntries.map((entry) => {
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
