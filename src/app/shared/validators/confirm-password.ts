import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmPasswordValidator: ValidatorFn =
  (control: AbstractControl): ValidationErrors | null => {

    const password = control.get('password');
    const confirm  = control.get('confirmPassword');

    if (!password || !confirm) return null;

    if (confirm.errors && !confirm.errors['passwordMismatch']) {
      return null;
    }

    if (password.value !== confirm.value) {
      confirm.setErrors({ passwordMismatch: true });
    } else {
      confirm.setErrors(null);
    }

    return null;
};