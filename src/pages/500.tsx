import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { Button } from '@revolancer/ui/buttons';
import Image from 'next/image';
import { CrumbBar, Crumb } from '@revolancer/ui/navigation';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { H1, P } from '@revolancer/ui/text';

export default function FiveHundred() {
  return (
    <>
      <Title>Uh-Oh</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/">Discovery</Crumb>
          <Crumb href="/" active>
            Oops!
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column gap={3} css={{ width: '100%', alignItems: 'center' }}>
            <H1>500</H1>
            <Image
              src="/img/revy/happy.png"
              alt="Revy, happy to guide you back to safety"
              width={210}
              height={314}
            />
            <P>Oh no! Something went wrong.</P>
            <Button href="/" replace>
              Take me back
            </Button>
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
