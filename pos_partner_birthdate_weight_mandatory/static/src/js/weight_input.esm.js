/** @odoo-module */

import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { onMounted, useRef, useState } from "@odoo/owl";

// formerly TextInputPopupWidget
export class weightInputPopup extends AbstractAwaitablePopup {
    static template = "pos_partner_birthdate_weight_mandatory.weightInputPopup";
    static defaultProps = {
        confirmText: _t("Confirm"),
        confirmKey: "Enter",
        title: "",
        body: "",
        startingValue: "",
        placeholder: "",
    };
    setup() {
        super.setup();
        this.notification = useService("pos_notification");
        this.state = useState({ inputValue: this.props.startingValue });
        this.inputRef = useRef("input");
        onMounted(this.onMounted);
    }
    _onWindowKeyup(event) {
        if (event.key === this.props.confirmKey) {
            this.confirm();
        }else if( event.key === 'Escape') {
            return;
        } else {
            super._onWindowKeyup(...arguments);
        }
    }
    onMounted() {
        this.inputRef.el.focus();
    }
    getPayload() {
        const value = parseFloat(this.state.inputValue);
        return isNaN(value) ? 0 : value;
    }
    async confirm() {
        const payload = await this.getPayload();
        const isRequired = this.props.weightRequired;
        let message = "";

        const isValidWeight = payload && payload > 0;
        const isNegative = payload < 0;
        const isZero = payload === 0;

        if (isNegative) {
            message = _t("Invalid weight");
        } else if (isRequired && isZero) {
            message = _t("Weight is required");
        }
        if (message) {
            this.notification.add(message, 3000);
            if (isRequired || isNegative) return;
        }
        this.props.close({ confirmed: true, payload });
    }
    cancel() {
        this.props.close({ confirmed: false, payload: null });
    }
}
