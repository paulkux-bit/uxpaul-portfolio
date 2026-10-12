// Source of truth for the home page's "Earlier work" shelf and the dialog each
// row opens (Template B: four agency-era client pieces). The shelf reads
// title, byline, name and industry; the dialog reads everything but brand. It
// replaced app/data/quick-hits.ts, which held the shelf's four fields alone.
//
// Copy and alt text are locked (docs/cc-prompt-template-b-build.md, rulings of
// 11 Oct 2026). Do not edit the words here without Paul. No agency name appears
// anywhere in this file or on either surface.
//
// `brand` is UNUSED since 12 Oct 2026: the shelf dropped its brand colour and
// nothing reads the field. It stays, with QuickHitBrand, until the design
// system pass deletes the brand tokens (docs/unspecified-surfaces.md, Earlier
// work shelf, item 4).
//
// NO RUNTIME IMPORTS, ON PURPOSE. scripts/build-client-work.mjs imports this
// file directly under Node's built-in type stripping, so it must stay plain
// erasable TypeScript with nothing to resolve.

export type QuickHitBrand = 'lionsgate' | 'red-cross' | 'bbc' | 'k-hovnanian';

export interface TemplateBImage {
  /** Path stem under public/, without width or extension. The delivery files
   *  are `${src}-${width}.{avif,webp}`, listed in client-work-images.json,
   *  which scripts/build-client-work.mjs generates. */
  src: string;
  alt: string;
  /** 'whole' shows the image entire and centred with no frame edge (khov-1, a
   *  phone screen). Absent means the image covers the 6:5 frame. */
  fit?: 'whole';
}

export interface TemplateBPiece {
  /** The URL hash that opens this piece: /#lionsgate. */
  slug: 'lionsgate' | 'american-red-cross' | 'bbc' | 'k-hovnanian';
  /** Unused since 12 Oct 2026, deleted with the brand tokens. */
  brand: QuickHitBrand;
  /** The client's name: the visible label of the dialog's previous and next
   *  links. It no longer appears on the shelf, where `byline` names the client. */
  wordmark: string;
  /** Shown as the shelf row's right-aligned meta. */
  industry: string;
  /** Project name: the shelf row title and the first part of the dialog title. */
  title: string;
  /** The second part of the dialog title, and the shelf row's client line. */
  byline: string;
  /** The full name line. It starts with `title`; the h2 renders title then
   *  byline, so its accessible name is this string. Also announced on change,
   *  and the shelf link's accessible name. */
  name: string;
  statement: string;
  paragraph: string;
  images: readonly [TemplateBImage, TemplateBImage, TemplateBImage];
}

/** The role line, the same on all four pieces. */
export const role = 'Lead UX Designer';

/** Shelf and dialog order. Previous and next wrap around. */
export const templateB: readonly TemplateBPiece[] = [
  {
    slug: 'lionsgate',
    brand: 'lionsgate',
    wordmark: 'Lionsgate',
    industry: 'Media',
    title: 'Broadcast Rights Sales',
    byline: 'for Lionsgate',
    name: 'Broadcast Rights Sales for Lionsgate',
    statement:
      'Sales reps traveled with slide decks, DVDs, and posters, and tracked buyers in spreadsheets. One platform replaced it all.',
    paragraph:
      "I led the platform's UX design. Reps picked movies and shows for each buyer, and each buyer got a page introducing their rep. Reps followed all their buyers from one dashboard. Sales conversion rose 20% after launch.",
    images: [
      {
        src: '/client-work/lionsgate/lg-1',
        alt: 'Package builder for Summer Favorites with 12 movies and 4 TV titles, catalog filters, and title cards toggling between Remove and Add to Package.',
      },
      {
        src: '/client-work/lionsgate/lg-2',
        alt: 'Buyer home page welcoming Jason, with a featured title and a panel introducing his rep, her contact details and a personal note.',
      },
      {
        src: '/client-work/lionsgate/lg-3',
        alt: 'Rep dashboard listing four buyers as business-card tiles, each with company, package count and last visit.',
      },
    ],
  },
  {
    slug: 'american-red-cross',
    brand: 'red-cross',
    wordmark: 'American Red Cross',
    industry: 'Nonprofit',
    title: '1-Click Donation',
    byline: 'for the American Red Cross',
    name: '1-Click Donation for the American Red Cross',
    statement:
      "The old checkout made monthly gifts, gifts in someone's honor, and custom amounts hard to give.",
    paragraph:
      'I led UX design for a three-step checkout, with monthly and honor gifts as checkboxes on step one. Returning donors with a saved card gave in one click. A preselected amount the team added raised the average first gift 30%.',
    images: [
      {
        src: '/client-work/american-red-cross/arc-1',
        alt: 'Wireframe of donation step one with a three-step progress bar, preset amounts, a cause menu, monthly and honor-gift checkboxes, and numbered notes.',
      },
      {
        src: '/client-work/american-red-cross/arc-2',
        alt: 'Quick Donate wireframe titled Donate $20 to Hurricane Sandy Relief, with a two-step progress bar and a name and contact form.',
      },
      {
        src: '/client-work/american-red-cross/arc-3',
        alt: 'Red Cross donation form greeting a returning donor by name, with $35 preselected among eight amount buttons.',
      },
    ],
  },
  {
    slug: 'bbc',
    brand: 'bbc',
    wordmark: 'BBC',
    industry: 'Media',
    title: 'Connected Politics',
    byline: 'pitched to the BBC',
    name: 'Connected Politics, pitched to the BBC',
    statement:
      'Our American team pitched the BBC a new way to follow politics, with a working iPad prototype.',
    paragraph:
      "The app would open to news from the reader's area, then to the topics they chose to follow, on any device. I pulled the research together and led the wireframes. We came in second.",
    images: [
      {
        src: '/client-work/bbc/bbc-confusing',
        alt: 'Problem slide: the words Politics is confusing surrounded by party names, politicians and issues such as fracking, wind farms and parking plans.',
      },
      {
        src: '/client-work/bbc/bbc-pillars',
        alt: 'Strategy slide: a stepped pyramid of digital pillars, from Intuitive at the base to Responsive at the top.',
      },
      {
        src: '/client-work/bbc/bbc-3',
        alt: 'Hands holding an iPad running the prototype, a local story above a row of followed topics.',
      },
    ],
  },
  {
    slug: 'k-hovnanian',
    brand: 'k-hovnanian',
    wordmark: 'K. Hovnanian',
    industry: 'Real Estate',
    title: 'Website Redesign',
    byline: 'for K. Hovnanian',
    name: 'Website Redesign for K. Hovnanian',
    statement:
      'We rebuilt the site for phones first, with tools marketing could update on their own.',
    paragraph:
      'I designed the home page to start with location, so shoppers could pick a state or see nearby communities. Then they filtered homes by type, price, and how soon they could move in. We built the site and its tools.',
    images: [
      {
        src: '/client-work/k-hovnanian/khov-1',
        alt: 'Phone home page where search by location follows the hero, with Choose a State and Communities Near Me.',
        fit: 'whole',
      },
      {
        src: '/client-work/k-hovnanian/khov-2',
        alt: 'Community search map with an open filter panel for home type, quick move-in and a $200K to $400K price range.',
      },
      {
        src: '/client-work/k-hovnanian/khov-3',
        alt: 'Home design page pairing a features list and sales contact panels with an interactive first-floor plan.',
      },
    ],
  },
];
