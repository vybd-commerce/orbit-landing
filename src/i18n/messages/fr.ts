import type { Messages } from "./en";

/* French. Formal "vous"; non-breaking spaces (\u00a0) before ? ! : and inside
   « » so they never start a line on their own. */
export const fr: Messages = {
    meta: {
        homeTitle: "Entrer sur le marché américain | Vybd",
        homeDescription:
            "Nous accompagnons les marques et fabricants internationaux sur le marché américain, puis nous gérons leurs opérations sur place.",
        bookTitle: "Nous contacter | Vybd",
        thanksTitle: "Merci | Vybd",
    },

    header: {
        home: "Accueil Vybd",
        menu: "Menu",
        language: "Langue",
    },

    menu: {
        label: "Menu du site",
        close: "Fermer le menu",
        home: "Accueil",
        howItWorks: "Comment ça marche",
        caseStudies: "Études de cas",
        about: "À propos",
        contact: "Nous contacter",
        privacy: "Confidentialité",
    },

    hero: {
        title: "Bonjour, le monde",
        sub: "Vous faites de bons produits. Nous nous occupons du reste.",
        inputLabel: "Décrivez ce dont vous avez besoin pour entrer sur le marché américain",
        submit: "Envoyer",
        prev: "Exemple précédent",
        next: "Exemple suivant",
        pause: "Mettre les exemples en pause",
        play: "Lire les exemples",
        firstSlide: "french-brand",
        slides: {
            "spices-india": {
                alt: "Mains alignant des produits de supermarché sur une table blanche, entre tickets de caisse et post-it",
                prompt: "Nous produisons des épices en Inde. Comment entrer dans les supermarchés américains ?",
            },
            "skincare-korea": {
                alt: "Designer, tasse à la main, comparant des maquettes d'emballage épinglées dans un atelier en briques",
                prompt: "Notre marque de soins cartonne en Corée. Comment séduire les consommateurs américains ?",
            },
            "battery-china": {
                alt: "Mains gantées posant une étiquette vierge sur un carton dans un centre logistique",
                prompt: "Nos batteries sont fabriquées en Chine. Quelles règles d'étiquetage et de sécurité aux États-Unis ?",
            },
            "plates-bangladesh": {
                alt: "Mains soulevant un pot d'échantillon près d'un colis ouvert sur une table de réunion",
                prompt: "Nous fabriquons des assiettes compostables au Bangladesh. Qui va les acheter aux États-Unis ?",
            },
            "french-brand": {
                alt: "Préparateur sur une nacelle attrapant un carton dans une haute allée d'entrepôt",
                prompt: "Où stocker notre marchandise aux États-Unis ?",
            },
            "retailer-order": {
                alt: "Magasinier vérifiant sur une tablette une rangée de palettes filmées sur un quai de chargement",
                prompt: "Un détaillant américain vient de passer une grosse commande. Pouvons-nous livrer ?",
            },
            "port-dawn": {
                alt: "Agent portuaire sur le quai d'un port à conteneurs à l'aube, grues et navire à quai au loin",
                prompt: "Combien coûte vraiment l'arrivée de notre produit aux États-Unis ?",
            },
            "robots-china": {
                alt: "Carton d'expédition posé sur la marche d'un porche de banlieue à l'heure dorée",
                prompt: "Comment livrer nos clients américains et gérer les retours ?",
            },
        },
    },

    statement: {
        label: "Ce que fait Vybd",
        seeHow: "Voir comment ça marche",
        moreCountries: "Afficher d'autres pays",
        lead: "amène vos produits du",
        anywhere: "monde entier",
        mid: "aux États-Unis. Un seul partenaire trouve vos acheteurs, gère la",
        redTape: "paperasse",
        rest: "et pilote vos opérations. Vous gardez votre marge et le",
        control: "contrôle",
        end: "de votre marque, sans les céder à un distributeur.",
    },

    countries: {
        in: "Inde",
        kr: "Corée du Sud",
        cn: "Chine",
        fr: "France",
        bd: "Bangladesh",
        jp: "Japon",
        vn: "Viêt Nam",
        it: "Italie",
        mx: "Mexique",
        th: "Thaïlande",
        de: "Allemagne",
        tr: "Turquie",
        id: "Indonésie",
        es: "Espagne",
        gb: "Royaume-Uni",
        ph: "Philippines",
        br: "Brésil",
        pk: "Pakistan",
        us: "États-Unis",
        usa: "États-Unis",
    },

    proof: {
        title: "Déjà aux États-Unis.",
        sub: "De vraies marques, de vrais résultats aux États-Unis.",
        before: "Avant",
        after: "Après",
        done: "Terminé",
        inProgress: "En cours",
        cards: {
            bayangrom: {
                category: "Art et habillement",
                label: "Stocks et expédition",
                headline: "$180K récupérés par an",
                excess: "Stock excédentaire",
                shipping: "Coût d'expédition",
                detail: "−28\u00a0% de stock excédentaire, −22\u00a0% de coût d'expédition",
            },
            mib: {
                category: "Produits de luxe en éponge de coton",
                label: "Précommandes de gros",
                headline: "$30,000 de précommandes B2B",
                wholesale: "Lancement en gros",
                dtc: "Boutique en direct",
                detail: "Construit désormais sa boutique en direct",
            },
            sugat: {
                category: "Poudres de plantes et emballages alimentaires durables",
                label: "Chiffre d'affaires B2B",
                headline: "$25,000 de chiffre d'affaires B2B",
            },
            ollobot: {
                category: "Robots de compagnie",
                label: "Livraison et service client",
                headline: "5000 robots livrés",
                detail: "Nous gérons aussi leur service client aux États-Unis",
            },
            karama: {
                category: "Sous-vêtements haut de gamme",
                label: "Avant le lancement",
                headline: "$10,000 de précommandes avant le lancement",
            },
            ouwr: {
                category: "Mode coréenne, prêt-à-porter féminin",
                label: "Financement",
                headline: "$15,000 levés pour leur entrée aux États-Unis",
            },
            cellre: {
                category: "Beauté coréenne",
                label: "Financement",
                headline: "$15,000 levés pour leur entrée aux États-Unis",
            },
        },
    },

    complexity: {
        tasks: [
            "Stratégie de canaux",
            "Prix aux États-Unis",
            "Marketing",
            "Acheteurs retail",
            "Création de l'entité",
            "Taxe de vente",
            "Règles FDA / FCC",
            "Étiquetage",
            "Commissionnaire en douane",
            "Importateur officiel",
            "Droits de douane",
            "Fret",
            "Assurance marchandises",
            "Financement",
            "Entrepôt 3PL",
            "Retours",
            "Pénalités distributeurs",
            "Compte Amazon",
            "Service client",
        ],
        groups: { Decide: "Décider", Land: "Implanter", Run: "Opérer" },
        captions: [
            "Vendre aux États-Unis, c'est gérer tout cela.",
            "Ou un seul interlocuteur au lieu de dix-neuf.",
            "Vous faites d'excellents produits. Nous gérons le reste.",
        ],
        stageLabel:
            "Dix-neuf tâches pour vendre aux États-Unis, de la douane et du fret aux retours et au financement, prises en charge par Vybd en trois étapes\u00a0: Décider, Implanter et Opérer.",
        you: "Vous",
    },

    offer: {
        label: "Notre façon de travailler",
        title: "Commencez par un plan d'entrée aux États-Unis.",
        sub: "Sachez ce que le marché américain demande avant d'y investir.",
        plan: {
            step: "Étape 1",
            name: "Plan d'entrée aux États-Unis",
            price: "$7,000",
            time: "Un mois",
            items: [
                "Étude de marché",
                "Prix et stratégie de canaux aux États-Unis",
                "Une marque pensée pour les consommateurs américains",
                "Conformité : étiquetage, certifications et règles d'importation",
                "Plan d'entreposage et de logistique",
            ],
        },
        build: {
            step: "Étape 2",
            name: "Lancer et opérer",
            price: "Facturé selon le travail",
            time: "Aussi longtemps qu'il le faut",
            items: [
                "Création de société et lancement",
                "Acheteurs de la distribution et canaux en ligne",
                "Financement et levée de fonds",
                "Fret, entreposage et exécution des commandes",
                "Opérations quotidiennes aux États-Unis",
            ],
        },
        credit: "Si vous poursuivez avec nous après le plan, vos $7,000 sont déduits des travaux suivants.",
    },

    tech: {
        title: "Technologies propriétaires",
        more: "Et bien d'autres",
        helmLabel: "proposer · valider",
        tiles: {
            Scout: "Trouve et qualifie des détaillants et distributeurs américains pour vos produits",
            Muse: "Apprend la voix de votre marque et planifie vos campagnes américaines",
            Prism: "Photos et vidéos produit pour les canaux américains, sans tournage",
            Helm: "Des agents surveillent stocks, commandes et coûts, et proposent des correctifs que nous validons",
            Harbor: "Votre boutique en ligne américaine, connectée aux stocks et à la logistique",
        },
    },

    contact: {
        title: "Planifions votre lancement aux États-Unis.",
        sub: "Parlez-nous un peu de votre marque. Un opérateur, pas un commercial, vous répondra par e-mail.",
        cta: "Nous contacter",
    },

    footer: {
        nav: "Pied de page",
        explore: "Explorer",
        howItWorks: "Comment ça marche",
        solutions: "Solutions",
        caseStudies: "Études de cas",
        lab: "Lab",
        company: "Entreprise",
        about: "À propos",
        careers: "Carrières",
        events: "Événements",
        rainmaker: "Devenir partenaire",
        follow: "Suivez-nous",
        partnership: "Partenariats",
        press: "Presse",
        mediaKit: "Télécharger le kit média",
        tagline: "Commerce, Coordinated.",
        privacy: "Politique de confidentialité et cookies",
        terms: "Conditions",
    },

    book: {
        back: "Retour",
        title: "Parler à Vybd",
        points: [
            "Deux questions courtes, moins d'une minute",
            "Lu par un opérateur qui a déjà lancé des produits aux États-Unis",
            "Nous répondons par e-mail avec une prochaine étape claire, que vous travailliez avec nous ou non",
        ],
        proof: "Des marques de ces pays vendent déjà aux États-Unis avec nous.",
        /* /book?for=… (the CTA that sent them): title, second point, and
           whether the country-flags proof line shows. */
        variants: {
            launch: { title: "Préparer votre lancement aux États-Unis", operator: "Lu par un opérateur qui a déjà lancé des produits aux États-Unis", flags: true },
            drop: { title: "Commencer par un Test Drop", operator: "Lu par un opérateur qui a déjà lancé des produits aux États-Unis", flags: true },
            scale: { title: "Parler de US Scale", operator: "Lu par un opérateur qui gère les opérations américaines de marques", flags: false },
            enterprise: { title: "Parler à un opérateur senior", operator: "Lu par un opérateur senior de Vybd, en tenant compte de vos systèmes et de vos flux", flags: false },
            partner: { title: "Rejoindre le réseau Vybd", operator: "Lu par l'équipe qui construit le réseau Vybd", flags: false },
        },
        /* The contact form that replaced the Calendly scheduler. */
        form: {
            label: "Parlez-nous de vous",
            email: "E-mail professionnel",
            name: "Votre nom",
            company: "Marque ou site web",
            message: "Que fabriquez-vous, et qu'attendez-vous de nous ?",
            messagePlaceholder: "Une marque de soins de Séoul qui se vend bien chez elle. Nous voulons tester les États-Unis.",
            send: "Envoyer",
            sending: "Envoi…",
            note: "Nous l'utilisons uniquement pour vous répondre.",
            errorEmail: "Saisissez une adresse e-mail valide.",
            errorGeneric: "L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez.",
        },
        /* Under the form; the address sits between these two. */
        emailFallback: "Vous préférez l'e-mail ? Écrivez directement à",
        emailFallbackAfter: ".",
    },

    thanks: {
        title: "Merci. Nous revenons vers vous.",
        body: "Un opérateur va lire votre message et vous répondre par e-mail depuis hello@vybd.ai. Si vous avez des photos produit, une grille tarifaire ou vos canaux actuels aux États-Unis, envoyez-les en réponse.",
        back: "Retour à Vybd",
    },
};
