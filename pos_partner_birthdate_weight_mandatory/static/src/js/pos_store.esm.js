/** @odoo-module */

import {PosStore} from "@point_of_sale/app/store/pos_store";
import {patch} from "@web/core/utils/patch";
import {_t} from "@web/core/l10n/translation";
import {sprintf} from "@web/core/utils/strings";
import {weightInputPopup} from "@pos_partner_birthdate_weight_mandatory/js/weight_input.esm";

patch(PosStore.prototype, {
    async ageRestrictionDialog(partner){
        if (!partner || !partner.birthdate_date) return false;
        if (this.isUnderagePartner(partner.birthdate_date)) {
            let { confirmed, payload: weight } = await this.popup.add(weightInputPopup, {
                title: _t("Age Restriction"),
                body: sprintf(
                    _t("%s is under %s years old!"),
                    partner.name,
                    this.company.age_warning
                ),
                startingValue: partner.weight,
                weightRequired: this.company.weight_required
            });
            // Update partner's weight and sync to backend
            partner.weight = weight;
            const partnerId = await this.orm.call("res.partner", "create_from_ui", [{
                id: partner.id,
                weight: weight,
            }]);
            await this._loadPartners([partnerId]);
        }
    },
});
