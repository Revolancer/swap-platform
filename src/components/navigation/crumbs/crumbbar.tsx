import { ColumnLayout, FullWidth } from '@/components/layout/columns';
import { styled } from '@revolancer/ui';
import { CrumbDivider } from './crumbdivider';

const CrumbBarContainer = styled('p', {
  margin: '$6',
  marginBottom: '0',
});

export const CrumbBar = ({ children }: { children?: any }) => {
  const crumbs = [];
  if (!Array.isArray(children)) {
    crumbs.push(children);
  } else {
    let i = 0;
    let hasRenderedCrumb = false;
    while (i < children.length) {
      crumbs.push(children[i]);
      if (typeof children[i] == 'object') {
        hasRenderedCrumb = true;
      }
      i++;
      if (
        i < children.length &&
        typeof children[i] == 'object' &&
        hasRenderedCrumb
      ) {
        crumbs.push(<CrumbDivider />);
      }
    }
  }
  return (
    <FullWidth>
      <CrumbBarContainer>{crumbs}</CrumbBarContainer>
    </FullWidth>
  );
};
