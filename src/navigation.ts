import { getPermalink } from './utils/permalinks';
import { business } from './config/business';

// Contact hrefs derived from the single source of truth in config/business.ts —
// they update automatically once the client's real details are filled in.
const telHref = `tel:${business.telephone.replace(/\s/g, '')}`;
const emailHref = business.email ? `mailto:${business.email}` : undefined;

/**
 * Category slugs kept out of the "More News" mega menu.
 *
 * That menu is built from the live category counts in D1 (see Header.astro),
 * so a big historical section outranks current ones on volume alone. Listing a
 * slug here hides it from the nav only — its archive at /category/<slug> still
 * resolves, is still linked from articles, and stays in the sitemap.
 */
export const hiddenNavCategories = new Set([
  'covid19diaries', // Covid-19 Diaries: a closed 2020-21 series, not a current section
]);

// Mirrors the WordPress site's menu one-for-one (same labels, same URLs).
export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'About', href: getPermalink('/about-us') },
    {
      text: 'More News',
      href: getPermalink('/news'),
      mega: 'news',
      links: [
        { text: 'All News', href: getPermalink('/news') },
        { text: 'Videos', href: getPermalink('/videos') },
        { text: 'Community', href: getPermalink('/category/community') },
        { text: 'Development Work', href: getPermalink('/category/development-work') },
        { text: 'Empowerment', href: getPermalink('/category/empowerment') },
        { text: 'Funding', href: getPermalink('/category/funding') },
        { text: 'Inclusion', href: getPermalink('/category/inclusion') },
      ],
    },
    { text: 'Magazines', href: getPermalink('/magazines'), mega: 'magazines' },
    { text: 'Advice For Groups', href: getPermalink('/advice-for-groups') },
    { text: 'Support For Individuals', href: getPermalink('/support-for-individuals') },
    { text: 'Volunteering', href: getPermalink('/volunteering') },
    { text: "What's On?", href: getPermalink('/whats-on') },
    { text: 'Community Development', href: getPermalink('/community-development') },
    { text: 'The Community Sector', href: getPermalink('/the-community-sector') },
    { text: 'Advertise', href: getPermalink('/advertise') },
    { text: 'Studying', href: getPermalink('/studying') },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
};

// Default footer structure — the standing standard for every client build:
// brand column (logo + description + legal links), an icon-led "Explore"
// column, a "Get in touch" column fed by config/business.ts, then a bottom
// bar with the footnote left and social icons right.
export const footerData = {
  description: business.description,
  links: [
    {
      title: 'Explore',
      links: [
        { text: 'Home', href: getPermalink('/'), icon: 'tabler:home' },
        { text: 'News', href: getPermalink('/news'), icon: 'tabler:news' },
        { text: 'Magazines', href: getPermalink('/magazines'), icon: 'tabler:book-2' },
        { text: 'About', href: getPermalink('/about-us'), icon: 'tabler:user' },
        { text: 'Contact', href: getPermalink('/contact'), icon: 'tabler:message-circle' },
      ],
    },
    {
      title: 'Get in touch',
      links: [
        { text: business.telephone, href: telHref, icon: 'tabler:phone' },
        ...(business.email ? [{ text: business.email, href: emailHref, icon: 'tabler:mail' }] : []),
        { text: `${business.address.locality}, ${business.address.region}`, icon: 'tabler:map-pin' },
      ],
    },
  ],
  secondaryLinks: [{ text: 'Privacy Policy', href: getPermalink('/privacy-policy') }],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/ChangingIrelandMagazine' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/changingireland/' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/changing-ireland' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://www.youtube.com/user/changingireland' },
    ...(emailHref ? [{ ariaLabel: 'Email', icon: 'tabler:mail', href: emailHref }] : []),
  ],
  theme: 'dark',
  // The tricolour is inline SVG rather than the 🇮🇪 emoji on purpose: Windows
  // has no flag glyphs and renders regional-indicator pairs as the letters "IE".
  // %%YEAR%% is substituted in Footer.astro, not interpolated here. This object
  // is built when the module is first evaluated, which on Workers happens in
  // global scope — and there Date.now() is 0, so `new Date().getFullYear()`
  // rendered a © 1970 in the live footer. Component render happens during a
  // request, where the clock is real.
  footNote: `© ${business.legalName}, %%YEAR%%. All rights reserved. Website by <a href="https://designmywebsite.ie" target="_blank" rel="noopener noreferrer" class="hover:underline">Design My Website</a> <svg viewBox="0 0 18 12" width="18" height="12" role="img" aria-label="Ireland" class="inline-block align-[-0.15em] ml-1 rounded-[1px] ring-1 ring-black/10 dark:ring-white/20"><rect width="6" height="12" fill="#169B62"/><rect x="6" width="6" height="12" fill="#FFFFFF"/><rect x="12" width="6" height="12" fill="#FF883E"/></svg>`,
};
