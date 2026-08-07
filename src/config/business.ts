/**
 * Per-client business details — edit this file for every new client project.
 * These values feed LocalBusinessSchema (home + contact) and can be pulled
 * into copy elsewhere via import.
 *
 * Common schema.org @type values for Irish SMEs:
 *   Plumber | Electrician | HVACBusiness | Locksmith | Roofer
 *   Attorney | AccountingService | LegalService | FinancialService
 *   HairSalon | BeautySalon | DaySpa | HealthClub
 *   GeneralContractor | HomeAndConstructionBusiness
 *   MedicalBusiness | Dentist | Optician
 *   AutoRepair | CarDealer
 *   Restaurant | CafeOrCoffeeShop
 *   LocalBusiness  ← safe fallback for anything else
 *
 * image must be an absolute URL (e.g. https://example.com/og-business.jpg)
 * or a root-relative path that resolves once the site URL is set.
 */

export interface BusinessConfig {
  name: string;
  legalName?: string;
  /** schema.org @type — see list above */
  type: string;
  url: string;
  telephone: string;
  email?: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2 country code */
    country: string;
  };
  /** Absolute URL or root-relative path to a representative image */
  image: string;
  description?: string;
  /** e.g. ["Mo-Fr 09:00-17:00", "Sa 09:00-13:00"] */
  openingHours?: string[];
  /** e.g. "€€" */
  priceRange?: string;
  /** Social profile URLs for sameAs */
  sameAs?: string[];
  /**
   * Aggregate review rating → ⭐ stars in Google results. ONLY set this with a
   * real rating that is also shown on the site (e.g. a Google/Trustpilot score
   * displayed in a testimonials section). Fabricated ratings breach Google's
   * guidelines and risk a manual penalty. Leave undefined if you have none.
   */
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export const business: BusinessConfig = {
  name: 'Changing Ireland',
  legalName: 'Changing Ireland Community Media CLG',
  // A magazine/publisher, not a shopfront — Organization-ish; LocalBusiness
  // is the safe schema fallback the components support.
  type: 'LocalBusiness',
  url: 'https://changingireland.ie',
  telephone: '+353 61 326057',
  email: 'editor@changingireland.ie',
  address: {
    street: 'Moyross Community Hub, Moyross',
    locality: 'Limerick',
    region: 'Co. Limerick',
    postalCode: 'V94 V0NP',
    country: 'IE',
  },
  image: 'https://changingireland.ie/wp-content/uploads/2026/07/ci-logo.webp',
  description:
    'Changing Ireland is the independent national magazine for community development and social inclusion, published from Moyross, Limerick since 2001.',
  openingHours: ['Mo-Fr 09:00-17:00'],
  sameAs: [
    'https://www.facebook.com/ChangingIrelandMagazine',
    'https://www.instagram.com/changingireland/',
    'https://www.linkedin.com/company/changing-ireland',
    'https://www.youtube.com/user/changingireland',
  ],
  // Only enable with a REAL rating that is also displayed on the site:
  // aggregateRating: { ratingValue: 4.9, reviewCount: 37 },
};
