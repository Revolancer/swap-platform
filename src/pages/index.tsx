import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import { FeedSegment } from "@/components/dashboard/feedsegment";
import { FullWidth } from "@/components/layout/columns";

export default function Home() {
  return (
    <>
      <Title>Discover</Title>
      <PrimaryLayout>
        <FullWidth>
          <FeedSegment />
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
