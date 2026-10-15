// Temporary source of truth for the case-study index until MDX-driven indexing
// lands. Field names match the frontmatter contract, except `years`, which the
// frontmatter does not carry.
//
// headline / summary / role / timeframe were removed 20 Aug 2026. They were
// placeholder tokens ('[OUTCOME METRIC]', '[ROLE]') on all five entries and
// every consumer of this module read none of them. The SEO description that
// looks like it uses `summary` reads MDX frontmatter through
// app/case-studies/[slug]/page.tsx, which imports case-study-routes, not this
// file.
//
// `years` was added 14 Oct 2026 (home cards Rb) and renders on the home card,
// in the muted line under the client. It is not `timeframe` returning: it holds
// Paul's own strings, and nothing else reads it. The rule the removal set still
// stands: do not add a field here before something renders it.

export interface CaseStudy {
  /** Route segment: /case-studies/[slug] */
  slug: string;
  /** First-person problem framing — the card's primary title. */
  problemFraming: string;
  projectName: string;
  client: string;
  /** The card's year range, written with "to" ("2018 to 2019", "2025 to now"). */
  years: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'uscg-bard',
    problemFraming: 'How do 56 jurisdictions align without changing how they work?',
    projectName: 'Bard',
    client: 'U.S. Coast Guard',
    years: '2025 to now',
  },
  {
    slug: 'us-navy-fdt-e',
    problemFraming: 'How do you verify what the AI thinks it saw?',
    projectName: 'FDT-E',
    client: 'U.S. Navy',
    years: '2024 to 2025',
  },
  {
    // Written AFTER the study, per house rule 13. The framing was rewritten in the
    // Dagr build pass, replacing 'What can the enemy see?' with the question the
    // page actually answers: the altitude is the whole point. Section 4's lede
    // comes closest to asking it in those words; the hero role line does not.
    // 'U.S. Air Force' is deliberate, not a typo. Paul worked for the U.S. Navy,
    // designing for Air Force units at Air Combat Command. Same shape
    // as BARD, where a Navy team builds a Coast Guard system. The Role section names
    // the Navy; the client is the Air Force.
    slug: 'us-navy-dagr',
    problemFraming: 'At what altitude can they see me?',
    projectName: 'Line of Sight',
    client: 'U.S. Air Force',
    years: '2020 to 2023',
  },
  {
    // Resolved 1 Sep, and BOTH premises the old note rested on are now false. It said
    // the name was still open and the frontmatter's framing was a flagged placeholder;
    // Paul ruled the name on 1 Sep and picked this framing from a set on the same day,
    // and the TODO the placeholder claim pointed at was removed (the MDX records that
    // at its own note). The house rule it cited, write the study THEN the card, is
    // unchanged and is exactly why this card waited until now.
    //
    // The old framing promised a study about free shipping. "Free shipping" occurs ZERO
    // times in the study's body prose: it survives only in comments recording why the
    // section that asked that question was removed, and in an alt string quoting a
    // screenshot's own copy. The question was retired with the section.
    //
    // problemFraming is ALSO in the MDX frontmatter and both are set to this string.
    // Nothing reads the frontmatter copy today, but two sources for one value that
    // disagree is exactly how the defect above happened.
    slug: 'urbn-delivery-promise',
    problemFraming: 'What does a missed date cost her?',
    projectName: 'Delivery Promise',
    client: 'URBN',
    years: '2018 to 2019',
  },
  {
    slug: 'nuuly',
    problemFraming: 'How does a rented dress get back out in time?',
    projectName: 'Nuuly',
    client: 'URBN',
    years: '2018 to 2019',
  },
];
