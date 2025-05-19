from odoo import fields, models


class SurveyMatchPair(models.Model):
    _name = 'survey.match.pair'
    _description = 'Survey Match Pair'
    _order = 'sequence, id'
    
    sequence = fields.Integer('Sequence', default=10)
    question_id = fields.Many2one('survey.question', string='Question', ondelete='cascade', required=True)
    left_option = fields.Char('Left Option', required=True, translate=True)
    right_option = fields.Char('Right Option', required=True, translate=True)
