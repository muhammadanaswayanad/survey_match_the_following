from odoo import models, fields, api

class SurveyQuestion(models.Model):
    _inherit = 'survey.question'

    question_type = fields.Selection(
        selection_add=[('match', 'Match the Following')],
        # Changed to 'cascade' since 'set default' requires a default value
        ondelete={'match': 'cascade'}
    )

    match_pair_ids = fields.One2many(
        'survey.match.pair',
        'question_id',
        string='Match Pairs'
    )


class SurveyMatchPair(models.Model):
    _name = 'survey.match.pair'
    _description = 'Matching Pair'
    _order = 'sequence, id'

    question_id = fields.Many2one('survey.question', required=True, ondelete='cascade')
    left_text = fields.Char(required=True, string="Left Item")
    right_text = fields.Char(required=True, string="Right Item")
    sequence = fields.Integer(default=10)
