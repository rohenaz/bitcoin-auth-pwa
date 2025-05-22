import type { AboutPage, Action, AdministrativeArea, AggregateRating, Article, Brand, Certification, ContactPoint, Country, CreativeWork, DefinedTerm, Demand, Distance, EducationalOccupationalCredential, EducationalOrganization, GenderType, GeoShape, Grant, ImageObject, InteractionCounter, Language, LoanOrCredit, MemberProgram, MemberProgramTier, MerchantReturnPolicy, MonetaryAmount, NonprofitType, Occupation, Offer, OfferCatalog, OwnershipInfo, PaymentMethod, Place, PostalAddress, PriceSpecification, Product, ProductReturnPolicy, ProgramMembership, PropertyValue, QuantitativeValue, Review, Role, Text, TextObject, Thing, VirtualLocation, WithContext } from 'schema-dts';
type SchemaValue<T, TProperty extends string> = T | Role<T, TProperty> | readonly (T | Role<T, TProperty>)[];

type IdReference = {
  /** IRI identifying the canonical address of this object. */
  "@id": string;
};

interface ThingBase extends Partial<IdReference> {
  /** An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in. Typically the value is a URI-identified RDF class, and in this case corresponds to the use of rdf:type in RDF. Text values can be used sparingly, for cases where useful information can be added without their being an appropriate schema to reference. In the case of text values, the class label should follow the schema.org {@link https://schema.org/docs/styleguide.html style guide}. */
  "additionalType"?: SchemaValue<Text | URL, "additionalType">;
  /** An alias for the item. */
  "alternateName"?: SchemaValue<Text, "alternateName">;
  /** A description of the item. */
  "description"?: SchemaValue<Text | TextObject | IdReference, "description">;
  /** A sub property of description. A short description of the item used to disambiguate from other, similar items. Information from other properties (in particular, name) may be necessary for the description to be useful for disambiguation. */
  "disambiguatingDescription"?: SchemaValue<Text, "disambiguatingDescription">;
  /** The identifier property represents any kind of identifier for any kind of {@link https://schema.org/Thing Thing}, such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See {@link /docs/datamodel.html#identifierBg background notes} for more details. */
  "identifier"?: SchemaValue<PropertyValue | Text | URL | IdReference, "identifier">;
  /** An image of the item. This can be a {@link https://schema.org/URL URL} or a fully described {@link https://schema.org/ImageObject ImageObject}. */
  "image"?: SchemaValue<ImageObject | URL | IdReference, "image">;
  /** Indicates a page (or other CreativeWork) for which this thing is the main entity being described. See {@link /docs/datamodel.html#mainEntityBackground background notes} for details. */
  "mainEntityOfPage"?: SchemaValue<CreativeWork | URL | IdReference, "mainEntityOfPage">;
  /** The name of the item. */
  "name"?: SchemaValue<Text, "name">;
  /** Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role. */
  "potentialAction"?: SchemaValue<Action | IdReference, "potentialAction">;
  /** URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Wikidata entry, or official website. */
  "sameAs"?: SchemaValue<URL, "sameAs">;
  /** A CreativeWork or Event about this Thing. */
  "subjectOf"?: SchemaValue<CreativeWork | Event | IdReference, "subjectOf">;
  /** URL of the item. */
  "url"?: SchemaValue<URL, "url">;
}

