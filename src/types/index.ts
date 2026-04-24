/**
 * @fileoverview Defines data structures and validation logic for core entities.
 */

/**
 * @interface Player
 * Represents a Player in the system.
 * Based on the Player class in the UML diagram.
 */
export interface Player {
  /** @field id - Unique primary key for the player. */
  id: number;
  /** @field code - The numeric code used for the target loop functionality. */
  code?: number;
  /** @field username - The display name of the player. */
  username?: string;
  /** @field score - The cumulative point total earned by the player. */
  score?: number;
  /** @field targets - Array of player IDs that the current player is currently hunting. */
  targets: number[];
  /** @field hideList - Array of player IDs that the current player is forbidden from being assigned as a target. */
  hideList: number[];
  /** @field selfieId - The reference ID to the associated Selfie record. */
  selfieId: number;
}

/**
 * @interface Selfie
 * Represents a Selfie image record stored in the S3 bucket.
 * Based on the Selfie class in the UML diagram.
 */
export interface Selfie {
  /** @field id - Unique primary key for the selfie record. */
  id: number;
  /** @field key - The S3 Key identifier string for retrieving the object from storage. */
  key: string;
  /** @field url - The fully qualified URL used to access the image in the S3 bucket. */
  url: string;
}

// --- RUNTIME VALIDATION LOGIC ---

/**
 * Validates a Player object at runtime.
 * Throws explicit errors if required fields are missing or malformed.
 * This prevents data corruption or the use of fallback values.
 * * @param {unknown} data - The raw data to validate.
 * @throws {Error} - Throws a specific error if validation fails.
 */
export function validatePlayer(data: any): Player {
  if (typeof data.id !== 'number') throw new Error("Player Validation Failed: 'id' must be a number.");
  if (!Array.isArray(data.targets)) throw new Error("Player Validation Failed: 'targets' must be an array.");
  if (!Array.isArray(data.hideList)) throw new Error("Player Validation Failed: 'hideList' must be an array.");
  if (typeof data.selfieId !== 'number') throw new Error("Player Validation Failed: 'selfieId' must be a number.");

  // Return the data as the validated Player type
  return data as Player;
}

/**
 * Validates a Selfie object at runtime.
 * Throws explicit errors if required fields are missing or malformed.
 * * @param {unknown} data - The raw data to validate.
 * @throws {Error} - Throws a specific error if validation fails.
 */
export function validateSelfie(data: any): Selfie {
  if (typeof data.id !== 'number') throw new Error("Selfie Validation Failed: 'id' must be a number.");
  if (typeof data.key !== 'string' || data.key.length === 0) throw new Error("Selfie Validation Failed: 'key' must be a non-empty string.");
  if (typeof data.url !== 'string' || !data.url.startsWith('http')) throw new Error("Selfie Validation Failed: 'url' must be a valid http string.");

  return data as Selfie;
}