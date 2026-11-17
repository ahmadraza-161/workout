import { MAX_REST_SECONDS } from './engine';
const MIN_REST_SECONDS = 5;
export const REST_TIMER_OPTIONS = Array.from({ length: MAX_REST_SECONDS - MIN_REST_SECONDS + 1 }, (_, index) => index + MIN_REST_SECONDS);
