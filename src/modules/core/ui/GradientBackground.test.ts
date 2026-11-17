import { gradientStop } from './GradientBackground';

it('keeps the transparent end of an Android SVG scrim transparent', () => {
  expect(gradientStop('rgba(0,0,0,0)')).toEqual({ color: '#000000', opacity: 0 });
  expect(gradientStop('rgba(0,0,0,0.82)')).toEqual({ color: '#000000', opacity: 0.82 });
  expect(gradientStop('#004BFF')).toEqual({ color: '#004BFF', opacity: 1 });
});
