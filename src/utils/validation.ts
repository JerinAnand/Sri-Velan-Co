/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  value: string | number;
}

/**
 * Validates a value based on the field ID and its logical constraints.
 * Enforces non-negativity and sets realistic, safe upper bounds for all numeric inputs.
 */
export function validateFieldValue(id: string, val: string | number): ValidationResult {
  // 1. Check for negative numbers inside any input (numeric or string specs)
  const valStr = String(val).trim();
  
  // Regex to check for standalone negative numbers, e.g. "-5", "- 5", but ignoring year ranges like "2024-2026"
  // Let's check if there is a negative sign immediately preceding a digit, or after space/start of string
  const hasNegativeNumber = /(?:^|\s)-(\d+(\.\d+)?)/.test(valStr);
  if (hasNegativeNumber) {
    return {
      isValid: false,
      error: 'Value cannot contain negative numbers. All counts and specifications must be non-negative.',
      value: val,
    };
  }

  // 2. Specific Field Validations
  
  // Years of Legacy: 1 to 100
  if (id === 'home_years_of_legacy') {
    const num = Number(val);
    if (isNaN(num)) {
      return { isValid: false, error: 'Years of legacy must be a valid number.', value: val };
    }
    if (num < 1 || num > 100) {
      return {
        isValid: false,
        error: 'Years of legacy must be between 1 and 100 years.',
        value: Math.min(Math.max(num, 1), 100),
      };
    }
    return { isValid: true, value: num };
  }

  // Year Established: 1900 to 2026
  if (id === 'company_year_established') {
    const num = Number(val);
    if (isNaN(num)) {
      return { isValid: false, error: 'Year established must be a valid number.', value: val };
    }
    if (num < 1900 || num > 2026) {
      return {
        isValid: false,
        error: 'Year established must be a realistic year between 1900 and 2026.',
        value: Math.min(Math.max(num, 1900), 2026),
      };
    }
    return { isValid: true, value: num };
  }

  // Government Registrations: 0 to 100
  if (id === 'home_gov_registrations') {
    const num = Number(val);
    if (isNaN(num)) {
      return { isValid: false, error: 'Registrations must be a valid number.', value: val };
    }
    if (num < 0 || num > 100) {
      return {
        isValid: false,
        error: 'Government registrations count must be between 0 and 100.',
        value: Math.min(Math.max(num, 0), 100),
      };
    }
    return { isValid: true, value: num };
  }

  // Heavy Machineries: 0 to 10000
  if (id === 'home_heavy_machineries') {
    const num = Number(val);
    if (isNaN(num)) {
      return { isValid: false, error: 'Heavy machineries fleet size must be a valid number.', value: val };
    }
    if (num < 0 || num > 10000) {
      return {
        isValid: false,
        error: 'Heavy machineries fleet size must be between 0 and 10,000.',
        value: Math.min(Math.max(num, 0), 10000),
      };
    }
    return { isValid: true, value: num };
  }

  // Project Counters (Zonal Records)
  if (id.startsWith('zone_pumpsDeployed_')) {
    const num = Number(val);
    if (isNaN(num)) {
      return { isValid: false, error: 'Active pumps must be a valid number.', value: val };
    }
    if (num < 0 || num > 200) {
      return {
        isValid: false,
        error: 'Active pumps deployed per zone must be between 0 and 200.',
        value: Math.min(Math.max(num, 0), 200),
      };
    }
    return { isValid: true, value: num };
  }

  if (id.startsWith('zone_activeStaff_')) {
    const num = Number(val);
    if (isNaN(num)) {
      return { isValid: false, error: 'On-field staff count must be a valid number.', value: val };
    }
    if (num < 0 || num > 300) {
      return {
        isValid: false,
        error: 'On-field staff count per zone must be between 0 and 300.',
        value: Math.min(Math.max(num, 0), 300),
      };
    }
    return { isValid: true, value: num };
  }

  if (id.startsWith('zone_floodsManaged_')) {
    const num = Number(val);
    if (isNaN(num)) {
      return { isValid: false, error: 'Completed relief projects must be a valid number.', value: val };
    }
    if (num < 0 || num > 1000) {
      return {
        isValid: false,
        error: 'Completed relief projects per zone must be between 0 and 1,000.',
        value: Math.min(Math.max(num, 0), 1000),
      };
    }
    return { isValid: true, value: num };
  }

  // Milestone Year: single year or range, e.g. "2006", "2024 - 2026"
  if (id.startsWith('milestone_year_')) {
    // If it contains a range like "2024 - 2026", validate both sides
    const parts = valStr.split(/[-–—]/).map(p => p.trim());
    for (const part of parts) {
      const num = Number(part);
      if (!isNaN(num) && part !== '') {
        if (num < 1900 || num > 2100) {
          return {
            isValid: false,
            error: `Milestone year (${part}) must be a realistic year between 1900 and 2100.`,
            value: val,
          };
        }
      }
    }
    return { isValid: true, value: val };
  }

  // Equipment Specifications (`eq_spec_`)
  if (id.startsWith('eq_spec_')) {
    // Extract first number (integer or decimal) in the spec string to apply logical bounds
    const match = valStr.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const firstNum = Number(match[1]);
      const lowerId = id.toLowerCase();
      
      // Limit rules based on parameter keywords
      if (lowerId.includes('capacity') || lowerId.includes('discharge') || lowerId.includes('l/min')) {
        if (firstNum < 0 || firstNum > 50000) {
          return {
            isValid: false,
            error: 'Discharge capacity cannot exceed 50,000 L/min to preserve technical integrity.',
            value: val,
          };
        }
      } else if (lowerId.includes('speed') || lowerId.includes('priming')) {
        if (firstNum < 0 || firstNum > 600) {
          return {
            isValid: false,
            error: 'Priming speed cannot exceed 600 seconds.',
            value: val,
          };
        }
      } else if (lowerId.includes('solid') || lowerId.includes('diameter') || lowerId.includes('handling')) {
        if (firstNum < 0 || firstNum > 500) {
          return {
            isValid: false,
            error: 'Solid handling diameter cannot exceed 500 mm.',
            value: val,
          };
        }
      } else if (lowerId.includes('autonomy') || lowerId.includes('fuel') || lowerId.includes('run_time')) {
        if (firstNum < 0 || firstNum > 1000) {
          return {
            isValid: false,
            error: 'Fuel autonomy cannot exceed 1,000 hours/liters.',
            value: val,
          };
        }
      } else if (lowerId.includes('head') || lowerId.includes('meters') || lowerId.includes('height')) {
        if (firstNum < 0 || firstNum > 500) {
          return {
            isValid: false,
            error: 'Total dynamic head cannot exceed 500 meters.',
            value: val,
          };
        }
      } else if (lowerId.includes('engine') || lowerId.includes('hp') || lowerId.includes('power')) {
        if (firstNum < 0 || firstNum > 2000) {
          return {
            isValid: false,
            error: 'Engine horsepower rating cannot exceed 2,000 HP.',
            value: val,
          };
        }
      }
    }
  }

  // Valid by default if no constraints are violated
  return { isValid: true, value: val };
}

