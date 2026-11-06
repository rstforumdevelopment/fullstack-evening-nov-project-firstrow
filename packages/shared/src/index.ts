export const APP_NAME = 'FiRSTRow';
export const APP_TAGLINE = 'Live events. Real seats. No double bookings.';

/*
 * The lifecycle of a single seat
 */
export type SeatStatus = 'available' | 'held' | 'sold';

/**
 * How each status is written when a human has to read it.
 */
export const SEAT_STATUS_LABELS: Record<SeatStatus, string> = {
  available: 'Available',
  held: 'On hold',
  sold: 'Sold',
};
