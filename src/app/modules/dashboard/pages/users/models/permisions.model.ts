export class PermisionsModel {
    user_registration: boolean;
    price_edition: boolean;
    create_edit_promotions: boolean;

    public constructor(
        fields: {
            user_registration: boolean,
            price_edition: boolean,
            create_edit_promotions: boolean
        }) {
        Object.assign(this, fields);
    }
}
