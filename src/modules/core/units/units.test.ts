import { displayHeight, heightToCm } from './index';

it('converts feet/inches to canonical centimetres without accepting invalid inches', () => {
  expect(heightToCm(5, 10)).toBe(177.8);
  expect(heightToCm(6, 0)).toBe(182.88);
  expect(heightToCm(5, 12)).toBeNaN();
  expect(heightToCm(5, -1)).toBeNaN();
  expect(heightToCm(5.5, 0)).toBeNaN();
});

it('rounds total inches before splitting feet and inches at a foot boundary', () => {
  expect(displayHeight(182.87)).toEqual({ feet: 6, inches: 0 });
  const shown = displayHeight(177.8);
  expect(shown).toEqual({ feet: 5, inches: 10 });
  expect(heightToCm(shown.feet, shown.inches)).toBe(177.8);
});
