import { axiosPrivate } from '@/lib/axios';
import { Button, Link } from '@revolancer/ui/buttons';
import { Card, Flex } from '@revolancer/ui/layout';
import { P, Span } from '@revolancer/ui/text';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const AddSomething = () => {
  const [name, setName] = useState('Buddy');

  useEffect(() => {
    axiosPrivate.get('user/profile').then((response) => {
      setName(response.data?.first_name);
    });
  }, []);

  return (
    <Card>
      <Flex
        column
        gap={3}
        css={{
          borderWidth: '$2',
          borderRadius: '$2',
          alignItems: 'center',
          padding: '$4',
        }}
      >
        <Flex
          css={{
            width: '100%',
            alignItems: 'center',
            marginBottom: '$4',
            '@md': { width: '75%' },
          }}
          gap={4}
        >
          <Image
            src="/img/revy/happy.png"
            alt="Revy, happy to guide you through this feed"
            width={76}
            height={114}
          />
          <P css={{ fontSize: '$h5', fontWeight: '$bold' }}>
            Hi {name}, what would you like to do today?
          </P>
        </Flex>
        <Flex css={{ width: '100%', '@md': { width: '75%' } }} gap={4}>
          <Button
            href="/portfolio/new"
            size="small"
            role="secondary"
            css={{ width: '50%', textAlign: 'center' }}
          >
            New Post
          </Button>
          <Button
            href="/need/new"
            size="small"
            role="secondary"
            css={{ width: '50%', textAlign: 'center' }}
          >
            New Need
          </Button>
        </Flex>
        <Button
          href="https://revolancer.com/magazine/get-clients/"
          target="_blank"
          size="small"
          role="secondary"
          css={{ width: '100%', textAlign: 'center', '@md': { width: '75%' } }}
        >
          Look For Paid Work Opportunities
        </Button>
        <Span
          css={{
            fontSize: '$body2',
            lineHeight: '$body2',
            color: '$neutral700',
          }}
        >
          💡 Need some Instructions? Check out our{' '}
          <Link
            href="https://support.revolancer.com/hc/en-gb/articles/13840149282973-How-to-apply-for-jobs-on-the-Job-Board"
            target="_blank"
          >
            guides
          </Link>
          !
        </Span>
      </Flex>
    </Card>
  );
};
