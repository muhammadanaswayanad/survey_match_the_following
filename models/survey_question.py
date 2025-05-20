from odoo import models, fields

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


class SurveyMatchPair(models.Model):
    _name = 'survey.match.pair'
    _description = 'Matching Pair'

    question_id = fields.Many2one('survey.question', required=True, ondelete='cascade')
    left_text = fields.Char(required=True, string="Left Item")
    right_text = fields.Char(required=True, string="Right Item")
    sequence = fields.Integer(default=10)
