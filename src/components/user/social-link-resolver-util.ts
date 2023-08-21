import {
  faArtstation,
  faBehance,
  faBlogger,
  faCodepen,
  faDeviantart,
  faDribbble,
  faEtsy,
  faFacebook,
  faFigma,
  faGitlab,
  faInstagram,
  faLinkedin,
  faMedium,
  faSoundcloud,
  faSpotify,
  faThreads,
  faTiktok,
  faTumblr,
  faVimeo,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

// this function expects the url to be formatted properly
export const urlToIconsWithPriority = (url: string) => {
  if (url.startsWith('https://www.facebook.com'))
    return { priority: 1, icon: faFacebook };
  else if (url.startsWith('https://www.instagram.com'))
    return { priority: 2, brand: faInstagram };
  else if (url.startsWith('https://www.tiktok.com'))
    return { priority: 3, brand: faTiktok };
  else if (url.startsWith('https://www.linkedin.com'))
    return { priority: 4, brand: faLinkedin };
  else if (url.startsWith('https://github.com'))
    return { priority: 5, brand: faLinkedin };
  else if (url.startsWith('https://www.youtube.com'))
    return { priority: 6, brand: faYoutube };
  else if (url.startsWith('https://www.figma.com'))
    return { priority: 7, brand: faFigma };
  else if (url.startsWith('https://dribbble.com'))
    return { priority: 8, brand: faDribbble };
  else if (url.startsWith('https://medium.com'))
    return { priority: 9, brand: faMedium };
  else if (url.startsWith('https://codepen.io'))
    return { priority: 10, brand: faCodepen };
  else if (url.startsWith('https://vimeo.com'))
    return { priority: 11, brand: faVimeo };
  else if (url.startsWith('https://www.behance.net'))
    return { priority: 12, brand: faBehance };
  else if (url.startsWith('https://soundcloud.com'))
    return { priority: 13, brand: faSoundcloud };
  else if (url.startsWith('https://www.etsy.com'))
    return { priority: 14, brand: faEtsy };
  else if (url.startsWith('https://gitlab.com'))
    return { priority: 15, brand: faGitlab };
  else if (url.startsWith('https://open.spotify.com'))
    return { priority: 16, brand: faSpotify };
  else if (url.startsWith('https://twitter.com'))
    return { priority: 17, brand: faXTwitter };
  else if (url.startsWith('https://www.tumblr.com'))
    return { priority: 18, brand: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { priority: 19, brand: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { priority: 20, brand: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { priority: 21, brand: faTumblr };
  else if (url.startsWith('https://www.threads.net'))
    return { priority: 22, brand: faThreads };
  else if (url.startsWith('https://www.blogger.com'))
    return { priority: 23, brand: faBlogger };
  else if (url.startsWith('https://www.deviantart.com'))
    return { priority: 24, brand: faDeviantart };
  else if (url.startsWith('https://www.artstation.com'))
    return { priority: 25, brand: faArtstation };
  else return { priority: 26, brand: faGlobe };
};
