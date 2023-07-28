import { useEffect, useState } from 'react';
import { CreditLogEntry } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import { Div } from '../../layout/utils';
import { VictoryChart, VictoryStack, VictoryArea, VictoryTheme } from 'victory';
import { DateTime } from 'luxon';
import { styled } from 'stitches.config';
import { P } from '@/components/text/text';

const Table = styled('table', {
  borderCollapse: 'collapse',
  overflow: 'hidden',
  width: '100%',
  borderStyle: '$solid',
  borderColor: '$neutral300',
  borderWidth: '$1',
});
const THead = styled('thead', {
  backgroundColor: '$neutral300',
});
const TH = styled('th', {
  padding: '$2',
  textAlign: 'start',
});
const TR = styled('tr', {});
const TD = styled('td', { padding: '$2' });

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
      <Div
        css={{
          borderRadius: '$3',
          backgroundColor: '$neutral300',
          height: '400px',
        }}
      />
    );

  if (logEntries.length < 1) return <P>No transactions just yet!</P>;

  return (
    <Table>
      <THead>
        <TH>Date</TH>
        <TH css={{ width: '60%' }}></TH>
        <TH>Change</TH>
        <TH>Balance</TH>
      </THead>
      {logEntries.map((entry) => {
        return (
          <TR key={entry.id}>
            <TD>
              {DateTime.fromISO(entry.updated_at).toFormat('yyyy-LL-dd HH:mm')}
            </TD>
            <TD>{entry.reason}</TD>
            <TD>{entry.change}</TD>
            <TD>{entry.resultant_amount}</TD>
          </TR>
        );
      })}
    </Table>
  );
};
