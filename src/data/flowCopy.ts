/* Every user-facing string in the /consulting/flow story. One caption per
   scene. No em dashes in anything a visitor reads. */

export interface FlowBeat {
    scene: string; // mono label drawn under the scene
    title: string;
    body: string;
}

export const FLOW = {
    tag: "FROM FACTORY TO CUSTOMER",
    skip: "Skip",
    beats: [
        { scene: "FACTORY", title: "Made.", body: "Every line runs to plan, from raw material to packed carton." },
        { scene: "PORT", title: "Loaded.", body: "Cartons packed, containers sealed, on the vessel." },
        { scene: "OCEAN · AIR", title: "In transit.", body: "Tracked across every handoff, by sea and by air." },
        { scene: "CUSTOMS", title: "Cleared.", body: "Inspection and release without the wait." },
        { scene: "STORE", title: "On the shelf.", body: "Stock where it sells, when it sells." },
        { scene: "CUSTOMER", title: "In their hands.", body: "A T-shirt in New York. Coffee in London. Skincare in Mumbai." },
    ] as FlowBeat[],
    cities: ["NEW YORK", "LONDON", "MUMBAI"],
};
