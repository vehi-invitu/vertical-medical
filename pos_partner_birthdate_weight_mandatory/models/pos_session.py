# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).

from odoo import models


class POSSession(models.Model):
    _inherit = "pos.session"

    def _loader_params_res_partner(self):
        res = super()._loader_params_res_partner()
        res["search_params"]["fields"].append("weight")
        res["search_params"]["fields"].append("weight_uom")
        return res

    def _loader_params_res_company(self):
        res = super()._loader_params_res_company()
        res["search_params"]["fields"].append("weight_required")
        return res
