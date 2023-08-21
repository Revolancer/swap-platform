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
  faGithub,
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
  if (url.startsWith('http://www.facebook.com'))
    return { url: url, priority: 1, icon: faFacebook };
  else if (url.startsWith('http://www.instagram.com'))
    return { url: url, priority: 2, icon: faInstagram };
  else if (url.startsWith('http://www.tiktok.com'))
    return { url: url, priority: 3, icon: faTiktok };
  else if (url.startsWith('http://www.linkedin.com'))
    return { url: url, priority: 4, icon: faLinkedin };
  else if (url.startsWith('http://www.github.com'))
    return { url: url, priority: 5, icon: faGithub };
  else if (url.startsWith('http://www.youtube.com'))
    return { url: url, priority: 6, icon: faYoutube };
  else if (url.startsWith('http://www.figma.com'))
    return { url: url, priority: 7, icon: faFigma };
  else if (url.startsWith('http://www.dribbble.com'))
    return { url: url, priority: 8, icon: faDribbble };
  else if (url.startsWith('http://www.medium.com'))
    return { url: url, priority: 9, icon: faMedium };
  else if (url.startsWith('http://www.codepen.io'))
    return { url: url, priority: 10, icon: faCodepen };
  else if (url.startsWith('http://www.vimeo.com'))
    return { url: url, priority: 11, icon: faVimeo };
  else if (url.startsWith('http://www.behance.net'))
    return { url: url, priority: 12, icon: faBehance };
  else if (url.startsWith('http://soundcloud.com'))
    return { url: url, priority: 13, icon: faSoundcloud };
  else if (url.startsWith('http://www.etsy.com'))
    return { url: url, priority: 14, icon: faEtsy };
  else if (url.startsWith('http://www.gitlab.com'))
    return { url: url, priority: 15, icon: faGitlab };
  else if (url.startsWith('http://open.spotify.com'))
    return { url: url, priority: 16, icon: faSpotify };
  else if (url.startsWith('http://www.twitter.com'))
    return { url: url, priority: 17, icon: faXTwitter };
  else if (url.startsWith('http://www.tumblr.com'))
    return { url: url, priority: 18, icon: faTumblr };
  else if (url.startsWith('http://www.tumblr.com'))
    return { url: url, priority: 19, icon: faTumblr };
  else if (url.startsWith('http://www.tumblr.com'))
    return { url: url, priority: 20, icon: faTumblr };
  else if (url.startsWith('http://www.tumblr.com'))
    return { url: url, priority: 21, icon: faTumblr };
  else if (url.startsWith('http://www.threads.net'))
    return { url: url, priority: 22, icon: faThreads };
  else if (url.startsWith('http://www.blogger.com'))
    return { url: url, priority: 23, icon: faBlogger };
  else if (url.startsWith('http://www.deviantart.com'))
    return { url: url, priority: 24, icon: faDeviantart };
  else if (url.startsWith('http://www.artstation.com'))
    return { url: url, priority: 25, icon: faArtstation };
  else return { url: url, priority: 26, icon: faGlobe };
};
