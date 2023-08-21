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
    return { priority: 2, icon: faInstagram };
  else if (url.startsWith('https://www.tiktok.com'))
    return { priority: 3, icon: faTiktok };
  else if (url.startsWith('https://www.linkedin.com'))
    return { priority: 4, icon: faLinkedin };
  else if (url.startsWith('https://github.com'))
    return { priority: 5, icon: faLinkedin };
  else if (url.startsWith('https://www.youtube.com'))
    return { priority: 6, icon: faYoutube };
  else if (url.startsWith('https://www.figma.com'))
    return { priority: 7, icon: faFigma };
  else if (url.startsWith('https://dribbble.com'))
    return { priority: 8, icon: faDribbble };
  else if (url.startsWith('https://medium.com'))
    return { priority: 9, icon: faMedium };
  else if (url.startsWith('https://codepen.io'))
    return { priority: 10, icon: faCodepen };
  else if (url.startsWith('https://vimeo.com'))
    return { priority: 11, icon: faVimeo };
  else if (url.startsWith('https://www.behance.net'))
    return { priority: 12, icon: faBehance };
  else if (url.startsWith('https://soundcloud.com'))
    return { priority: 13, icon: faSoundcloud };
  else if (url.startsWith('https://www.etsy.com'))
    return { priority: 14, icon: faEtsy };
  else if (url.startsWith('https://gitlab.com'))
    return { priority: 15, icon: faGitlab };
  else if (url.startsWith('https://open.spotify.com'))
    return { priority: 16, icon: faSpotify };
  else if (url.startsWith('https://twitter.com'))
    return { priority: 17, icon: faXTwitter };
  else if (url.startsWith('https://www.tumblr.com'))
    return { priority: 18, icon: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { priority: 19, icon: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { priority: 20, icon: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { priority: 21, icon: faTumblr };
  else if (url.startsWith('https://www.threads.net'))
    return { priority: 22, icon: faThreads };
  else if (url.startsWith('https://www.blogger.com'))
    return { priority: 23, icon: faBlogger };
  else if (url.startsWith('https://www.deviantart.com'))
    return { priority: 24, icon: faDeviantart };
  else if (url.startsWith('https://www.artstation.com'))
    return { priority: 25, icon: faArtstation };
  else return { priority: 26, icon: faGlobe };
};
