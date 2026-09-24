// Character palettes (DESIGN §2.7). Every part has a base tone and a shade
// tone; limbs on the far side of the body and the neck take the shade. Two
// flat tones, never a gradient and never an outline.
//
// The shade values are proposed and await the owner's confirmation. The
// reference app's own values are deliberately NOT used: our assets must be
// original, and the reference is a layout guide only (PRD §9).

import type { JointName } from './skeleton.ts';

export interface PartTones {
  base: string;
  shade: string;
}

export interface CharacterPalette {
  top: PartTones;
  shorts: PartTones;
  skin: PartTones;
  hair: PartTones;
  shoes: PartTones;
  floorShadow: string;
  /** Translucent arrow showing the direction of travel. */
  motionArc: string;
}

export const PALETTES: Record<'a' | 'b', CharacterPalette> = {
  // Variant A: "Male" and "Prefer not to say".
  a: {
    top: { base: '#3A9AD9', shade: '#2F82B8' },
    shorts: { base: '#1F2530', shade: '#2A3140' },
    skin: { base: '#F0B49C', shade: '#DFA285' },
    hair: { base: '#5C5C5C', shade: '#4A4A4A' },
    shoes: { base: '#5E6166', shade: '#4E5155' },
    floorShadow: '#DBDBDB',
    motionArc: '#7FC4E8',
  },
  // Variant B: "Female".
  b: {
    top: { base: '#E8698A', shade: '#C9516F' },
    shorts: { base: '#2B2F3A', shade: '#373C4A' },
    skin: { base: '#E3A98C', shade: '#D29576' },
    hair: { base: '#3B2A25', shade: '#2E211D' },
    shoes: { base: '#5E6166', shade: '#4E5155' },
    floorShadow: '#DBDBDB',
    motionArc: '#7FC4E8',
  },
};

export type PaletteName = keyof typeof PALETTES;

/** Which material each bone is made of. */
const MATERIAL: Record<JointName, keyof Omit<CharacterPalette, 'floorShadow' | 'motionArc'>> = {
  hip: 'shorts',
  torso: 'top',
  neck: 'skin',
  head: 'skin',
  upperArmFar: 'skin',
  lowerArmFar: 'skin',
  handFar: 'skin',
  upperArmNear: 'skin',
  lowerArmNear: 'skin',
  handNear: 'skin',
  thighFar: 'shorts',
  shinFar: 'skin',
  footFar: 'shoes',
  thighNear: 'shorts',
  shinNear: 'skin',
  footNear: 'shoes',
};

/** Resolves a bone to its flat fill for a palette and depth. */
export function fillFor(joint: JointName, depth: 'near' | 'far', palette: CharacterPalette): string {
  const tones = palette[MATERIAL[joint]];
  return depth === 'far' ? tones.shade : tones.base;
}

/** Props are drawn flat and neutral behind the character (CONTENT_MAP §5). */
export const PROP_FILL = '#C9CCD1';
