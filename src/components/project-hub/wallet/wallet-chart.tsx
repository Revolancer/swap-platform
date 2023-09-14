import { useEffect, useState } from 'react';
import { CreditLogEntry } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import {
  VictoryContainer,
  VictoryChart,
  VictoryScatter,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
} from 'victory';
import { DateTime } from 'luxon';
import { config as styleConfig } from '@revolancer/ui';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const WalletChart = () => {
  const [logEntries, setLogEntries] = useState<CreditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosPrivate
      .get('credits/log/reverse')
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

  if (logEntries.length < 2) return <></>;

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      animate={{ duration: 300 }}
      width={
        typeof window !== 'undefined'
          ? (window.visualViewport?.width ?? 0) > 1200
            ? 1200
            : 600
          : 600
      }
      containerComponent={
        <VictoryContainer
          style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}
        />
      }
    >
      <VictoryLine
        height={400}
        data={logEntries.slice(-20)}
        interpolation="catmullRom"
        x={(d) => DateTime.fromISO(d.updated_at).toFormat('yyyy-LL-dd HH:mm')}
        y="resultant_amount"
        style={{ data: { stroke: styleConfig.theme.colors.pink500 } }}
        domainPadding={{ y: 10 }}
      />
      <VictoryScatter
        height={400}
        data={logEntries.slice(-20)}
        x={(d) => DateTime.fromISO(d.updated_at).toFormat('yyyy-LL-dd HH:mm')}
        y="resultant_amount"
        style={{ data: { fill: styleConfig.theme.colors.pink500 } }}
        domainPadding={{ y: 10 }}
      />
      <VictoryAxis dependentAxis style={{ grid: { stroke: 'none' } }} />
    </VictoryChart>
  );
};
