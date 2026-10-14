/*
  SITE-WIDE SETTINGS
  Edit the values below. Keep the quotes and the commas.
  These show up in the menu, the footer and the contact page on every page.
*/
window.SITE = {
  name: 'Serpento',

  // Main contact address. Shared inbox, forwarded by Cloudflare Email Routing.
  email: 'team@serpento.io',

  location: 'Calgary, Alberta, Canada',

  // Short line under the logo in the footer.
  tagline: 'Surgical robotics research and development, based at the University of Calgary in Alberta, Canada.',

  // Legal name shown in the copyright line. The year updates by itself.
  legalName: '2769250 Alberta Ltd.',

  disclaimer: 'Serpento devices are in research and development and are not available for clinical use.',

  /*
    Contact form. Leave empty ('') and the form asks people to email instead.
    To make it send real messages, create a free form at https://formspree.io
    and paste its endpoint here, for example: 'https://formspree.io/f/abcdwxyz'
  */
  formEndpoint: 'https://formspree.io/f/moejpqej',

  // Menu. "page" must match data-page on the <body> of that page.
  // To add a page: copy an existing .html page, rename it, then add a line here.
  nav: [
    { label: 'Mission & approach', href: 'index.html', page: 'home' },
    { label: 'Research & publications', href: 'research.html', page: 'research' },
    { label: 'Team', href: 'team.html', page: 'team' },
    { label: 'Contact', href: 'contact.html', page: 'contact', button: true },
  ],
};
