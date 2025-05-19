from odoo import fields, models


class SurveyMatchPair(models.Model):
    _name = 'survey.match.pair'
    _description = 'Survey Match Pairs'
    _order = 'sequence, id'

    sequence = fields.Integer(default=10)
    question_id = fields.Many2one('survey.question', string='Question', ondelete='cascade', required=True)
    left_option = fields.Char('Left Option', required=True, translate=True)
    right_option = fields.Char('Right Option', required=True, translate=True)
    
    _sql_constraints = [
        ('unique_left_option_per_question', 
         'UNIQUE(question_id, left_option)', 
         'Left options must be unique per question'),
    ]
