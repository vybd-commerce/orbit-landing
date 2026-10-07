/* English copy for the localized pages (/, /book, /book/thanks). The source
   of truth: every other locale is typed against this shape, so a missing or
   misnamed key fails the build. Brand and product names (Vybd, Scout, ...)
   stay in English everywhere. */

export const en = {
    meta: {
        homeTitle: "US market entry for international brands | Vybd",
        homeDescription:
            "We take international brands and manufacturers into the US, and run the operations once they're here.",
        bookTitle: "Book a US entry call | Vybd",
        thanksTitle: "You're booked | Vybd",
    },

    header: {
        home: "Vybd home",
        menu: "Menu",
        language: "Language",
    },

    /* The Menu button's panel. */
    menu: {
        label: "Site menu",
        close: "Close menu",
        home: "Home",
        howItWorks: "How it works",
        caseStudies: "Case studies",
        about: "About",
        contact: "Contact us",
        privacy: "Privacy",
    },

    hero: {
        title: "Hello, World",
        sub: "You make great products. We handle the rest.",
        inputLabel: "Describe what you need to enter the US market",
        submit: "Submit",
        prev: "Previous example",
        next: "Next example",
        pause: "Pause examples",
        play: "Play examples",
        /* Slide shown first; the rest follow in their usual order. */
        firstSlide: "spices-india",
        slides: {
            "spices-india": {
                alt: "Hands arranging supermarket products in rows on a white worktable, with receipts and sticky notes",
                prompt: "We make spices in India. How do we get into US grocery stores?",
            },
            "skincare-korea": {
                alt: "Designer with a coffee mug comparing packaging printouts pinned to a corkboard in a brick-walled studio",
                prompt: "Our skincare brand is big in Korea. How do we make it work for US shoppers?",
            },
            "battery-china": {
                alt: "Gloved hands pressing a blank label onto a box at a fulfillment center workbench",
                prompt: "Our batteries are made in China. What do US labels and safety rules require?",
            },
            "plates-bangladesh": {
                alt: "Hands lifting a sample jar beside an opened sample box on a conference room table",
                prompt: "We make compostable plates in Bangladesh. Who in the US will buy them?",
            },
            "french-brand": {
                alt: "Worker on an order-picker lift reaching for a carton in a tall warehouse aisle",
                prompt: "Where should we warehouse our stock in the US?",
            },
            "retailer-order": {
                alt: "Worker with a tablet checking a row of shrink-wrapped pallets at a warehouse loading dock",
                prompt: "A US retailer just placed a big order. Can we deliver it?",
            },
            "port-dawn": {
                alt: "Port worker on the quay of a container port at dawn, cranes and a docked ship beyond",
                prompt: "What will it really cost to land our product in the US?",
            },
            "robots-china": {
                alt: "Plain shipping box on the top step of a suburban porch at golden hour",
                prompt: "How do we ship to US customers and handle returns?",
            },
        },
    },

    /* The statement reads, in order:
         Vybd [→] lead [flags] anywhere mid [stamp] redTape rest [print] control end
       Each chip sits glued to the word after it, so translations keep this
       order and fit their own grammar around it. */
    statement: {
        label: "What Vybd does",
        seeHow: "See how it works",
        moreCountries: "Show more countries",
        lead: "brings your products from",
        anywhere: "anywhere",
        mid: "into the US. One partner finds your buyers, clears the",
        redTape: "red tape",
        rest: "and runs your operations. You keep your margin and",
        control: "control",
        end: "of your brand, without signing it over to a distributor.",
    },

    countries: {
        in: "India",
        kr: "South Korea",
        cn: "China",
        fr: "France",
        bd: "Bangladesh",
        jp: "Japan",
        vn: "Vietnam",
        it: "Italy",
        mx: "Mexico",
        th: "Thailand",
        de: "Germany",
        tr: "Turkey",
        id: "Indonesia",
        es: "Spain",
        gb: "United Kingdom",
        ph: "Philippines",
        br: "Brazil",
        pk: "Pakistan",
        us: "United States",
        usa: "USA",
    },

    proof: {
        title: "Already in the US.",
        sub: "Real brands, real US results.",
        before: "Before",
        after: "After",
        done: "Done",
        inProgress: "In progress",
        cards: {
            bayangrom: {
                category: "Art and apparel",
                label: "Inventory and shipping",
                headline: "$180K/yr recovered",
                excess: "Excess inventory",
                shipping: "Shipping cost",
                detail: "−28% excess inventory, −22% shipping cost",
            },
            emsworth: {
                category: "Luxury terry cotton products",
                label: "Wholesale pre-orders",
                headline: "$30,000 in B2B pre-orders",
                wholesale: "Wholesale launch",
                dtc: "Direct-to-consumer store",
                detail: "Now building their direct-to-consumer store",
            },
            sugat: {
                category: "Herbal powders and sustainable food packaging",
                label: "B2B revenue",
                headline: "$25,000 in B2B revenue",
            },
            ollobot: {
                category: "Companion robots",
                label: "Delivery and customer support",
                headline: "5,000 robots delivered",
                detail: "We run their US customer support too",
            },
            karama: {
                category: "Premium underwear",
                label: "Pre-launch",
                headline: "$10,000 in pre-orders before launch",
            },
            ouwr: {
                category: "K-fashion, womenswear",
                label: "Funding",
                headline: "$15,000 raised for their US market entry",
            },
            cellre: {
                category: "K-beauty",
                label: "Funding",
                headline: "$15,000 raised for their US market entry",
            },
        },
    },

    complexity: {
        /* Same order as TASKS in ComplexitySection. */
        tasks: [
            "Channel strategy",
            "US pricing",
            "Marketing",
            "Retail buyers",
            "Entity setup",
            "Sales tax",
            "FDA / FCC rules",
            "Labeling",
            "Customs broker",
            "Importer of record",
            "Tariffs and duties",
            "Freight",
            "Cargo insurance",
            "Funding",
            "3PL warehouse",
            "Returns",
            "Retailer chargebacks",
            "Amazon account",
            "Customer service",
        ],
        groups: { Decide: "Decide", Land: "Land", Run: "Run" },
        captions: [
            "Selling in the US means managing all of this.",
            "Or one relationship instead of nineteen.",
            "You make great products. We handle the rest.",
        ],
        stageLabel:
            "Nineteen tasks for selling in the US, from customs and freight to returns and financing, handled by Vybd under three steps: Decide, Land and Run.",
        you: "You",
    },

    /* The offer, between the nineteen tasks and the tech wall. */
    offer: {
        label: "How we work",
        title: "Start with a US Entry Plan.",
        sub: "Know what the US will take before you spend on it.",
        plan: {
            step: "Step 1",
            name: "US Entry Plan",
            price: "$7,000",
            time: "One month",
            items: [
                "Market research",
                "US pricing and channel strategy",
                "Branding for American shoppers",
                "Compliance: labels, certifications and import rules",
                "Warehousing and logistics plan",
            ],
        },
        build: {
            step: "Step 2",
            name: "Build and run",
            price: "Billed by the work",
            time: "As long as you need us",
            items: [
                "Company setup and launch",
                "Retail buyers and online channels",
                "Financing and funding",
                "Freight, warehousing and fulfillment",
                "Day-to-day US operations",
            ],
        },
        credit: "Go ahead with us after the plan, and your $7,000 is credited against the work.",
    },

    tech: {
        title: "Proprietary technologies",
        more: "And many more",
        helmLabel: "propose · approve",
        tiles: {
            Scout: "Finds and qualifies US retailers and distributors for your products",
            Muse: "Learns your brand's voice and plans US campaigns",
            Prism: "Product photos and video for US channels, without a shoot",
            Helm: "Agents watch inventory, orders and costs, and propose fixes we approve",
            Harbor: "Your US online store, connected to inventory and fulfillment",
        },
    },

    contact: {
        title: "Let's plan your US launch.",
        sub: "30 minutes with an operator, not a salesperson. Pick a time in your own time zone.",
        cta: "Book a call",
    },

    footer: {
        nav: "Footer",
        explore: "Explore",
        howItWorks: "How It Works",
        solutions: "Solutions",
        caseStudies: "Case Studies",
        lab: "Lab",
        company: "Company",
        about: "About us",
        careers: "Careers",
        events: "Events",
        follow: "Follow us",
        partnership: "Partnership inquiries",
        press: "Press inquiries",
        mediaKit: "Download media kit",
        offices: "Offices",
        tagline: "Commerce, Coordinated.",
        privacy: "Privacy and cookie policy",
        terms: "Terms",
        cookies: "Your cookie preferences",
    },

    book: {
        back: "Back",
        title: "Book a US entry call",
        points: [
            "30 minutes on video",
            "With an operator who has brought products into the US",
            "You'll leave with a clear next step, whether or not you work with us",
        ],
        proof: "Brands from these countries already sell in the US with us.",
        pickTime: "Pick a time",
        loading: "Loading available times…",
        failed: "The calendar didn't load.",
        openTab: "Open it in a new tab",
        notConfigured: "Scheduler not configured yet: set BOOKING_URL in src/pages/BookPage.tsx.",
        /* Shown under the scheduler: Calendly can be slow or blocked in some
           countries, mainland China among them. */
        emailFallback: "Calendar not loading? Email us at",
        /* Follows the address directly, so it carries its own leading space. */
        emailFallbackAfter: " and we'll find a time.",
    },

    thanks: {
        title: "You're booked.",
        body: "A calendar invite is on its way. Reply to it with anything you want us to look at before the call (product photos, a price list, your current US channels).",
        back: "Back to Vybd",
    },
};

export type Messages = typeof en;
