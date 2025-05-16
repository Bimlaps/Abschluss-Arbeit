/**
 * SEO Service für die Verwaltung von Meta-Tags und strukturierten Daten
 */
export const generateMetaTags = (pageData) => {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
  } = pageData;

  return {
    title: title,
    meta: [
      {
        name: 'description',
        content: description
      },
      {
        name: 'keywords',
        content: keywords
      },
      // Open Graph Tags
      {
        property: 'og:title',
        content: title
      },
      {
        property: 'og:description',
        content: description
      },
      {
        property: 'og:image',
        content: image
      },
      {
        property: 'og:url',
        content: url
      },
      {
        property: 'og:type',
        content: type
      },
      // Twitter Cards
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: title
      },
      {
        name: 'twitter:description',
        content: description
      },
      {
        name: 'twitter:image',
        content: image
      }
    ]
  };
};

/**
 * Generiert strukturierte Daten für lokale Geschäfte (Handwerker)
 */
export const generateLocalBusinessSchema = (businessData) => {
  const {
    name,
    description,
    image,
    address,
    telephone,
    email,
    url,
    openingHours,
    priceRange
  } = businessData;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    image,
    address: {
      '@type': 'PostalAddress',
      ...address
    },
    telephone,
    email,
    url,
    openingHoursSpecification: openingHours,
    priceRange
  };
};

/**
 * Generiert Breadcrumb-strukturierte Daten
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}; 