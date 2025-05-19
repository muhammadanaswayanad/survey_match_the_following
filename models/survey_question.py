from odoo import api, fields, models, _


class SurveyQuestion(models.Model):
    _inherit = 'survey.question'

    question_type = fields.Selection(
        selection_add=[('match', 'Match the Following')],
        ondelete={'match': 'set default'}
    )
    match_pair_ids = fields.One2many(
        'survey.match.pair',
        'question_id',
        string='Match Pairs'
    )

    def get_match_pairs(self):
        """Method to retrieve match pairs for a question through RPC"""
        self.ensure_one()
        return [{
            'id': pair.id,
            'left_option': pair.left_option,
            'right_option': pair.right_option
        } for pair in self.match_pair_ids]
