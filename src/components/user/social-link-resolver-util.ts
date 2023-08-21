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
  const host = new URL(url).host.split('.');
  let brand = host[0] == 'www' ? host[1] : host[0];
  switch (brand) {
    case 'facebook':
      return { url: url, priority: 1, icon: faFacebook };
    case 'instagram':
      return { url: url, priority: 2, icon: faInstagram };
    case 'tiktok':
      return { url: url, priority: 3, icon: faTiktok };
    case 'linkedin':
      return { url: url, priority: 4, icon: faLinkedin };
    case 'github':
      return { url: url, priority: 5, icon: faGithub };
    case 'youtube':
      return { url: url, priority: 6, icon: faYoutube };
    case 'figma':
      return { url: url, priority: 7, icon: faFigma };
    case 'dribble':
      return { url: url, priority: 8, icon: faDribbble };
    case 'medium':
      return { url: url, priority: 9, icon: faMedium };
    case 'codepen':
      return { url: url, priority: 10, icon: faCodepen };
    case 'vimeo':
      return { url: url, priority: 11, icon: faVimeo };
    case 'behance':
      return { url: url, priority: 12, icon: faBehance };
    case 'soundcloud':
      return { url: url, priority: 13, icon: faSoundcloud };
    case 'etsy':
      return { url: url, priority: 14, icon: faEtsy };
    case 'gitlab':
      return { url: url, priority: 15, icon: faGitlab };
    case 'open':
      if (host[1] == 'spotify')
        return { url: url, priority: 16, icon: faSpotify };
      else return { url: url, priority: 16, icon: faGlobe };
    case 'twitter':
      return { url: url, priority: 17, icon: faXTwitter };
    case 'tumblr':
      return { url: url, priority: 18, icon: faTumblr };
    case 'threads':
      return { url: url, priority: 22, icon: faThreads };
    case 'blogger':
      return { url: url, priority: 23, icon: faBlogger };
    case 'deviantart':
      return { url: url, priority: 24, icon: faDeviantart };
    case 'artstation':
      return { url: url, priority: 25, icon: faArtstation };
    default:
      return { url: url, priority: 25, icon: faGlobe };
  }
};
