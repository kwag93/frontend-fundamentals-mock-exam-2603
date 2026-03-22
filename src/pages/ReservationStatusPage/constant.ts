import { TIME_SLOTS } from 'pages/constants';

export { EQUIPMENT_LABELS, TIME_SLOTS } from 'pages/constants';

export const TIMELINE_START = 9;
export const TIMELINE_END = 20;
export const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;
export const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));
