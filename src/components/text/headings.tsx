import { styled } from '@revolancer/ui';

export const H1 = styled('h1', {
  fontSize: '$h1m',
  lineHeight: '$h1m',
  fontWeight: '$bold',
  fontFamily: '$heading',

  '@sm': {
    fontSize: '$h1',
    lineHeight: '$h1',
  },
});

export const H2 = styled('h2', {
  fontSize: '$h2m',
  lineHeight: '$h2m',
  fontWeight: '$bold',
  fontFamily: '$heading',

  '@sm': {
    fontSize: '$h2',
    lineHeight: '$h2',
  },
});

export const H3 = styled('h3', {
  fontSize: '$h3m',
  lineHeight: '$h3m',
  fontWeight: '$medium',
  fontFamily: '$heading',

  '@sm': {
    fontSize: '$h3',
    lineHeight: '$h3',
  },
});

export const H4 = styled('h4', {
  fontSize: '$h4m',
  lineHeight: '$h4m',
  fontWeight: '$normal',
  fontFamily: '$heading',

  '@sm': {
    fontSize: '$h4',
    lineHeight: '$h4',
  },
});

export const H5 = styled('h5', {
  fontSize: '$h5',
  lineHeight: '$h5',
  fontWeight: '$bold',
  fontFamily: '$heading',
  textTransform: 'uppercase',
});
