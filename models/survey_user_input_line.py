from odoo import fields, models, api


class SurveyUserInputLine(models.Model):
    _inherit = 'survey.user_input.line'

    answer_type = fields.Selection(
        selection_add=[('match', 'Match')],
        ondelete={'match': 'cascade'}
    )
    value_match_pairs = fields.Text('Match Pairs')
    
    @api.depends('value_match_pairs', 'question_id')
    def _compute_answer_score(self):
        """Extend to compute score for match questions"""
        super()._compute_answer_score()
        
        for line in self:
            if line.answer_type == 'match' and line.question_id.question_type == 'match':
                if line.question_id._is_match_correct(line.value_match_pairs):
                    line.answer_score = line.question_id.answer_score
                else:
                    line.answer_score = 0.0
