import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const ROLES = {
    VENDOR: 0,
    STORER: 1,
    ADMIN: 2
};

export const PERMISIONS = {
    USER_REGISTRATION: 0,
    PRICE_EDITION: 1
};

export const SNACKBAR_CONFIG: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom'
};
