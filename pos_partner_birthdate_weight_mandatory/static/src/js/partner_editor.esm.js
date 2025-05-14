/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { PartnerDetailsEdit } from "@point_of_sale/app/screens/partner_list/partner_editor/partner_editor";
import { patch } from "@web/core/utils/patch";
import { sprintf } from "@web/core/utils/strings";
import {weightInputPopup} from "@pos_partner_birthdate_weight_mandatory/js/weight_input.esm";

patch(PartnerDetailsEdit.prototype, {
    async checkAgeRestriction(partnerName) {
        const weight = this.changes.weight ?? this.props.partner.weight;
        const { payload } = await this.popup.add(weightInputPopup, {
            title: _t("Age Restriction"),
            body: sprintf(
                _t("%s is under %s years old!"),
                partnerName,
                this.pos.company.age_warning
            ),
            startingValue: weight,
            weightRequired: this.pos.company.weight_required,
        });
        this.changes.weight = payload;
    }
});