/**
 * Returns a helpful description of the logical bounds for a given field.
 */
export function getFieldBoundsDescription(id: string): string {
  if (id === 'home_years_of_legacy') return 'Valid range: 1 to 100 years';
  if (id === 'company_year_established') return 'Valid range: 1900 to 2026';
  if (id === 'home_gov_registrations') return 'Valid range: 0 to 100';
  if (id === 'home_heavy_machineries') return 'Valid range: 0 to 10,000';
  if (id.startsWith('zone_pumpsDeployed_')) return 'Valid range: 0 to 200 pumps';
  if (id.startsWith('zone_activeStaff_')) return 'Valid range: 0 to 300 staff';
  if (id.startsWith('zone_floodsManaged_')) return 'Valid range: 0 to 1,000 completed projects';
  if (id.startsWith('milestone_year_')) return 'Realistic years must be between 1900 and 2100';
  
  const lowerId = id.toLowerCase();
  if (id.startsWith('eq_spec_')) {
    if (lowerId.includes('capacity') || lowerId.includes('discharge') || lowerId.includes('l/min')) {
      return 'Max safe capacity: 50,000 L/min';
    }
    if (lowerId.includes('speed') || lowerId.includes('priming')) {
      return 'Max priming speed: 600 sec';
    }
    if (lowerId.includes('solid') || lowerId.includes('diameter') || lowerId.includes('handling')) {
      return 'Max solids diameter: 500 mm';
    }
    if (lowerId.includes('autonomy') || lowerId.includes('fuel') || lowerId.includes('run_time')) {
      return 'Max operational runtime: 1,000 hours';
    }
    if (lowerId.includes('head') || lowerId.includes('meters') || lowerId.includes('height')) {
      return 'Max safe head lift: 500 meters';
    }
    if (lowerId.includes('engine') || lowerId.includes('hp') || lowerId.includes('power')) {
      return 'Max power rating: 2,000 HP';
    }
    return 'Must be non-negative';
  }

  return 'Must be non-negative';
}
