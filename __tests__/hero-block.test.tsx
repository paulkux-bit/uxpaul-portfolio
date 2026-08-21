import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroBlock } from '@/components/hero-block';

const baseImage = {
  src: '/case-studies/uscg-bard/hero-dashboard-fl.png',
  alt: 'The redesigned BARD dashboard for Florida.',
};

const baseCallout = {
  label: 'GENERATED INSIGHT',
  body: "Operator inattention remains Florida's leading factor this year.",
};

describe('<HeroBlock />', () => {
  it('renders the eyebrow text exactly as passed', () => {
    render(
      <HeroBlock
        eyebrow="BARD · U.S. COAST GUARD"
        title="Single sentence."
        role="Role line."
        image={baseImage}
      />,
    );
    expect(screen.getByText('BARD · U.S. COAST GUARD')).toBeInTheDocument();
  });

  it('renders both H1 sentences when title is a tuple', () => {
    render(
      <HeroBlock
        eyebrow="EYEBROW"
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
        eyebrow="EYEBROW"
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
        eyebrow="EYEBROW"
        title="Title."
        role="Sole designer on the first ground-up replacement of BARD in twenty years."
        image={baseImage}
      />,
    );
    expect(
      screen.getByText(
        'Sole designer on the first ground-up replacement of BARD in twenty years.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the image with the correct alt text when not in placeholder mode', () => {
    render(
      <HeroBlock
        eyebrow="EYEBROW"
        title="Title."
        role="Role."
        image={baseImage}
      />,
    );
    const img = screen.getByAltText(baseImage.alt);
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });

  it('renders the callout when provided (label + body + aria role/label)', () => {
    render(
      <HeroBlock
        eyebrow="EYEBROW"
        title="Title."
        role="Role."
        image={baseImage}
        callout={baseCallout}
      />,
    );
    const callout = screen.getByRole('note', { name: 'GENERATED INSIGHT' });
    expect(callout).toBeInTheDocument();
    expect(screen.getByText('GENERATED INSIGHT')).toBeInTheDocument();
    expect(
      screen.getByText("Operator inattention remains Florida's leading factor this year."),
    ).toBeInTheDocument();
  });

  it('omits the callout when not provided', () => {
    render(
      <HeroBlock
        eyebrow="EYEBROW"
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
        eyebrow="EYEBROW"
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
        eyebrow="EYEBROW"
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
        eyebrow="BARD · U.S. COAST GUARD"
        title={['The data was there.', 'The system never spoke.']}
        role="Sole designer on the first ground-up replacement of BARD in twenty years."
        image={{
          src: '/case-studies/uscg-bard/hero-dashboard-fl.png',
          alt: 'The redesigned BARD dashboard for Florida, with one generated insight leading a year of incident data.',
          placeholder: true,
        }}
        callout={{
          label: 'GENERATED INSIGHT',
          body: "Operator inattention remains Florida's leading factor this year.",
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
