/* English copy for the localized pages (/, /book, /book/thanks). The source
   of truth: every other locale is typed against this shape, so a missing or
   misnamed key fails the build. Brand and product names (Vybd, Scout, ...)
   stay in English everywhere. */

export const en = {
    meta: {
        homeTitle: "Hello, World | Vybd",
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

    hero: {
        title: "Hello, World",
        sub: "Whatever you need to enter the US market, start here.",
        inputLabel: "Describe what you need to enter the US market",
        submit: "Submit",
        prev: "Previous example",
        next: "Next example",
        pause: "Pause examples",
        play: "Play examples",
        note: "We take international brands and manufacturers into the US, and run the operations once they're here.",
        /* Slide shown first; the rest follow in their usual order. */
        firstSlide: "spices-india",
        slides: {
            "spices-india": {
                alt: "Worker scooping black peppercorns onto a scale beside sacks of spices in a Kerala processing unit",
                prompt: "Try 'We make spices in India. How do we get into US grocery stores?'",
            },
            "skincare-korea": {
                alt: "Founder filling small serum bottles at a wooden worktable in a sunlit Seoul skincare studio",
                prompt: "Try 'Our skincare brand is big in Korea. Where should we start in the US?'",
            },
            "battery-china": {
                alt: "Worker inspecting a battery cell in a Shenzhen factory",
                prompt: "Try 'We build batteries in China. What do we need to ship them to the US?'",
            },
            "plates-bangladesh": {
                alt: "Worker checking a stack of compostable plant-fiber plates in a tableware factory near Dhaka",
                prompt: "Try 'We make compostable plates in Bangladesh. Who in the US will buy them?'",
            },
            "french-brand": {
                alt: "Man taping a shipping box shut in a stone-walled packing room in Lyon",
                prompt: "Try 'Our French brand sells on Amazon US, but sales are flat. What next?'",
            },
            "retailer-order": {
                alt: "Warehouse worker guiding a forklift loading a pallet of cartons into a shipping container",
                prompt: "Try 'A US retailer wants our product. Can we handle the order?'",
            },
            "port-dawn": {
                alt: "Port worker with a tablet on the quay of a container port at dawn, cranes and a docked ship beyond",
                prompt: "Try 'What will it really cost to land our product in the US?'",
            },
            "robots-china": {
                alt: "Engineer adjusting a white robot arm on a test bench in a Shenzhen robotics workshop",
                prompt: "Try 'We build robots in China. How do we sell and support them in the US?'",
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
        rest: "and runs your operations. No distributor takes your margin, and you keep",
        control: "control",
        end: "of your brand.",
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
        sub: "Brands from India, South Korea and China, now selling in America.",
        before: "Before",
        after: "After",
        done: "Done",
        inProgress: "In progress",
        live: "Live",
        pledgedLabel: "Pledged toward goal",
        notFilled: "Not yet filled in",
        ofGoal: (pledged: string, goal: string) => `${pledged} of ${goal}`,
        asOf: (date: string) => `As of ${date}`,
        goal: (amount: string) => `${amount} goal`,
        inPreorders: (amount: string) => `${amount} in pre-orders`,
        pledged: (amount: string) => `${amount} pledged`,
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
                label: "Kickstarter, live now",
                detail: "Goal: $100,000 in pre-orders",
            },
            karama: {
                category: "Premium underwear",
                label: "Pre-launch",
                headline: "$10,000 in pre-orders before launch",
            },
            ouwr: {
                category: "K-fashion, womenswear",
                label: "Now in the US",
            },
            cellre: {
                category: "K-beauty",
                label: "Now in the US",
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
            "Finding financing",
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

    tech: {
        title: "Proprietary technologies",
        sub: "Agents do the work. Our operators approve every change.",
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
        title: "Ready to bring your products to the US?",
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
        jobs: "Jobs",
        events: "Events",
        compliance: "Compliance",
        support: "Support center",
        investors: "Investors",
        follow: "Follow us",
        partnership: "Partnership inquiries",
        press: "Press inquiries",
        mediaKit: "Download media kit",
        offices: "Offices",
        tagline: "Commerce, Coordinated.",
        taglineSub: "enabling commerce, disabling borders",
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
