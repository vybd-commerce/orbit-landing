import type { Messages } from "./en";

/* Spanish, neutral for Spain and Latin America. Formal "usted"; "EE.\u00a0UU."
   keeps its non-breaking space so it never splits across lines. */
export const es: Messages = {
    meta: {
        homeTitle: "Hola, mundo | Vybd",
        homeDescription:
            "Llevamos marcas y fabricantes internacionales a EE.\u00a0UU. y gestionamos sus operaciones una vez allí.",
        bookTitle: "Reserve una llamada para entrar en EE.\u00a0UU. | Vybd",
        thanksTitle: "Reserva confirmada | Vybd",
    },

    header: {
        home: "Inicio de Vybd",
        menu: "Menú",
        language: "Idioma",
    },

    menu: {
        label: "Menú del sitio",
        close: "Cerrar menú",
        home: "Inicio",
        howItWorks: "Cómo funciona",
        caseStudies: "Casos de éxito",
        about: "Sobre nosotros",
        contact: "Contáctanos",
        privacy: "Privacidad",
    },

    hero: {
        title: "Hola, mundo",
        sub: "Todo lo que necesita para entrar en el mercado estadounidense empieza aquí.",
        inputLabel: "Describa lo que necesita para entrar en el mercado estadounidense",
        submit: "Enviar",
        prev: "Ejemplo anterior",
        next: "Ejemplo siguiente",
        pause: "Pausar ejemplos",
        play: "Reproducir ejemplos",
        note: "Llevamos marcas y fabricantes internacionales a EE.\u00a0UU. y gestionamos sus operaciones una vez allí.",
        firstSlide: "retailer-order",
        slides: {
            "spices-india": {
                alt: "Manos ordenando productos de supermercado en una mesa blanca, entre tickets y notas adhesivas",
                prompt: "Pruebe «Producimos especias en India. ¿Cómo entramos en los supermercados de EE.\u00a0UU.?»",
            },
            "skincare-korea": {
                alt: "Diseñador con una taza comparando bocetos de empaque clavados en un tablero en un estudio de ladrillo",
                prompt: "Pruebe «Nuestra marca de cosmética triunfa en Corea. ¿Por dónde empezamos en EE.\u00a0UU.?»",
            },
            "battery-china": {
                alt: "Manos con guantes pegando una etiqueta en blanco en una caja en un centro logístico",
                prompt: "Pruebe «Fabricamos baterías en China. ¿Qué necesitamos para enviarlas a EE.\u00a0UU.?»",
            },
            "plates-bangladesh": {
                alt: "Manos levantando un frasco de muestra junto a una caja abierta en una mesa de reuniones",
                prompt: "Pruebe «Fabricamos platos compostables en Bangladés. ¿Quién los comprará en EE.\u00a0UU.?»",
            },
            "french-brand": {
                alt: "Operario en una plataforma elevadora alcanzando una caja en un alto pasillo de almacén",
                prompt: "Pruebe «Nuestra marca francesa vende en Amazon US, pero las ventas no crecen. ¿Y ahora qué?»",
            },
            "retailer-order": {
                alt: "Operario revisando con una tableta una fila de palets embalados en un muelle de carga",
                prompt: "Pruebe «Un minorista de EE.\u00a0UU. quiere nuestro producto. ¿Podemos cumplir con el pedido?»",
            },
            "port-dawn": {
                alt: "Trabajador portuario en el muelle de un puerto de contenedores al amanecer, con grúas y un barco atracado",
                prompt: "Pruebe «¿Cuánto cuesta realmente llevar nuestro producto a EE.\u00a0UU.?»",
            },
            "robots-china": {
                alt: "Caja de envío en el escalón de un porche de las afueras al atardecer",
                prompt: "Pruebe «Fabricamos robots en China. ¿Cómo los vendemos y damos soporte en EE.\u00a0UU.?»",
            },
        },
    },

    statement: {
        label: "Qué hace Vybd",
        seeHow: "Ver cómo funciona",
        moreCountries: "Mostrar más países",
        lead: "lleva sus productos desde",
        anywhere: "cualquier lugar",
        mid: "a EE.\u00a0UU. Un solo socio encuentra a sus compradores, resuelve el",
        redTape: "papeleo",
        rest: "y gestiona sus operaciones. Ningún distribuidor se queda con su margen, y usted mantiene el",
        control: "control",
        end: "de su marca.",
    },

    countries: {
        in: "India",
        kr: "Corea del Sur",
        cn: "China",
        fr: "Francia",
        bd: "Bangladés",
        jp: "Japón",
        vn: "Vietnam",
        it: "Italia",
        mx: "México",
        th: "Tailandia",
        de: "Alemania",
        tr: "Turquía",
        id: "Indonesia",
        es: "España",
        gb: "Reino Unido",
        ph: "Filipinas",
        br: "Brasil",
        pk: "Pakistán",
        us: "Estados Unidos",
        usa: "EE.\u00a0UU.",
    },

    proof: {
        title: "Ya en EE.\u00a0UU.",
        sub: "Marcas de India, Corea del Sur y China que ya venden en Estados Unidos.",
        before: "Antes",
        after: "Después",
        done: "Hecho",
        inProgress: "En curso",
        live: "En vivo",
        pledgedLabel: "Aportado respecto al objetivo",
        notFilled: "Aún sin completar",
        ofGoal: (pledged, goal) => `${pledged} de ${goal}`,
        asOf: (date) => `Al ${date}`,
        goal: (amount) => `Objetivo: ${amount}`,
        inPreorders: (amount) => `${amount} en preventas`,
        pledged: (amount) => `${amount} aportados`,
        cards: {
            bayangrom: {
                category: "Arte y ropa",
                label: "Inventario y envíos",
                headline: "$180K/año recuperados",
                excess: "Exceso de inventario",
                shipping: "Coste de envío",
                detail: "−28\u00a0% de exceso de inventario, −22\u00a0% de coste de envío",
            },
            emsworth: {
                category: "Productos de lujo de rizo de algodón",
                label: "Preventas mayoristas",
                headline: "$30,000 en preventas B2B",
                wholesale: "Lanzamiento mayorista",
                dtc: "Tienda directa al consumidor",
                detail: "Ahora construyen su tienda directa al consumidor",
            },
            sugat: {
                category: "Polvos de hierbas y envases alimentarios sostenibles",
                label: "Ingresos B2B",
                headline: "$25,000 en ingresos B2B",
            },
            ollobot: {
                category: "Robots de compañía",
                label: "Kickstarter, en vivo",
                detail: "Objetivo: $100,000 en preventas",
            },
            karama: {
                category: "Ropa interior premium",
                label: "Prelanzamiento",
                headline: "$10,000 en preventas antes del lanzamiento",
            },
            ouwr: {
                category: "Moda coreana, ropa de mujer",
                label: "Ya en EE.\u00a0UU.",
            },
            cellre: {
                category: "Belleza coreana",
                label: "Ya en EE.\u00a0UU.",
            },
        },
    },

    complexity: {
        tasks: [
            "Estrategia de canales",
            "Precios en EE.\u00a0UU.",
            "Marketing",
            "Compradores minoristas",
            "Constitución de la empresa",
            "Impuesto sobre ventas",
            "Normas FDA / FCC",
            "Etiquetado",
            "Agente de aduanas",
            "Importador registrado",
            "Aranceles y derechos",
            "Flete",
            "Seguro de carga",
            "Financiación",
            "Almacén 3PL",
            "Devoluciones",
            "Penalizaciones de minoristas",
            "Cuenta de Amazon",
            "Atención al cliente",
        ],
        groups: { Decide: "Decidir", Land: "Aterrizar", Run: "Operar" },
        captions: [
            "Vender en EE.\u00a0UU. significa gestionar todo esto.",
            "O una sola relación en lugar de diecinueve.",
            "Usted hace grandes productos. Nosotros nos encargamos del resto.",
        ],
        stageLabel:
            "Diecinueve tareas para vender en EE.\u00a0UU., desde aduanas y flete hasta devoluciones y financiación, gestionadas por Vybd en tres pasos: Decidir, Aterrizar y Operar.",
        you: "Usted",
    },

    tech: {
        title: "Tecnología propia",
        more: "Y muchas más",
        helmLabel: "proponer · aprobar",
        tiles: {
            Scout: "Encuentra y califica minoristas y distribuidores de EE.\u00a0UU. para sus productos",
            Muse: "Aprende la voz de su marca y planifica campañas para EE.\u00a0UU.",
            Prism: "Fotos y vídeos de producto para canales de EE.\u00a0UU., sin sesión de fotos",
            Helm: "Los agentes vigilan inventario, pedidos y costes, y proponen soluciones que nosotros aprobamos",
            Harbor: "Su tienda online en EE.\u00a0UU., conectada al inventario y la logística",
        },
    },

    contact: {
        title: "¿Listo para llevar sus productos a EE.\u00a0UU.?",
        sub: "30 minutos con un operador, no con un vendedor. Elija un horario en su propia zona horaria.",
        cta: "Reservar una llamada",
    },

    footer: {
        nav: "Pie de página",
        explore: "Explorar",
        howItWorks: "Cómo funciona",
        solutions: "Soluciones",
        caseStudies: "Casos de éxito",
        lab: "Lab",
        company: "Empresa",
        about: "Sobre nosotros",
        careers: "Carreras",
        jobs: "Empleos",
        events: "Eventos",
        compliance: "Cumplimiento",
        support: "Centro de ayuda",
        investors: "Inversores",
        follow: "Síganos",
        partnership: "Alianzas",
        press: "Prensa",
        mediaKit: "Descargar kit de prensa",
        offices: "Oficinas",
        tagline: "Commerce, Coordinated.",
        taglineSub: "enabling commerce, disabling borders",
        privacy: "Política de privacidad y cookies",
        terms: "Términos",
        cookies: "Sus preferencias de cookies",
    },

    book: {
        back: "Volver",
        title: "Reserve una llamada para entrar en EE.\u00a0UU.",
        points: [
            "30 minutos por videollamada",
            "Con un operador que ya ha llevado productos a EE.\u00a0UU.",
            "Saldrá con un siguiente paso claro, trabaje o no con nosotros",
        ],
        proof: "Marcas de estos países ya venden en EE.\u00a0UU. con nosotros.",
        pickTime: "Elegir un horario",
        loading: "Cargando horarios disponibles…",
        failed: "El calendario no se cargó.",
        openTab: "Abrirlo en una pestaña nueva",
        notConfigured: "Scheduler not configured yet: set BOOKING_URL in src/pages/BookPage.tsx.",
        emailFallback: "¿No carga el calendario? Escríbanos a",
        emailFallbackAfter: " y buscaremos un horario.",
    },

    thanks: {
        title: "Reserva confirmada.",
        body: "Le llegará una invitación de calendario. Respóndala con todo lo que quiera que revisemos antes de la llamada (fotos del producto, una lista de precios, sus canales actuales en EE.\u00a0UU.).",
        back: "Volver a Vybd",
    },
};
