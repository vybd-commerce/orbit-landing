import type { Messages } from "./en";

/* French. Formal "vous"; non-breaking spaces (\u00a0) before ? ! : and inside
   « » so they never start a line on their own. */
export const fr: Messages = {
    meta: {
        homeTitle: "Entrer sur le marché américain | Vybd",
        homeDescription:
            "Nous accompagnons les marques et fabricants internationaux sur le marché américain, puis nous gérons leurs opérations sur place.",
        bookTitle: "Réservez un appel pour entrer aux États-Unis | Vybd",
        thanksTitle: "C'est réservé | Vybd",
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
            emsworth: {
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
        sub: "30 minutes avec un opérateur, pas un commercial. Choisissez un créneau dans votre fuseau horaire.",
        cta: "Réserver un appel",
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
        follow: "Suivez-nous",
        partnership: "Partenariats",
        press: "Presse",
        mediaKit: "Télécharger le kit média",
        offices: "Bureaux",
        tagline: "Commerce, Coordinated.",
        privacy: "Politique de confidentialité et cookies",
        terms: "Conditions",
        cookies: "Vos préférences de cookies",
    },

    book: {
        back: "Retour",
        title: "Réservez un appel pour entrer aux États-Unis",
        points: [
            "30 minutes en visio",
            "Avec un opérateur qui a déjà lancé des produits aux États-Unis",
            "Vous repartez avec une prochaine étape claire, que vous travailliez avec nous ou non",
        ],
        proof: "Des marques de ces pays vendent déjà aux États-Unis avec nous.",
        pickTime: "Choisir un créneau",
        loading: "Chargement des créneaux disponibles…",
        failed: "Le calendrier ne s'est pas chargé.",
        openTab: "Ouvrir dans un nouvel onglet",
        notConfigured: "Scheduler not configured yet: set BOOKING_URL in src/pages/BookPage.tsx.",
        emailFallback: "Le calendrier ne s'affiche pas\u00a0? Écrivez-nous à",
        emailFallbackAfter: " et nous trouverons un créneau.",
    },

    thanks: {
        title: "C'est réservé.",
        body: "Une invitation d'agenda est en route. Répondez-y avec tout ce que vous voulez nous montrer avant l'appel (photos produit, liste de prix, vos canaux actuels aux États-Unis).",
        back: "Retour à Vybd",
    },
};
