/**
 * Maps F1 23 track IDs to human-readable names
 */

const TRACK_NAMES: Record<number, string> = {
  0: 'Melbourne',
  1: 'Paul Ricard',
  2: 'Shanghai',
  3: 'Bahrain',
  4: 'Catalunya',
  5: 'Monaco',
  6: 'Montreal',
  7: 'Silverstone',
  8: 'Hockenheim',
  9: 'Hungaroring',
  10: 'Spa',
  11: 'Monza',
  12: 'Singapore',
  13: 'Suzuka',
  14: 'Abu Dhabi',
  15: 'Texas',
  16: 'Brazil',
  17: 'Austria',
  18: 'Sochi',
  19: 'Mexico',
  20: 'Baku',
  21: 'Sakhir Short',
  22: 'Silverstone Short',
  23: 'Texas Short',
  24: 'Suzuka Short',
  25: 'Hanoi',
  26: 'Zandvoort',
  27: 'Imola',
  28: 'Portimao',
  29: 'Jeddah',
  30: 'Miami',
  31: 'Las Vegas',
  32: 'Losail',
};

/**
 * Get the human-readable name for a track ID
 */
export function getTrackName(trackId: number): string {
  return TRACK_NAMES[trackId] ?? `Track ${trackId}`;
}

/**
 * Maps F1 23 session type to readable name
 */
const SESSION_TYPES: Record<number, string> = {
  0: 'unknown',
  1: 'practice',
  2: 'practice',
  3: 'practice',
  4: 'practice',
  5: 'qualifying',
  6: 'qualifying',
  7: 'qualifying',
  8: 'qualifying',
  9: 'qualifying',
  10: 'race',
  11: 'race',
  12: 'race',
  13: 'time_trial',
};

/**
 * Get the session type category
 */
export function getSessionType(sessionType: number): string {
  return SESSION_TYPES[sessionType] ?? 'unknown';
}

/**
 * Maps F1 23 weather to readable name
 */
const WEATHER_TYPES: Record<number, string> = {
  0: 'clear',
  1: 'light_cloud',
  2: 'overcast',
  3: 'light_rain',
  4: 'heavy_rain',
  5: 'storm',
};

/**
 * Get the weather condition
 */
export function getWeather(weather: number): string {
  return WEATHER_TYPES[weather] ?? 'unknown';
}

/**
 * Maps F1 23 tyre compound to readable name
 */
const TYRE_COMPOUNDS: Record<number, string> = {
  16: 'C5',
  17: 'C4',
  18: 'C3',
  19: 'C2',
  20: 'C1',
  7: 'Inter',
  8: 'Wet',
};

/**
 * Get the tyre compound name
 */
export function getTyreCompound(compound: number): string {
  return TYRE_COMPOUNDS[compound] ?? `Compound ${compound}`;
}
