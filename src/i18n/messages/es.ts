import type { Messages } from "./en";

/* Spanish, neutral for Spain and Latin America. Formal "usted"; "EE.\u00a0UU."
   keeps its non-breaking space so it never splits across lines. */
export const es: Messages = {
    meta: {
        homeTitle: "Entrar al mercado de EE. UU. | Vybd",
        homeDescription:
            "Llevamos marcas y fabricantes internacionales a EE.\u00a0UU. y gestionamos sus operaciones una vez allí.",
        bookTitle: "Contáctenos | Vybd",
        thanksTitle: "Gracias | Vybd",
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
        sub: "Usted hace buenos productos. Nosotros nos encargamos del resto.",
        inputLabel: "Describa lo que necesita para entrar en el mercado estadounidense",
        submit: "Enviar",
        prev: "Ejemplo anterior",
        next: "Ejemplo siguiente",
        pause: "Pausar ejemplos",
        play: "Reproducir ejemplos",
        firstSlide: "retailer-order",
        slides: {
            "spices-india": {
                alt: "Manos ordenando productos de supermercado en una mesa blanca, entre tickets y notas adhesivas",
                prompt: "Producimos especias en India. ¿Cómo entramos en los supermercados de EE. UU.?",
            },
            "skincare-korea": {
                alt: "Diseñador con una taza comparando bocetos de empaque clavados en un tablero en un estudio de ladrillo",
                prompt: "Nuestra marca de cosmética triunfa en Corea. ¿Cómo conquistamos al comprador de EE. UU.?",
            },
            "battery-china": {
                alt: "Manos con guantes pegando una etiqueta en blanco en una caja en un centro logístico",
                prompt: "Fabricamos baterías en China. ¿Qué exigen las normas de etiquetado y seguridad de EE. UU.?",
            },
            "plates-bangladesh": {
                alt: "Manos levantando un frasco de muestra junto a una caja abierta en una mesa de reuniones",
                prompt: "Fabricamos platos compostables en Bangladés. ¿Quién los comprará en EE. UU.?",
            },
            "french-brand": {
                alt: "Operario en una plataforma elevadora alcanzando una caja en un alto pasillo de almacén",
                prompt: "¿Dónde almacenamos nuestro inventario en EE. UU.?",
            },
            "retailer-order": {
                alt: "Operario revisando con una tableta una fila de palets embalados en un muelle de carga",
                prompt: "Un minorista de EE. UU. acaba de hacer un gran pedido. ¿Podemos cumplir?",
            },
            "port-dawn": {
                alt: "Trabajador portuario en el muelle de un puerto de contenedores al amanecer, con grúas y un barco atracado",
                prompt: "¿Cuánto cuesta realmente llevar nuestro producto a EE. UU.?",
            },
            "robots-china": {
                alt: "Caja de envío en el escalón de un porche de las afueras al atardecer",
                prompt: "¿Cómo enviamos a clientes de EE. UU. y gestionamos las devoluciones?",
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
        rest: "y gestiona sus operaciones. Usted conserva su margen y el",
        control: "control",
        end: "de su marca, sin cedérselos a un distribuidor.",
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
        sub: "Marcas reales, resultados reales en EE. UU.",
        before: "Antes",
        after: "Después",
        done: "Hecho",
        inProgress: "En curso",
        cards: {
            bayangrom: {
                category: "Arte y ropa",
                label: "Inventario y envíos",
                headline: "$180K/año recuperados",
                excess: "Exceso de inventario",
                shipping: "Coste de envío",
                detail: "−28\u00a0% de exceso de inventario, −22\u00a0% de coste de envío",
            },
            mib: {
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
                label: "Entrega y atención al cliente",
                headline: "5000 robots entregados",
                detail: "También llevamos su atención al cliente en EE. UU.",
            },
            karama: {
                category: "Ropa interior premium",
                label: "Prelanzamiento",
                headline: "$10,000 en preventas antes del lanzamiento",
            },
            ouwr: {
                category: "Moda coreana, ropa de mujer",
                label: "Financiación",
                headline: "$15,000 recaudados para su entrada en EE. UU.",
            },
            cellre: {
                category: "Belleza coreana",
                label: "Financiación",
                headline: "$15,000 recaudados para su entrada en EE. UU.",
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

    offer: {
        label: "Cómo trabajamos",
        title: "Empiece con un plan de entrada a EE. UU.",
        sub: "Sepa lo que exige EE. UU. antes de invertir.",
        plan: {
            step: "Paso 1",
            name: "Plan de entrada a EE. UU.",
            price: "$7,000",
            time: "Un mes",
            items: [
                "Estudio de mercado",
                "Precios y estrategia de canales en EE. UU.",
                "Marca adaptada al comprador estadounidense",
                "Cumplimiento: etiquetado, certificaciones y normas de importación",
                "Plan de almacenes y logística",
            ],
        },
        build: {
            step: "Paso 2",
            name: "Implementar y operar",
            price: "Se factura según el trabajo",
            time: "El tiempo que lo necesite",
            items: [
                "Constitución de empresa y lanzamiento",
                "Compradores minoristas y canales online",
                "Financiación y captación de fondos",
                "Flete, almacenes y logística de pedidos",
                "Operaciones diarias en EE. UU.",
            ],
        },
        credit: "Si sigue con nosotros después del plan, sus $7,000 se descuentan del trabajo posterior.",
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
        title: "Planifiquemos su lanzamiento en EE. UU.",
        sub: "Cuéntenos un poco sobre su marca. Le responderá por correo un operador, no un vendedor.",
        cta: "Contáctenos",
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
        events: "Eventos",
        rainmaker: "Programa de socios",
        follow: "Síganos",
        partnership: "Alianzas",
        press: "Prensa",
        mediaKit: "Descargar kit de prensa",
        tagline: "Commerce, Coordinated.",
        privacy: "Política de privacidad y cookies",
        terms: "Términos",
    },

    book: {
        back: "Volver",
        title: "Hable con Vybd",
        points: [
            "Dos preguntas breves, menos de un minuto",
            "Lo lee un operador que ya ha llevado productos a EE. UU.",
            "Le respondemos por correo con un siguiente paso claro, trabaje o no con nosotros",
        ],
        proof: "Marcas de estos países ya venden en EE.\u00a0UU. con nosotros.",
        /* /book?for=… (the CTA that sent them): title, second point, and
           whether the country-flags proof line shows. */
        variants: {
            launch: { title: "Planifique su lanzamiento en EE. UU.", operator: "Lo lee un operador que ya ha llevado productos a EE. UU.", flags: true },
            drop: { title: "Empiece con un Test Drop", operator: "Lo lee un operador que ya ha llevado productos a EE. UU.", flags: true },
            scale: { title: "Hable de US Scale", operator: "Lo lee un operador que gestiona operaciones en EE. UU. para marcas", flags: false },
            enterprise: { title: "Hable con un operador sénior", operator: "Lo lee un operador sénior de Vybd, teniendo en cuenta sus sistemas y rutas", flags: false },
            partner: { title: "Únase a la red Vybd", operator: "Lo lee el equipo que construye la red Vybd", flags: false },
        },
        /* The contact form that replaced the Calendly scheduler. */
        form: {
            label: "Cuéntenos sobre usted",
            email: "Correo de trabajo",
            name: "Su nombre",
            company: "Marca o sitio web",
            message: "¿Qué fabrica y qué necesita de nosotros?",
            messagePlaceholder: "Una marca de cuidado de la piel de Seúl que vende bien en su país. Queremos probar EE. UU.",
            send: "Enviar",
            sending: "Enviando…",
            note: "Solo lo usamos para responderle.",
            errorEmail: "Introduzca un correo electrónico válido.",
            errorGeneric: "No se pudo enviar. Revise su conexión e inténtelo de nuevo.",
        },
        /* Under the form; the address sits between these two. */
        emailFallback: "¿Prefiere el correo? Escriba directamente a",
        emailFallbackAfter: ".",
    },

    thanks: {
        title: "Gracias. Nos pondremos en contacto.",
        body: "Un operador leerá su mensaje y le responderá por correo desde hello@vybd.ai. Si tiene fotos del producto, una lista de precios o sus canales actuales en EE. UU., envíelos en su respuesta.",
        back: "Volver a Vybd",
    },
};
