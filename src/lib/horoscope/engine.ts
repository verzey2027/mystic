// Horoscope Engine for REFFORTUNE
// Feature: popular-fortune-features
// Generates horoscope readings for different time periods

import { ZodiacSign, TimePeriod, HoroscopeInput, HoroscopeReading } from './types';
import { getBaselineHoroscope } from './baseline';
import { 
  getCacheEntry, 
  setCacheEntry, 
  generateCacheKey,
  getMillisecondsUntilEndOfDay,
  getMillisecondsUntilEndOfWeek,
  getMillisecondsUntilEndOfMonth
} from '../reading/cache';
import { ReadingType } from '../reading/types';

/**
 * Calculate date range for a given period
 * 
 * Daily: Single day (start and end are same day at 00:00 and 23:59)
 * Weekly: Monday to Sunday of the current week
 * Monthly: First to last day of the current month
 * 
 * @param date - Reference date
 * @param period - Time period (daily, weekly, monthly)
 * @returns Object with start and end dates
 * 
 * @example
 * // For a date in the middle of the week
 * calculateDateRange(new Date('2024-01-10'), TimePeriod.WEEKLY)
 * // Returns: { start: Mon Jan 8, end: Sun Jan 14 }
 */
export function calculateDateRange(
  date: Date, 
  period: TimePeriod
): { start: Date; end: Date } {
  const start = new Date(date);
  const end = new Date(date);
  
  switch (period) {
    case TimePeriod.DAILY:
      // Same day, start at 00:00, end at 23:59
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
      
    case TimePeriod.WEEKLY:
      // Monday to Sunday of current week
      const dayOfWeek = date.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday is 0
      
      start.setDate(date.getDate() + daysToMonday);
      start.setHours(0, 0, 0, 0);
      
      end.setDate(start.getDate() + 6); // Sunday
      end.setHours(23, 59, 59, 999);
      break;
      
    case TimePeriod.MONTHLY:
      // First to last day of current month
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      
      end.setMonth(date.getMonth() + 1, 0); // Last day of current month
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
}

/**
 * Get baseline horoscope reading (deterministic)
 * 
 * Provides consistent interpretation based on zodiac sign and date
 * without AI enhancement. Used as fallback when AI is unavailable
 * or as base content for AI enhancement.
 * 
 * @param input - Horoscope input parameters
 * @returns Complete horoscope reading with baseline content
 * 
 * @example
 * const reading = getBaselineHoroscope({
 *   zodiacSign: ZodiacSign.ARIES,
 *   period: TimePeriod.DAILY,
 *   date: new Date()
 * });
 */
export function getBaselineHoroscopeReading(input: HoroscopeInput): HoroscopeReading {
  const { zodiacSign, period, date } = input;
  
  // Calculate date range for the period
  const dateRange = calculateDateRange(date, period);
  
  // Get baseline interpretation
  const baseline = getBaselineHoroscope(zodiacSign, date);
  
  return {
    zodiacSign,
    period,
    dateRange,
    aspects: {
      love: baseline.love,
      career: baseline.career,
      finance: baseline.finance,
      health: baseline.health
    },
    luckyNumbers: baseline.luckyNumbers,
    luckyColors: baseline.luckyColors,
    advice: baseline.advice,
    confidence: 70 // Baseline only, no AI enhancement
  };
}

/**
 * Get TTL (time to live) for cache based on period
 * 
 * @param period - Time period
 * @param date - Reference date
 * @returns TTL in milliseconds
 */
function getCacheTTL(period: TimePeriod, date: Date): number {
  switch (period) {
    case TimePeriod.DAILY:
      return getMillisecondsUntilEndOfDay(date);
    case TimePeriod.WEEKLY:
      return getMillisecondsUntilEndOfWeek(date);
    case TimePeriod.MONTHLY:
      return getMillisecondsUntilEndOfMonth(date);
    default:
      return getMillisecondsUntilEndOfDay(date);
  }
}

/**
 * Generate horoscope reading with caching
 * 
 * Checks cache first, returns cached reading if valid.
 * Otherwise generates new baseline reading and caches it.
 * 
 * In future: Will integrate with AI enhancement API
 * 
 * @param input - Horoscope input parameters
 * @returns Complete horoscope reading
 * 
 * @example
 * const reading = await generateHoroscope({
 *   zodiacSign: ZodiacSign.LEO,
 *   period: TimePeriod.WEEKLY,
 *   date: new Date()
 * });
 * console.log(reading.aspects.love);
 */
export async function generateHoroscope(input: HoroscopeInput): Promise<HoroscopeReading> {
  const { zodiacSign, period, date } = input;
  
  // Generate cache key
  const cacheKey = generateCacheKey(ReadingType.HOROSCOPE, {
    zodiacSign,
    period,
    date
  });
  
  // Check cache first
  const cached = getCacheEntry<HoroscopeReading>(cacheKey, 'horoscope');
  if (cached) {
    return cached;
  }
  
  // Generate baseline reading
  const reading = getBaselineHoroscopeReading(input);
  
  // TODO: Integrate with AI enhancement API
  // For now, return baseline only
  
  // Cache the reading
  const ttl = getCacheTTL(period, date);
  setCacheEntry(cacheKey, reading, {
    ttl,
    keyPrefix: 'horoscope'
  });
  
  return reading;
}
