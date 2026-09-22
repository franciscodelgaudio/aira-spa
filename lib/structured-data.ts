import {
  faqs,
  fullAddress,
  hours,
  instagram,
  mapsUrl,
  services,
  site,
  siteUrl,
  units,
  type Unit,
} from "@/lib/site";

/**
 * JSON-LD da pagina, em um unico @graph.
 *
 * Por que importa: o Google usa isso para o painel de negocio local e para
 * entender que "Aira Spa" e uma entidade com duas unidades, e os motores de
 * resposta (ChatGPT, Perplexity, AI Overviews) leem JSON-LD antes do HTML
 * porque ele ja vem desambiguado — nome, endereco, horario e catalogo de
 * servicos como dados, nao como prosa a ser interpretada.
 *
 * Um @graph unico com @id cruzados diz explicitamente que as duas unidades sao
 * do mesmo negocio. Dois blocos soltos deixariam essa relacao para adivinhacao.
 */

const id = (fragment: string) => `${siteUrl}/#${fragment}`;

const ORGANIZATION = id("organization");
const WEBSITE = id("website");
const WEBPAGE = id("webpage");
const unitId = (unit: Unit) => id(`unidade-${unit.slug}`);

const postalAddress = (unit: Unit) => ({
  "@type": "PostalAddress",
  streetAddress: unit.address,
  addressLocality: site.city,
  addressRegion: site.region,
  postalCode: unit.postalCode,
  addressCountry: site.country,
});

/**
 * NAO adicione "geo" com coordenada chutada: um pino no lugar errado e pior do
 * que pino nenhum, porque contradiz o endereco. Para preencher de verdade,
 * clique com o botao direito no ponto certo no Google Maps, copie o par
 * latitude/longitude e adicione aqui. Sem isso, o endereco + hasMap ja bastam
 * para o Google geocodificar sozinho.
 */
const openingHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: hours.days,
  opens: hours.opens,
  closes: hours.closes,
};

/** O catalogo de servicos, o que responde "que massagens voces fazem?". */
const offerCatalog = (unit: Unit) => ({
  "@type": "OfferCatalog",
  name: `Massagens e tratamentos — ${unit.name}`,
  itemListElement: services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.name,
      description: service.description,
      serviceType: service.name,
      category: "Massagem e estética",
      provider: { "@id": unitId(unit) },
      areaServed: { "@type": "City", name: site.city },
    },
  })),
});

const localBusiness = (unit: Unit) => ({
  // DaySpa e o tipo especifico; HealthAndBeautyBusiness fica junto porque
  // alguns consumidores de schema so reconhecem o tipo mais generico.
  "@type": ["DaySpa", "HealthAndBeautyBusiness"],
  "@id": unitId(unit),
  name: `${site.name} — ${unit.name.replace(/^Unidade /, "")}`,
  alternateName: site.name,
  description: `${unit.location}, na ${fullAddress(unit)}. Massagem relaxante, candle, escalpes, drenagem linfática, pedras quentes e facial. Não é preciso estar hospedado.`,
  url: `${siteUrl}/`,
  image: `${siteUrl}${site.ogImage}`,
  telephone: unit.phoneE164,
  address: postalAddress(unit),
  hasMap: mapsUrl(unit),
  openingHoursSpecification: openingHours,
  // O spa fica dentro do hotel, mas nao e o hotel. containedInPlace diz isso
  // sem o Google confundir as duas entidades.
  containedInPlace: {
    "@type": "Hotel",
    name: unit.hotel,
    address: postalAddress(unit),
  },
  areaServed: [
    { "@type": "City", name: site.city },
    { "@type": "AdministrativeArea", name: site.regionName },
  ],
  parentOrganization: { "@id": ORGANIZATION },
  sameAs: [instagram.url],
  hasOfferCatalog: offerCatalog(unit),
  // Diz a um agente qual e a acao concreta de agendamento e onde ela acontece.
  potentialAction: {
    "@type": "ReserveAction",
    name: `Agendar no ${site.name}, ${unit.name}`,
    target: {
      "@type": "EntryPoint",
      urlTemplate: unit.whatsapp,
      inLanguage: site.locale,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: { "@type": "Reservation", name: "Agendamento de massagem" },
  },
});

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION,
      name: site.name,
      alternateName: `${site.name} ${site.city}`,
      description: site.summary,
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        "@id": id("logo"),
        url: `${siteUrl}/icon-512.png`,
        width: 512,
        height: 512,
        caption: site.name,
      },
      image: { "@id": id("logo") },
      telephone: units[0].phoneE164,
      address: postalAddress(units[0]),
      areaServed: { "@type": "City", name: site.city },
      sameAs: [instagram.url],
      // As duas unidades sao "departamentos" da mesma marca.
      department: units.map((unit) => ({ "@id": unitId(unit) })),
      knowsLanguage: ["pt-BR"],
    },
    ...units.map(localBusiness),
    {
      "@type": "WebSite",
      "@id": WEBSITE,
      url: `${siteUrl}/`,
      name: site.title,
      description: site.description,
      publisher: { "@id": ORGANIZATION },
      inLanguage: site.locale,
    },
    {
      "@type": "WebPage",
      "@id": WEBPAGE,
      url: `${siteUrl}/`,
      name: site.title,
      description: site.description,
      isPartOf: { "@id": WEBSITE },
      about: { "@id": ORGANIZATION },
      inLanguage: site.locale,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}${site.ogImage}`,
        width: 1200,
        height: 630,
        caption: site.ogImageAlt,
      },
      // Os trechos que um assistente de voz pode ler em voz alta.
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#sec-local h2", "#sec-agendar h2", "#sec-faq"],
      },
    },
    {
      "@type": "FAQPage",
      "@id": id("faq"),
      isPartOf: { "@id": WEBPAGE },
      inLanguage: site.locale,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
} as const;
