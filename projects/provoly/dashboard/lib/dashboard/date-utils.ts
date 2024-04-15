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

  static isInTheFuture(date: Date): boolean {
    return new Date(date) > new Date(DateUtils.formatDate(new Date()));
  }
}
