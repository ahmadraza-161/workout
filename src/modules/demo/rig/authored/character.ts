// Original hand-authored silhouettes. No traced reference artwork or remote assets.
import type { CharacterPalette } from '../palette.ts';
import {
  contour,
  transformPath,
  limb,
  type Artwork,
  type Transform,
  type Vec,
} from './geometry.ts';

export function shape(
  id: string,
  points: Vec[],
  fill: string,
  transform: Transform = (p) => p,
  tension = 0.16,
): Artwork {
  return { id, fill, path: transformPath(contour(points, tension), transform) };
}

/** Flat ellipse under the feet, kept fixed while the body moves. */
export function shadow(palette: CharacterPalette, side: boolean): Artwork {
  const cx = side ? 340 : 300;
  return shape(
    'floor',
    [
      [cx - 80, 531],
      [cx, 522],
      [cx + 80, 531],
      [cx, 540],
    ],
    palette.floorShadow,
    undefined,
    0.28,
  );
}

/** Rounded jaw, ears, shaped hairline and crown; deliberately no facial features. */
export function head(p: CharacterPalette, transform: Transform, turn = 0): Artwork[] {
  const face = shape(
    'face',
    [
      [-21, -43],
      [-23, -25],
      [-19, -7],
      [-10, 4],
      [3, 7],
      [16, -3],
      [23, -24],
      [19, -44],
      [0, -50],
    ],
    p.skin.base,
    transform,
  );
  const earX = turn >= 0 ? -22 : 22;
  return [
    shape(
      'neck',
      [
        [-12, 0],
        [-12, 19],
        [-24, 25],
        [0, 39],
        [24, 25],
        [12, 19],
        [11, -2],
      ],
      p.skin.shade,
      transform,
      0.12,
    ),
    face,
    shape(
      'faceShade',
      [
        [-21, -33],
        [-18, -8],
        [-7, 4],
        [3, 7],
        [-12, 0],
        [-23, -22],
      ],
      p.skin.shade,
      transform,
      0.12,
    ),
    shape(
      'ear',
      [
        [earX - 3, -27],
        [earX - 5, -15],
        [earX + 2, -11],
        [earX + 5, -24],
      ],
      p.skin.base,
      transform,
    ),
    shape(
      'hair',
      [
        [-23, -22],
        [-25, -39],
        [-18, -53],
        [0, -57],
        [18, -51],
        [24, -38],
        [21, -24],
        [16, -39],
        [-6, -40],
        [-17, -36],
        [-18, -20],
      ],
      p.hair.base,
      transform,
      0.1,
    ),
    shape(
      'hairShade',
      [
        [-25, -39],
        [-18, -53],
        [-11, -54],
        [-17, -39],
        [-18, -20],
        [-23, -22],
      ],
      p.hair.shade,
      transform,
      0.1,
    ),
  ];
}

/** Tank top with an open neckline and curved armholes instead of a capsule torso. */
export function vest(p: CharacterPalette, transform: Transform): Artwork[] {
  return [
    shape(
      'chest',
      [
        [-12, -155],
        [-15, -141],
        [-39, -132],
        [-34, -109],
        [0, -98],
        [34, -109],
        [39, -132],
        [15, -141],
        [12, -155],
      ],
      p.skin.base,
      transform,
      0.1,
    ),
    shape(
      'vest',
      [
        [-29, -134],
        [-44, -128],
        [-39, -105],
        [-35, -80],
        [-31, -42],
        [-33, -16],
        [0, -11],
        [33, -16],
        [31, -42],
        [35, -80],
        [39, -105],
        [44, -128],
        [29, -134],
        [24, -116],
        [0, -106],
        [-24, -116],
      ],
      p.top.base,
      transform,
      0.1,
    ),
    shape(
      'vestShade',
      [
        [-44, -128],
        [-39, -105],
        [-35, -80],
        [-31, -42],
        [-33, -16],
        [-17, -13],
        [-22, -54],
        [-25, -87],
        [-31, -109],
        [-32, -132],
      ],
      p.top.shade,
      transform,
      0.1,
    ),
  ];
}

export function arm(
  id: string,
  shoulder: Vec,
  elbow: Vec,
  wrist: Vec,
  p: CharacterPalette,
  far = false,
): Artwork[] {
  const fill = far ? p.skin.shade : p.skin.base;
  const dx = wrist[0] - elbow[0];
  const dy = wrist[1] - elbow[1];
  const length = Math.hypot(dx, dy);
  const handTransform: Transform = ([x, y]) => [
    wrist[0] + (x * dx - y * dy) / length,
    wrist[1] + (x * dy + y * dx) / length,
  ];
  return [
    { id: `${id}Upper`, path: limb(shoulder, elbow, 15, 10), fill },
    { id: `${id}Forearm`, path: limb(elbow, wrist, 12, 7), fill },
    shape(
      `${id}Hand`,
      [
        [-3, -7],
        [8, -9],
        [19, -5],
        [22, 1],
        [18, 7],
        [8, 8],
        [-3, 6],
      ],
      fill,
      handTransform,
      0.14,
    ),
    shape(
      `${id}Thumb`,
      [
        [2, -6],
        [9, -13],
        [16, -10],
        [10, -4],
      ],
      far ? p.skin.base : p.skin.shade,
      handTransform,
      0.12,
    ),
  ];
}

export function leg(
  id: string,
  hip: Vec,
  knee: Vec,
  ankle: Vec,
  p: CharacterPalette,
  far = false,
): Artwork[] {
  const hem: Vec = [hip[0] + (knee[0] - hip[0]) * 0.74, hip[1] + (knee[1] - hip[1]) * 0.74];
  return [
    { id: `${id}Thigh`, path: limb(hip, knee, 21, 14), fill: far ? p.skin.shade : p.skin.base },
    { id: `${id}Calf`, path: limb(knee, ankle, 16, 9), fill: far ? p.skin.shade : p.skin.base },
    { id: `${id}Shorts`, path: limb(hip, hem, 25, 21), fill: p.shorts.base },
    {
      id: `${id}ShortsShade`,
      path: limb([hip[0] - 12, hip[1]], [hem[0] - 12, hem[1]], 9, 8),
      fill: p.shorts.shade,
    },
  ];
}

export function shoe(
  id: string,
  ankle: Vec,
  p: CharacterPalette,
  side: boolean,
  direction = 1,
): Artwork[] {
  const transform: Transform = ([x, y]) => [ankle[0] + x * direction, ankle[1] + y];
  const outline: Vec[] = side
    ? [
        [-11, -6],
        [8, -5],
        [13, 7],
        [32, 13],
        [35, 20],
        [22, 23],
        [-14, 22],
        [-15, 13],
      ]
    : [
        [-10, -6],
        [10, -6],
        [12, 7],
        [17, 18],
        [12, 23],
        [-13, 23],
        [-16, 17],
        [-12, 5],
      ];
  return [
    shape(`${id}Shoe`, outline, p.shoes.base, transform, 0.12),
    shape(
      `${id}Sole`,
      side
        ? [
            [-14, 18],
            [10, 20],
            [35, 18],
            [33, 23],
            [-13, 24],
          ]
        : [
            [-16, 17],
            [0, 21],
            [17, 18],
            [12, 24],
            [-13, 24],
          ],
      p.shoes.shade,
      transform,
      0.1,
    ),
  ];
}
