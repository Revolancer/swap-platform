import { FeedPostData } from '@/lib/types';
import { AddSomething } from '../addsomething';
import { PortfolioProfileCard } from '@/components/user-posts/portfolio-profile-card';
import { NeedProfileCard } from '@/components/user-posts/need-profile-card';
import { UserProfileCard } from '@/components/user-posts/user-profile-card';

export const FeedCard = ({ data }: { data: FeedPostData }) => {
  switch (data?.type) {
    case 'add': {
      return <AddSomething />;
    }
    case 'portfolio': {
      return <PortfolioProfileCard data={data.data} withAuthor hideIfEmpty />;
    }
    case 'need': {
      return <NeedProfileCard data={data.data} withAuthor />;
    }
    case 'user': {
      return <UserProfileCard uid={data.data?.user?.id} />;
    }
  }
};
