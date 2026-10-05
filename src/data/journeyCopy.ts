/* Every user-facing string in the /consulting/journey story.
 *
 * Nine scroll steps, seven captioned chapters: chapter 07 spans the last
 * three steps and only swaps its city line. No em dashes in anything a
 * visitor reads.
 */

export interface JourneyChapter {
    title: string;
    body: string;
}

export interface Panel {
    city: string;
    label: string;
}

export const JOURNEY = {
    tag: "FROM FACTORY TO CUSTOMER",
    skip: "Skip",
    chapters: [
        {
            title: "Made in one place, sold everywhere.",
            body: "Three products, three factories, three cities on the other side of the world.",
        },
        {
            title: "Made.",
            body: "Every line runs to plan, from raw material to packed carton.",
        },
        {
            title: "Loaded.",
            body: "Cartons packed, containers sealed, on the vessel.",
        },
        {
            title: "In transit.",
            body: "Ocean and air, tracked across every handoff.",
        },
        {
            title: "Received and cleared.",
            body: "Customs, inspection and release without the wait.",
        },
        {
            title: "On the shelf.",
            body: "Stock where it sells, when it sells.",
        },
        {
            title: "In their hands.",
            body: "",
        },
    ] as JourneyChapter[],
    /* Chapter 07's line, one per final step. */
    endings: ["New York · a T-shirt.", "London · a bag of coffee.", "Mumbai · a moisturiser."],
    made: [
        { city: "DHAKA", label: "Garments" },
        { city: "HO CHI MINH CITY", label: "Coffee" },
        { city: "SHANGHAI", label: "Cosmetics" },
    ] as Panel[],
    shelf: [
        { city: "NEW YORK", label: "Apparel" },
        { city: "LONDON", label: "Coffee" },
        { city: "MUMBAI", label: "Beauty" },
    ] as Panel[],
};