export interface Person extends ThingBase {
  "@type": "Person";
  /** An additional name for a Person, can be used for a middle name. */
  "additionalName"?: SchemaValue<Text, "additionalName">;
  /** Physical address of the item. */
  "address"?: SchemaValue<PostalAddress | Text | IdReference, "address">;
  /** An organization that this person is affiliated with. For example, a school/university, a club, or a team. */
  "affiliation"?: SchemaValue<Organization | IdReference, "affiliation">;
  /** The number of completed interactions for this entity, in a particular role (the 'agent'), in a particular action (indicated in the statistic), and in a particular context (i.e. interactionService). */
  "agentInteractionStatistic"?: SchemaValue<InteractionCounter | IdReference, "agentInteractionStatistic">;
  /** An organization that the person is an alumni of. */
  "alumniOf"?: SchemaValue<EducationalOrganization | Organization | IdReference, "alumniOf">;
  /** An award won by or for this item. */
  "award"?: SchemaValue<Text, "award">;
  /**
   * Awards won by or for this item.
   *
   * @deprecated Consider using https://schema.org/award instead.
   */
  "awards"?: SchemaValue<Text, "awards">;
  /** Date of birth. */
  "birthDate"?: SchemaValue<Date, "birthDate">;
  /** The place where the person was born. */
  "birthPlace"?: SchemaValue<Place | IdReference, "birthPlace">;
  /** The brand(s) associated with a product or service, or the brand(s) maintained by an organization or business person. */
  "brand"?: SchemaValue<Brand | Organization | IdReference, "brand">;
  /** A {@link https://en.wikipedia.org/wiki/Call_sign callsign}, as used in broadcasting and radio communications to identify people, radio and TV stations, or vehicles. */
  "callSign"?: SchemaValue<Text, "callSign">;
  /** A child of the person. */
  "children"?: SchemaValue<Person | IdReference, "children">;
  /** A colleague of the person. */
  "colleague"?: SchemaValue<Person | URL | IdReference, "colleague">;
  /**
   * A colleague of the person.
   *
   * @deprecated Consider using https://schema.org/colleague instead.
   */
  "colleagues"?: SchemaValue<Person | IdReference, "colleagues">;
  /** A contact point for a person or organization. */
  "contactPoint"?: SchemaValue<ContactPoint | IdReference, "contactPoint">;
  /**
   * A contact point for a person or organization.
   *
   * @deprecated Consider using https://schema.org/contactPoint instead.
   */
  "contactPoints"?: SchemaValue<ContactPoint | IdReference, "contactPoints">;
  /** Date of death. */
  "deathDate"?: SchemaValue<Date, "deathDate">;
  /** The place where the person died. */
  "deathPlace"?: SchemaValue<Place | IdReference, "deathPlace">;
  /** The Dun & Bradstreet DUNS number for identifying an organization or business person. */
  "duns"?: SchemaValue<Text, "duns">;
  /** Email address. */
  "email"?: SchemaValue<Text, "email">;
  /** Family name. In the U.S., the last name of a Person. */
  "familyName"?: SchemaValue<Text, "familyName">;
  /** The fax number. */
  "faxNumber"?: SchemaValue<Text, "faxNumber">;
  /** The most generic uni-directional social relation. */
  "follows"?: SchemaValue<Person | IdReference, "follows">;
  /** A person or organization that supports (sponsors) something through some kind of financial contribution. */
  "funder"?: SchemaValue<Organization | Person | IdReference, "funder">;
  /** A {@link https://schema.org/Grant Grant} that directly or indirectly provide funding or sponsorship for this item. See also {@link https://schema.org/ownershipFundingInfo ownershipFundingInfo}. */
  "funding"?: SchemaValue<Grant | IdReference, "funding">;
  /** Gender of something, typically a {@link https://schema.org/Person Person}, but possibly also fictional characters, animals, etc. While https://schema.org/Male and https://schema.org/Female may be used, text strings are also acceptable for people who do not identify as a binary gender. The {@link https://schema.org/gender gender} property can also be used in an extended sense to cover e.g. the gender of sports teams. As with the gender of individuals, we do not try to enumerate all possibilities. A mixed-gender {@link https://schema.org/SportsTeam SportsTeam} can be indicated with a text value of "Mixed". */
  "gender"?: SchemaValue<GenderType | Text | IdReference, "gender">;
  /** Given name. In the U.S., the first name of a Person. */
  "givenName"?: SchemaValue<Text, "givenName">;
  /** The {@link http://www.gs1.org/gln Global Location Number} (GLN, sometimes also referred to as International Location Number or ILN) of the respective organization, person, or place. The GLN is a 13-digit number used to identify parties and physical locations. */
  "globalLocationNumber"?: SchemaValue<Text, "globalLocationNumber">;
  /** Certification information about a product, organization, service, place, or person. */
  "hasCertification"?: SchemaValue<Certification | IdReference, "hasCertification">;
  /** A credential awarded to the Person or Organization. */
  "hasCredential"?: SchemaValue<EducationalOccupationalCredential | IdReference, "hasCredential">;
  /** The Person's occupation. For past professions, use Role for expressing dates. */
  "hasOccupation"?: SchemaValue<Occupation | IdReference, "hasOccupation">;
  /** Indicates an OfferCatalog listing for this Organization, Person, or Service. */
  "hasOfferCatalog"?: SchemaValue<OfferCatalog | IdReference, "hasOfferCatalog">;
  /** Points-of-Sales operated by the organization or person. */
  "hasPOS"?: SchemaValue<Place | IdReference, "hasPOS">;
  /** The height of the item. */
  "height"?: SchemaValue<Distance | QuantitativeValue | IdReference, "height">;
  /** A contact location for a person's residence. */
  "homeLocation"?: SchemaValue<ContactPoint | Place | IdReference, "homeLocation">;
  /** An honorific prefix preceding a Person's name such as Dr/Mrs/Mr. */
  "honorificPrefix"?: SchemaValue<Text, "honorificPrefix">;
  /** An honorific suffix following a Person's name such as M.D./PhD/MSCSW. */
  "honorificSuffix"?: SchemaValue<Text, "honorificSuffix">;
  /** The number of interactions for the CreativeWork using the WebSite or SoftwareApplication. The most specific child type of InteractionCounter should be used. */
  "interactionStatistic"?: SchemaValue<InteractionCounter | IdReference, "interactionStatistic">;
  /** The International Standard of Industrial Classification of All Economic Activities (ISIC), Revision 4 code for a particular organization, business person, or place. */
  "isicV4"?: SchemaValue<Text, "isicV4">;
  /** The job title of the person (for example, Financial Manager). */
  "jobTitle"?: SchemaValue<DefinedTerm | Text | IdReference, "jobTitle">;
  /** The most generic bi-directional social/work relation. */
  "knows"?: SchemaValue<Person | IdReference, "knows">;
  /** Of a {@link https://schema.org/Person Person}, and less typically of an {@link https://schema.org/Organization Organization}, to indicate a topic that is known about - suggesting possible expertise but not implying it. We do not distinguish skill levels here, or relate this to educational content, events, objectives or {@link https://schema.org/JobPosting JobPosting} descriptions. */
  "knowsAbout"?: SchemaValue<Text | Thing | URL | IdReference, "knowsAbout">;
  /** Of a {@link https://schema.org/Person Person}, and less typically of an {@link https://schema.org/Organization Organization}, to indicate a known language. We do not distinguish skill levels or reading/writing/speaking/signing here. Use language codes from the {@link http://tools.ietf.org/html/bcp47 IETF BCP 47 standard}. */
  "knowsLanguage"?: SchemaValue<Language | Text | IdReference, "knowsLanguage">;
  /** A pointer to products or services offered by the organization or person. */
  "makesOffer"?: SchemaValue<Offer | IdReference, "makesOffer">;
  /** An Organization (or ProgramMembership) to which this Person or Organization belongs. */
  "memberOf"?: SchemaValue<MemberProgramTier | Organization | ProgramMembership | IdReference, "memberOf">;
  /** The North American Industry Classification System (NAICS) code for a particular organization or business person. */
  "naics"?: SchemaValue<Text, "naics">;
  /** Nationality of the person. */
  "nationality"?: SchemaValue<Country | IdReference, "nationality">;
  /** The total financial value of the person as calculated by subtracting assets from liabilities. */
  "netWorth"?: SchemaValue<MonetaryAmount | PriceSpecification | IdReference, "netWorth">;
  /** Products owned by the organization or person. */
  "owns"?: SchemaValue<OwnershipInfo | Product | IdReference, "owns">;
  /** A parent of this person. */
  "parent"?: SchemaValue<Person | IdReference, "parent">;
  /**
   * A parents of the person.
   *
   * @deprecated Consider using https://schema.org/parent instead.
   */
  "parents"?: SchemaValue<Person | IdReference, "parents">;
  /** Event that this person is a performer or participant in. */
  "performerIn"?: SchemaValue<Event | IdReference, "performerIn">;
  /**
   * The publishingPrinciples property indicates (typically via {@link https://schema.org/URL URL}) a document describing the editorial principles of an {@link https://schema.org/Organization Organization} (or individual, e.g. a {@link https://schema.org/Person Person} writing a blog) that relate to their activities as a publisher, e.g. ethics or diversity policies. When applied to a {@link https://schema.org/CreativeWork CreativeWork} (e.g. {@link https://schema.org/NewsArticle NewsArticle}) the principles are those of the party primarily responsible for the creation of the {@link https://schema.org/CreativeWork CreativeWork}.
   *
   * While such policies are most typically expressed in natural language, sometimes related information (e.g. indicating a {@link https://schema.org/funder funder}) can be expressed using schema.org terminology.
   */
  "publishingPrinciples"?: SchemaValue<CreativeWork | URL | IdReference, "publishingPrinciples">;
  /** The most generic familial relation. */
  "relatedTo"?: SchemaValue<Person | IdReference, "relatedTo">;
  /** A pointer to products or services sought by the organization or person (demand). */
  "seeks"?: SchemaValue<Demand | IdReference, "seeks">;
  /** A sibling of the person. */
  "sibling"?: SchemaValue<Person | IdReference, "sibling">;
  /**
   * A sibling of the person.
   *
   * @deprecated Consider using https://schema.org/sibling instead.
   */
  "siblings"?: SchemaValue<Person | IdReference, "siblings">;
  /** A statement of knowledge, skill, ability, task or any other assertion expressing a competency that is either claimed by a person, an organization or desired or required to fulfill a role or to work in an occupation. */
  "skills"?: SchemaValue<DefinedTerm | Text | IdReference, "skills">;
  /** A person or organization that supports a thing through a pledge, promise, or financial contribution. E.g. a sponsor of a Medical Study or a corporate sponsor of an event. */
  "sponsor"?: SchemaValue<Organization | Person | IdReference, "sponsor">;
  /** The person's spouse. */
  "spouse"?: SchemaValue<Person | IdReference, "spouse">;
  /** The Tax / Fiscal ID of the organization or person, e.g. the TIN in the US or the CIF/NIF in Spain. */
  "taxID"?: SchemaValue<Text, "taxID">;
  /** The telephone number. */
  "telephone"?: SchemaValue<Text, "telephone">;
  /** The Value-added Tax ID of the organization or person. */
  "vatID"?: SchemaValue<Text, "vatID">;
  /** The weight of the product or person. */
  "weight"?: SchemaValue<QuantitativeValue | IdReference, "weight">;
  /** A contact location for a person's place of work. */
  "workLocation"?: SchemaValue<ContactPoint | Place | IdReference, "workLocation">;
  /** Organizations that the person works for. */
  "worksFor"?: SchemaValue<Organization | IdReference, "worksFor">;
}

