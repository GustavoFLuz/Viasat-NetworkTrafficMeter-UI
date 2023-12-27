import { getCurrentUnixTimeWithOffset } from ".";
import { NetworkUsageTypes as Types } from '@/shared/types';

export const RECORD_ARRAY_LENGTH = 30

export const TimeSpans: Types.TimeSpan[] = [
    {
      id: 0,
      name: '30 seconds',
      start: () => getCurrentUnixTimeWithOffset(-30 * 1000),
      end: () => getCurrentUnixTimeWithOffset(),
      synced: true,
      custom: false,
    },
    {
      id: 1,
      name: '5 minutes',
      start: () => getCurrentUnixTimeWithOffset(-5 * 60 * 1000),
      end: () => getCurrentUnixTimeWithOffset(),
      synced: false,
      custom: false,
    },
    {
      id: 2,
      name: '1 hour',
      start: () => getCurrentUnixTimeWithOffset(-60 * 60 * 1000),
      end: () => getCurrentUnixTimeWithOffset(),
      synced: false,
      custom: false,
    },
    {
      id: 3,
      name: '1 month',
      start: () => getCurrentUnixTimeWithOffset(-30 * 24 * 60 * 60 * 1000),
      end: () => getCurrentUnixTimeWithOffset(),
      synced: false,
      custom: false,
    },
    {
      id: 4,
      name: 'Custom Range',
      start: time => (time ? time : getCurrentUnixTimeWithOffset()),
      end: time => (time ? time : getCurrentUnixTimeWithOffset()),
      synced: false,
      custom: true,
    },
  ];