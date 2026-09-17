import * as THREE from "three";
import { SOURCE_SYSTEMS } from "./content";

/* Live world positions of the nine source blocks, written by the Sources layer
 * each frame and read by the projected chips in Annotations.
 *
 * Module-level and mutable on purpose: the chips have to follow blocks that
 * move every frame, and routing that through React would re-render the tree
 * sixty times a second for nine labels. Same reasoning as the timeline's
 * values object.
 */
export const sourcePositions = SOURCE_SYSTEMS.map(() => new THREE.Vector3());
