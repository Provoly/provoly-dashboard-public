import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DateUtils {
  static formatDate(date: Date) {
    // prettier-ignore
    return `${date.getFullYear()}-${(date.getMonth() + 1 + "").padStart(2, "0")}-${(date.getDate() + "").padStart(2, "0")}T${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  static onlyPastDateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    if (new Date(control.value) <= today) {
      return null;
    } else {
      return { dateValidator: { valid: false } };
    }
  }

  /**
   * Converts a string date into an ISO-8601 string format
   *
   * Works with this formats :
   *  - "YYYY-MM-DD" : '2024-12-31' --> '2024-12-31T00:00:00.000Z'
   *  - "MM/DD/YYYY" : '12/31/2024' --> '2024-12-30T23:00:00.000Z' (format FR donc prise en compte de la locale : UTC+1)
   *  - "YYYY" : '2025' --> '2025-01-01T00:00:00.000Z'
   *
   * @param dateAsString the date to convert (example : 2024-12-31)
   * @see Date.parse
   * @see Date.toISOString
   */
  static parseToIsoString(dateAsString: string): string {
    try {
      return new Date(Date.parse(dateAsString)).toISOString();
    } catch (error) {
      return '';
    }
  }

  static isInTheFuture(date: Date): boolean {
    return new Date(date) > new Date(DateUtils.formatDate(new Date()));
  }
}
