import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroBlock } from '@/components/hero-block';

const baseImage = {
  src: '/case-studies/uscg-bard/hero-dashboard-fl.png',
  alt: 'The redesigned Bard dashboard for Florida.',
};

const baseCallout = {
  body: "Operator inattention remains Florida's leading factor this year.",
};

describe('<HeroBlock />', () => {
  it('renders both H1 sentences when title is a tuple', () => {
    render(
      <HeroBlock
        title={['The data was there.', 'The system never spoke.']}
        role="Role line."
        image={baseImage}
      />,
    );
    expect(screen.getByText('The data was there.')).toBeInTheDocument();
    expect(screen.getByText('The system never spoke.')).toBeInTheDocument();

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.querySelectorAll('span.hero-block__sentence')).toHaveLength(2);
    expect(h1.querySelector('.hero-block__sentence--open')).toBeInTheDocument();
    expect(h1.querySelector('.hero-block__sentence--anxious')).toBeInTheDocument();
  });

  it('renders a single sentence when title is a string', () => {
    render(
      <HeroBlock
        title="Just one sentence."
        role="Role line."
        image={baseImage}
      />,
    );
    expect(screen.getByText('Just one sentence.')).toBeInTheDocument();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.querySelectorAll('span.hero-block__sentence')).toHaveLength(1);
  });

  it('renders the role line', () => {
    render(
      <HeroBlock
        title="Title."
        role="Sole designer on the first ground-up replacement of Bard in twenty years."
        image={baseImage}
      />,
    );
    expect(
      screen.getByText(
        'Sole designer on the first ground-up replacement of Bard in twenty years.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the image with the correct alt text when not in placeholder mode', () => {
    render(
      <HeroBlock
        title="Title."
        role="Role."
        image={baseImage}
      />,
    );
    const img = screen.getByAltText(baseImage.alt);
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });

  // E3, L3 and D1 (3 Oct 2026): HeroBlock has no eyebrow and no callout
  // label. The title is the first thing in the type column, and the callout
  // is an unnamed note holding its sentence.
  it('opens the type column on the title, with nothing above it', () => {
    const { container } = render(
      <HeroBlock title="Title." role="Role." image={baseImage} />,
    );
    const first = container.querySelector('.hero-block__type')?.firstElementChild;
    expect(first?.tagName).toBe('H1');
  });

  it('renders the callout as an unnamed note holding its sentence', () => {
    render(
      <HeroBlock
        title="Title."
        role="Role."
        image={baseImage}
        callout={baseCallout}
      />,
    );
    const note = screen.getByRole('note');
    expect(note).not.toHaveAttribute('aria-labelledby');
    expect(note.querySelectorAll('p')).toHaveLength(1);
    expect(note).toHaveTextContent(baseCallout.body);
  });

  it('omits the callout when not provided', () => {
    render(
      <HeroBlock
        title="Title."
        role="Role."
        image={baseImage}
      />,
    );
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('marks the image as the LCP via priority — exactly one element carries it', () => {
    render(
      <HeroBlock
        title="Title."
        role="Role."
        image={baseImage}
        callout={baseCallout}
      />,
    );
    const priorityEls = document.querySelectorAll('[data-priority="true"]');
    expect(priorityEls).toHaveLength(1);
    expect(priorityEls[0].tagName).toBe('IMG');
    expect((priorityEls[0] as HTMLImageElement).alt).toBe(baseImage.alt);
  });

  it('applies the .hero-block layout class on the root <header>', () => {
    const { container } = render(
      <HeroBlock
        title="Title."
        role="Role."
        image={baseImage}
      />,
    );
    const header = container.querySelector('header.hero-block');
    expect(header).toBeInTheDocument();
    // The two-column-at-lg vs single-column-at-<lg behavior is governed by CSS
    // media queries on this same .hero-block class. The CSS is verified visually,
    // not via unit test viewport simulation.
  });

  it('matches the rendered HTML structure snapshot', () => {
    const { container } = render(
      <HeroBlock
        title={['The data was there.', 'The system never spoke.']}
        role="Sole designer on the first ground-up replacement of Bard in twenty years."
        image={{
          src: '/case-studies/uscg-bard/hero-dashboard-fl.png',
          alt: 'The redesigned Bard dashboard for Florida, with one generated insight leading a year of incident data.',
          placeholder: true,
        }}
        callout={{
          body: "Operator inattention remains Florida's leading factor this year.",
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
