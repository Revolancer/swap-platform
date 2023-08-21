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
    return { url: url, priority: 1, icon: faFacebook };
  else if (url.startsWith('https://www.instagram.com'))
    return { url: url, priority: 2, icon: faInstagram };
  else if (url.startsWith('https://www.tiktok.com'))
    return { url: url, priority: 3, icon: faTiktok };
  else if (url.startsWith('https://www.linkedin.com'))
    return { url: url, priority: 4, icon: faLinkedin };
  else if (url.startsWith('https://github.com'))
    return { url: url, priority: 5, icon: faLinkedin };
  else if (url.startsWith('https://www.youtube.com'))
    return { url: url, priority: 6, icon: faYoutube };
  else if (url.startsWith('https://www.figma.com'))
    return { url: url, priority: 7, icon: faFigma };
  else if (url.startsWith('https://dribbble.com'))
    return { url: url, priority: 8, icon: faDribbble };
  else if (url.startsWith('https://medium.com'))
    return { url: url, priority: 9, icon: faMedium };
  else if (url.startsWith('https://codepen.io'))
    return { url: url, priority: 10, icon: faCodepen };
  else if (url.startsWith('https://vimeo.com'))
    return { url: url, priority: 11, icon: faVimeo };
  else if (url.startsWith('https://www.behance.net'))
    return { url: url, priority: 12, icon: faBehance };
  else if (url.startsWith('https://soundcloud.com'))
    return { url: url, priority: 13, icon: faSoundcloud };
  else if (url.startsWith('https://www.etsy.com'))
    return { url: url, priority: 14, icon: faEtsy };
  else if (url.startsWith('https://gitlab.com'))
    return { url: url, priority: 15, icon: faGitlab };
  else if (url.startsWith('https://open.spotify.com'))
    return { url: url, priority: 16, icon: faSpotify };
  else if (url.startsWith('https://twitter.com'))
    return { url: url, priority: 17, icon: faXTwitter };
  else if (url.startsWith('https://www.tumblr.com'))
    return { url: url, priority: 18, icon: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { url: url, priority: 19, icon: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { url: url, priority: 20, icon: faTumblr };
  else if (url.startsWith('https://www.tumblr.com'))
    return { url: url, priority: 21, icon: faTumblr };
  else if (url.startsWith('https://www.threads.net'))
    return { url: url, priority: 22, icon: faThreads };
  else if (url.startsWith('https://www.blogger.com'))
    return { url: url, priority: 23, icon: faBlogger };
  else if (url.startsWith('https://www.deviantart.com'))
    return { url: url, priority: 24, icon: faDeviantart };
  else if (url.startsWith('https://www.artstation.com'))
    return { url: url, priority: 25, icon: faArtstation };
  else return { url: url, priority: 26, icon: faGlobe };
};
