import { FormGroup } from '@angular/forms';

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        const passwordInput = group.controls[passwordKey];
        const passwordConfirmationInput = group.controls[passwordConfirmationKey];
        if (passwordInput.value !== passwordConfirmationInput.value) {
            passwordConfirmationInput.setErrors({ 'notEquivalent': true });
            return ({ notEquivalent: true });
        } else {
            passwordConfirmationInput.setErrors(null);
            return;
        }
    };
}