export interface Organization extends ThingBase {
  "@type": "Organization";
  /** The payment method(s) that are accepted in general by an organization, or for some specific demand or offer. */
  "acceptedPaymentMethod"?: SchemaValue<LoanOrCredit | PaymentMethod | Text | IdReference, "acceptedPaymentMethod">;
  /** For a {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization} or other news-related {@link https://schema.org/Organization Organization}, a statement about public engagement activities (for news media, the newsroom’s), including involving the public - digitally or otherwise -- in coverage decisions, reporting and activities after publication. */
  "actionableFeedbackPolicy"?: SchemaValue<CreativeWork | URL | IdReference, "actionableFeedbackPolicy">;
  /** Physical address of the item. */
  "address"?: SchemaValue<PostalAddress | Text | IdReference, "address">;
  /** The number of completed interactions for this entity, in a particular role (the 'agent'), in a particular action (indicated in the statistic), and in a particular context (i.e. interactionService). */
  "agentInteractionStatistic"?: SchemaValue<InteractionCounter | IdReference, "agentInteractionStatistic">;
  /** The overall rating, based on a collection of reviews or ratings, of the item. */
  "aggregateRating"?: SchemaValue<AggregateRating | IdReference, "aggregateRating">;
  /** Alumni of an organization. */
  "alumni"?: SchemaValue<Person | IdReference, "alumni">;
  /** The geographic area where a service or offered item is provided. */
  "areaServed"?: SchemaValue<AdministrativeArea | GeoShape | Place | Text | IdReference, "areaServed">;
  /** An award won by or for this item. */
  "award"?: SchemaValue<Text, "award">;
  /**
   * Awards won by or for this item.
   *
   * @deprecated Consider using https://schema.org/award instead.
   */
  "awards"?: SchemaValue<Text, "awards">;
  /** The brand(s) associated with a product or service, or the brand(s) maintained by an organization or business person. */
  "brand"?: SchemaValue<Brand | Organization | IdReference, "brand">;
  /** A contact point for a person or organization. */
  "contactPoint"?: SchemaValue<ContactPoint | IdReference, "contactPoint">;
  /**
   * A contact point for a person or organization.
   *
   * @deprecated Consider using https://schema.org/contactPoint instead.
   */
  "contactPoints"?: SchemaValue<ContactPoint | IdReference, "contactPoints">;
  /** For an {@link https://schema.org/Organization Organization} (e.g. {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization}), a statement describing (in news media, the newsroom’s) disclosure and correction policy for errors. */
  "correctionsPolicy"?: SchemaValue<CreativeWork | URL | IdReference, "correctionsPolicy">;
  /** A relationship between an organization and a department of that organization, also described as an organization (allowing different urls, logos, opening hours). For example: a store with a pharmacy, or a bakery with a cafe. */
  "department"?: SchemaValue<Organization | IdReference, "department">;
  /** The date that this organization was dissolved. */
  "dissolutionDate"?: SchemaValue<Date, "dissolutionDate">;
  /** Statement on diversity policy by an {@link https://schema.org/Organization Organization} e.g. a {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization}. For a {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization}, a statement describing the newsroom’s diversity policy on both staffing and sources, typically providing staffing data. */
  "diversityPolicy"?: SchemaValue<CreativeWork | URL | IdReference, "diversityPolicy">;
  /** For an {@link https://schema.org/Organization Organization} (often but not necessarily a {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization}), a report on staffing diversity issues. In a news context this might be for example ASNE or RTDNA (US) reports, or self-reported. */
  "diversityStaffingReport"?: SchemaValue<Article | URL | IdReference, "diversityStaffingReport">;
  /** The Dun & Bradstreet DUNS number for identifying an organization or business person. */
  "duns"?: SchemaValue<Text, "duns">;
  /** Email address. */
  "email"?: SchemaValue<Text, "email">;
  /** Someone working for this organization. */
  "employee"?: SchemaValue<Person | IdReference, "employee">;
  /**
   * People working for this organization.
   *
   * @deprecated Consider using https://schema.org/employee instead.
   */
  "employees"?: SchemaValue<Person | IdReference, "employees">;
  /** Statement about ethics policy, e.g. of a {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization} regarding journalistic and publishing practices, or of a {@link https://schema.org/Restaurant Restaurant}, a page describing food source policies. In the case of a {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization}, an ethicsPolicy is typically a statement describing the personal, organizational, and corporate standards of behavior expected by the organization. */
  "ethicsPolicy"?: SchemaValue<CreativeWork | URL | IdReference, "ethicsPolicy">;
  /** Upcoming or past event associated with this place, organization, or action. */
  "event"?: SchemaValue<Event | IdReference, "event">;
  /**
   * Upcoming or past events associated with this place or organization.
   *
   * @deprecated Consider using https://schema.org/event instead.
   */
  "events"?: SchemaValue<Event | IdReference, "events">;
  /** The fax number. */
  "faxNumber"?: SchemaValue<Text, "faxNumber">;
  /** A person or organization who founded this organization. */
  "founder"?: SchemaValue<Organization | Person | IdReference, "founder">;
  /**
   * A person who founded this organization.
   *
   * @deprecated Consider using https://schema.org/founder instead.
   */
  "founders"?: SchemaValue<Person | IdReference, "founders">;
  /** The date that this organization was founded. */
  "foundingDate"?: SchemaValue<Date, "foundingDate">;
  /** The place where the Organization was founded. */
  "foundingLocation"?: SchemaValue<Place | IdReference, "foundingLocation">;
  /** A person or organization that supports (sponsors) something through some kind of financial contribution. */
  "funder"?: SchemaValue<Organization | Person | IdReference, "funder">;
  /** A {@link https://schema.org/Grant Grant} that directly or indirectly provide funding or sponsorship for this item. See also {@link https://schema.org/ownershipFundingInfo ownershipFundingInfo}. */
  "funding"?: SchemaValue<Grant | IdReference, "funding">;
  /** The {@link http://www.gs1.org/gln Global Location Number} (GLN, sometimes also referred to as International Location Number or ILN) of the respective organization, person, or place. The GLN is a 13-digit number used to identify parties and physical locations. */
  "globalLocationNumber"?: SchemaValue<Text, "globalLocationNumber">;
  /** Certification information about a product, organization, service, place, or person. */
  "hasCertification"?: SchemaValue<Certification | IdReference, "hasCertification">;
  /** A credential awarded to the Person or Organization. */
  "hasCredential"?: SchemaValue<EducationalOccupationalCredential | IdReference, "hasCredential">;
  /**
   * The {@link https://www.gs1.org/standards/gs1-digital-link GS1 digital link} associated with the object. This URL should conform to the particular requirements of digital links. The link should only contain the Application Identifiers (AIs) that are relevant for the entity being annotated, for instance a [[Product]] or an [[Organization]], and for the correct granularity. In particular, for products:- A Digital Link that contains a serial number (AI `21`) should only be present on instances of [[IndividualProduct]]
   * - A Digital Link that contains a lot number (AI `10`) should be annotated as [[SomeProduct]] if only products from that lot are sold, or [[IndividualProduct]] if there is only a specific product.
   * - A Digital Link that contains a global model number (AI `8013`) should be attached to a [[Product]] or a [[ProductModel]].
   * Other item types should be adapted similarly.
   */
  "hasGS1DigitalLink"?: SchemaValue<URL, "hasGS1DigitalLink">;
  /** MemberProgram offered by an Organization, for example an eCommerce merchant or an airline. */
  "hasMemberProgram"?: SchemaValue<MemberProgram | IdReference, "hasMemberProgram">;
  /** Specifies a MerchantReturnPolicy that may be applicable. */
  "hasMerchantReturnPolicy"?: SchemaValue<MerchantReturnPolicy | IdReference, "hasMerchantReturnPolicy">;
  /** Indicates an OfferCatalog listing for this Organization, Person, or Service. */
  "hasOfferCatalog"?: SchemaValue<OfferCatalog | IdReference, "hasOfferCatalog">;
  /** Points-of-Sales operated by the organization or person. */
  "hasPOS"?: SchemaValue<Place | IdReference, "hasPOS">;
  /**
   * Indicates a ProductReturnPolicy that may be applicable.
   *
   * @deprecated Consider using https://schema.org/hasMerchantReturnPolicy instead.
   */
  "hasProductReturnPolicy"?: SchemaValue<ProductReturnPolicy | IdReference, "hasProductReturnPolicy">;
  /** The number of interactions for the CreativeWork using the WebSite or SoftwareApplication. The most specific child type of InteractionCounter should be used. */
  "interactionStatistic"?: SchemaValue<InteractionCounter | IdReference, "interactionStatistic">;
  /** The International Standard of Industrial Classification of All Economic Activities (ISIC), Revision 4 code for a particular organization, business person, or place. */
  "isicV4"?: SchemaValue<Text, "isicV4">;
  /** An organization identifier as defined in {@link https://en.wikipedia.org/wiki/ISO/IEC_6523 ISO 6523(-1)}. The identifier should be in the `XXXX:YYYYYY:ZZZ` or `XXXX:YYYYYY`format. Where `XXXX` is a 4 digit _ICD_ (International Code Designator), `YYYYYY` is an _OID_ (Organization Identifier) with all formatting characters (dots, dashes, spaces) removed with a maximal length of 35 characters, and `ZZZ` is an optional OPI (Organization Part Identifier) with a maximum length of 35 characters. The various components (ICD, OID, OPI) are joined with a colon character (ASCII `0x3a`). Note that many existing organization identifiers defined as attributes like {@link https://schema.org/leiCode leiCode} (`0199`), {@link https://schema.org/duns duns} (`0060`) or {@link https://schema.org/globalLocationNumber GLN} (`0088`) can be expressed using ISO-6523. If possible, ISO-6523 codes should be preferred to populating {@link https://schema.org/vatID vatID} or {@link https://schema.org/taxID taxID}, as ISO identifiers are less ambiguous. */
  "iso6523Code"?: SchemaValue<Text, "iso6523Code">;
  /** Keywords or tags used to describe some item. Multiple textual entries in a keywords list are typically delimited by commas, or by repeating the property. */
  "keywords"?: SchemaValue<DefinedTerm | Text | URL | IdReference, "keywords">;
  /** Of a {@link https://schema.org/Person Person}, and less typically of an {@link https://schema.org/Organization Organization}, to indicate a topic that is known about - suggesting possible expertise but not implying it. We do not distinguish skill levels here, or relate this to educational content, events, objectives or {@link https://schema.org/JobPosting JobPosting} descriptions. */
  "knowsAbout"?: SchemaValue<Text | Thing | URL | IdReference, "knowsAbout">;
  /** Of a {@link https://schema.org/Person Person}, and less typically of an {@link https://schema.org/Organization Organization}, to indicate a known language. We do not distinguish skill levels or reading/writing/speaking/signing here. Use language codes from the {@link http://tools.ietf.org/html/bcp47 IETF BCP 47 standard}. */
  "knowsLanguage"?: SchemaValue<Language | Text | IdReference, "knowsLanguage">;
  /** The official name of the organization, e.g. the registered company name. */
  "legalName"?: SchemaValue<Text, "legalName">;
  /** An organization identifier that uniquely identifies a legal entity as defined in ISO 17442. */
  "leiCode"?: SchemaValue<Text, "leiCode">;
  /** The location of, for example, where an event is happening, where an organization is located, or where an action takes place. */
  "location"?: SchemaValue<Place | PostalAddress | Text | VirtualLocation | IdReference, "location">;
  /** An associated logo. */
  "logo"?: SchemaValue<ImageObject | URL | IdReference, "logo">;
  /** A pointer to products or services offered by the organization or person. */
  "makesOffer"?: SchemaValue<Offer | IdReference, "makesOffer">;
  /** A member of an Organization or a ProgramMembership. Organizations can be members of organizations; ProgramMembership is typically for individuals. */
  "member"?: SchemaValue<Organization | Person | IdReference, "member">;
  /** An Organization (or ProgramMembership) to which this Person or Organization belongs. */
  "memberOf"?: SchemaValue<MemberProgramTier | Organization | ProgramMembership | IdReference, "memberOf">;
  /**
   * A member of this organization.
   *
   * @deprecated Consider using https://schema.org/member instead.
   */
  "members"?: SchemaValue<Organization | Person | IdReference, "members">;
  /** The North American Industry Classification System (NAICS) code for a particular organization or business person. */
  "naics"?: SchemaValue<Text, "naics">;
  /** nonprofitStatus indicates the legal status of a non-profit organization in its primary place of business. */
  "nonprofitStatus"?: SchemaValue<NonprofitType | IdReference, "nonprofitStatus">;
  /** The number of employees in an organization, e.g. business. */
  "numberOfEmployees"?: SchemaValue<QuantitativeValue | IdReference, "numberOfEmployees">;
  /** For an {@link https://schema.org/Organization Organization} (often but not necessarily a {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization}), a description of organizational ownership structure; funding and grants. In a news/media setting, this is with particular reference to editorial independence. Note that the {@link https://schema.org/funder funder} is also available and can be used to make basic funder information machine-readable. */
  "ownershipFundingInfo"?: SchemaValue<AboutPage | CreativeWork | Text | URL | IdReference, "ownershipFundingInfo">;
  /** Products owned by the organization or person. */
  "owns"?: SchemaValue<OwnershipInfo | Product | IdReference, "owns">;
  /** The larger organization that this organization is a {@link https://schema.org/subOrganization subOrganization} of, if any. */
  "parentOrganization"?: SchemaValue<Organization | IdReference, "parentOrganization">;
  /**
   * The publishingPrinciples property indicates (typically via {@link https://schema.org/URL URL}) a document describing the editorial principles of an {@link https://schema.org/Organization Organization} (or individual, e.g. a {@link https://schema.org/Person Person} writing a blog) that relate to their activities as a publisher, e.g. ethics or diversity policies. When applied to a {@link https://schema.org/CreativeWork CreativeWork} (e.g. {@link https://schema.org/NewsArticle NewsArticle}) the principles are those of the party primarily responsible for the creation of the {@link https://schema.org/CreativeWork CreativeWork}.
   *
   * While such policies are most typically expressed in natural language, sometimes related information (e.g. indicating a {@link https://schema.org/funder funder}) can be expressed using schema.org terminology.
   */
  "publishingPrinciples"?: SchemaValue<CreativeWork | URL | IdReference, "publishingPrinciples">;
  /** A review of the item. */
  "review"?: SchemaValue<Review | IdReference, "review">;
  /**
   * Review of the item.
   *
   * @deprecated Consider using https://schema.org/review instead.
   */
  "reviews"?: SchemaValue<Review | IdReference, "reviews">;
  /** A pointer to products or services sought by the organization or person (demand). */
  "seeks"?: SchemaValue<Demand | IdReference, "seeks">;
  /**
   * The geographic area where the service is provided.
   *
   * @deprecated Consider using https://schema.org/areaServed instead.
   */
  "serviceArea"?: SchemaValue<AdministrativeArea | GeoShape | Place | IdReference, "serviceArea">;
  /** A statement of knowledge, skill, ability, task or any other assertion expressing a competency that is either claimed by a person, an organization or desired or required to fulfill a role or to work in an occupation. */
  "skills"?: SchemaValue<DefinedTerm | Text | IdReference, "skills">;
  /** A slogan or motto associated with the item. */
  "slogan"?: SchemaValue<Text, "slogan">;
  /** A person or organization that supports a thing through a pledge, promise, or financial contribution. E.g. a sponsor of a Medical Study or a corporate sponsor of an event. */
  "sponsor"?: SchemaValue<Organization | Person | IdReference, "sponsor">;
  /** A relationship between two organizations where the first includes the second, e.g., as a subsidiary. See also: the more specific 'department' property. */
  "subOrganization"?: SchemaValue<Organization | IdReference, "subOrganization">;
  /** The Tax / Fiscal ID of the organization or person, e.g. the TIN in the US or the CIF/NIF in Spain. */
  "taxID"?: SchemaValue<Text, "taxID">;
  /** The telephone number. */
  "telephone"?: SchemaValue<Text, "telephone">;
  /** For an {@link https://schema.org/Organization Organization} (typically a {@link https://schema.org/NewsMediaOrganization NewsMediaOrganization}), a statement about policy on use of unnamed sources and the decision process required. */
  "unnamedSourcesPolicy"?: SchemaValue<CreativeWork | URL | IdReference, "unnamedSourcesPolicy">;
  /** The Value-added Tax ID of the organization or person. */
  "vatID"?: SchemaValue<Text, "vatID">;
}

export interface APIIdentityAddress {
  address: string;
  txId: string;
  block: number;
}
export type APISchemaIdentity = Person | Organization & {
  bitcoinAddress: string;
};
export interface APIIdentity {
  idKey: string;
  firstSeen: number;
  rootAddress: string;
  currentAddress: string;
  addresses: APIIdentityAddress[];
  identity?: APISchemaIdentity;
}

export interface APIResponse<T> {
status: 'success' | 'error';
result?: T;
message?: string;
}