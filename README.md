# Metalsmith JSON-LD

This module gives you a convenient way to add JSON-LD markup to all the pages on your Metalsmith site. There are several different ways you can add JSON-LD metadata:

## Setting Global Defaults

Sometimes you'll want to insert the same metadata on EVERY page of your site. To do this, simply add a "defaults" value to your metalsmith-jsonld configuration in metalsmith.json. Ex:

```
"metalsmith-jsonld": {
  "defaults": [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      "name": "Tandem",
      "alternateName": "The site for Tandem, a software strategy firm.",
      "url": "http://www.thinktandem.io"
    },
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "url": "http://www.thinktandem.io",
      "logo": "http://www.thinktandem.io/images/favicon.png",
      "sameAs": [
      "https://www.linkedin.com/company/think-tandem",
      "https://twitter.com/thinktandem"
      ]
    }
  ]
}
```

## Adding Custom Values to a Specific Page.

Other times, you'll want to specify JSON-LD objects for a specific page you're creating. In this case, you can add a "jsonld" property to your frontmatter, and proceed to define an array of JSON-LD objects you'd like added to the page. Here's an example of the frontmatter from our About page:

```
---
layout: pages/about.html
title: Our Story
byline: What does it mean to tandemize?
description: All about Tandem, your friendly digital strategy firm from San Francisco, and the story of its co-founders Alec Reynolds and Mike Pirog.
pageSlug: about
image: /images/working.jpeg
jsonld:
  - "@context": http://schema.org/
    "@type": Person
    name: Alec Reynolds
    jobTitle: Co-founder
    url: http://www.alecreynolds.com
  - "@context": http://schema.org/
    "@type": Person
    name: Mike Pirog
    jobTitle: Co-founder
    url: http://www.twitter.com/pirogcommamike
lastmod: 2016-08-03
---
```

## Adding Default Values to Collections

Finally, for many of your collections that have standardized frontmatter data, it's easiest to use the existing frontmatter to fill-in your JSON-LD (instead of having to specify the same information all over in custom JSON-LD frontmatter). In this case, add a "collections" property to your metalsmith-jsonld config in metalsmith.json that maps your frontmatter data to the JSON-LD schema properties.

For example, this configuration...

```
"metalsmith-jsonld": {
  "collections": {
    "articles": [
      {
        "@context": "http://schema.org", //"http://schema.org" isn't a frontmatter property, so the literal value will be used.
        "@type": "BlogPosting",
        "headline": "title", // "title" is an existing frontmatter property, so whatever the title of this article will be used.
        "alternativeHeadline": "teaser",
        "image": "mainImage",
        "keywords": "tags", 
        "publisher": {
          "@context": "http://schema.org",
          "@type": "Organization",
          "name": "Kalabox Inc. DBA Tandem",
          "url": "http://www.thinktandem.io",
          "logo": "http://www.thinktandem.io/images/favicon.png",
          "sameAs": [
            "https://www.linkedin.com/company/think-tandem",
            "https://twitter.com/thinktandem"
          ]
        },
        "datePublished": "date",
        "dateCreated": "date",
        "description": "teaser",
        "author": {
          "@type": "Person",
          "name": "author"
        }
      }
    ]
  }
}
```

...will produce the following JSON-LD:

```
{
  "@context": "http://schema.org",
  "@type": "BlogPosting",
  "alternativeHeadline": "An introduction to Tandem, who we are, what we do, and why you, a human being with places to go and people to see, should spend some time with us.",
  "author": {
    "@type": "Person",
    "name": "author"
  },
  "dateCreated": "2016-08-03T00:00:00.000Z",
  "datePublished": "2016-08-03T00:00:00.000Z",
  "description": "An introduction to Tandem, who we are, what we do, and why you, a human being with places to go and people to see, should spend some time with us.",
  "headline": "On evading death",
  "image": "holder.js/1000x200/#222:#aaa/text:{{title|slug}}",
  "keywords": [
    "deployment",
    "docker",
    "hosting",
    "localdev",
    "misc",
    "scaling",
    "strategy",
    "support",
    "training",
    "testing"
  ],
  "publisher": {
    "@context": "http://schema.org",
    "@type": "Organization",
    "logo": "http://www.thinktandem.io/images/favicon.png",
    "name": "Kalabox Inc. DBA Tandem",
    "sameAs": [
      "https://www.linkedin.com/company/think-tandem",
      "https://twitter.com/thinktandem"
    ],
    "url": "http://www.thinktandem.io"
  }
}
```

Between these three options, you have some powerful tools to create rich JSON-LD markup and optimize your site's appearance in Google search results!