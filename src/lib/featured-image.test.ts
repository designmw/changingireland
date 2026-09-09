// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { articleImages, matchesQuery, thumbUrl } from './featured-image';

describe('articleImages', () => {
  it('lists image URLs in document order with a display name', () => {
    const html =
      '<p>Intro</p><p><img src="/files/uploads/editor/2026/08/1786105695991-hall.webp" alt="Hall"></p>' +
      '<p><img src="https://example.org/pics/river.jpg"></p>';
    expect(articleImages(html)).toEqual([
      { url: '/files/uploads/editor/2026/08/1786105695991-hall.webp', name: '1786105695991-hall.webp' },
      { url: 'https://example.org/pics/river.jpg', name: 'river.jpg' },
    ]);
  });

  it('drops duplicates, empty and data: sources', () => {
    const html =
      '<img src="/files/a.webp"><img src="/files/a.webp"><img src=""><img src="   ">' +
      '<img src="data:image/png;base64,AAAA"><img alt="no src">';
    expect(articleImages(html).map((i) => i.url)).toEqual(['/files/a.webp']);
  });

  it('trims whitespace around a source', () => {
    expect(articleImages('<img src="  /files/b.png  ">')[0].url).toBe('/files/b.png');
  });

  it('returns nothing for an article without images', () => {
    expect(articleImages('<p>Just words</p>')).toEqual([]);
    expect(articleImages('')).toEqual([]);
  });
});

describe('thumbUrl', () => {
  it('asks /files/ for the 320px responsive variant', () => {
    expect(thumbUrl('/files/uploads/editor/2026/08/1-a.webp')).toBe('/files/uploads/editor/2026/08/1-a.webp?w=320');
  });

  it('leaves other URLs alone', () => {
    expect(thumbUrl('https://example.org/a.jpg')).toBe('https://example.org/a.jpg');
    expect(thumbUrl('/uploads/2026/05/photo.webp')).toBe('/uploads/2026/05/photo.webp');
  });
});

describe('matchesQuery', () => {
  const img = {
    url: '/files/uploads/2021/12/Protesters-outside-the-Dail.jpg',
    name: 'Protesters-outside-the-Dail.jpg',
  };

  it('matches everything on an empty or blank query', () => {
    expect(matchesQuery(img, '')).toBe(true);
    expect(matchesQuery(img, '   ')).toBe(true);
  });

  it('is case-insensitive and word-order-insensitive', () => {
    expect(matchesQuery(img, 'dail protesters')).toBe(true);
    expect(matchesQuery(img, 'DAIL')).toBe(true);
  });

  it('requires every word to match', () => {
    expect(matchesQuery(img, 'protesters garda')).toBe(false);
  });

  it('searches the folder path too, so a year or month narrows the list', () => {
    expect(matchesQuery(img, '2021/12')).toBe(true);
    expect(matchesQuery(img, '2019')).toBe(false);
  });
});
