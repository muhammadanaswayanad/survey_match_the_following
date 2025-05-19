from odoo import api, fields, models, _


class SurveyQuestion(models.Model):
    _inherit = 'survey.question'

    question_type = fields.Selection(
        selection_add=[('match', 'Match the Following')],
        ondelete={'match': 'set default'}
    )
    match_pair_ids = fields.One2many('survey.match.pair', 'question_id', string='Match Pairs')
    match_correct_pairs_count = fields.Integer(compute='_compute_match_pairs_stats', string='Correct Pairs Count')

    @api.depends('match_pair_ids')
    def _compute_match_pairs_stats(self):
        for question in self:
            question.match_correct_pairs_count = len(question.match_pair_ids)

    def _prepare_user_input_line_values(self, user_input, answer=None, answer_fname=None, answer_type=None):
        """Override to handle match questions"""
        vals = super()._prepare_user_input_line_values(user_input, answer, answer_fname, answer_type)
        
        if self.question_type == 'match' and answer:
            vals.update({
                'answer_type': 'match',
                'value_match_pairs': answer,
            })
        
        return vals

    def _is_match_correct(self, user_answer):
        """Check if match answer is correct"""
        self.ensure_one()
        if self.question_type != 'match':
            return False
            
        try:
            user_pairs = {}
            if user_answer:
                # Convert from string to dict if needed
                if isinstance(user_answer, str):
                    import json
                    user_pairs = json.loads(user_answer)
                else:
                    user_pairs = user_answer
                    
            correct_pairs = {str(pair.left_option): str(pair.right_option) 
                            for pair in self.match_pair_ids}
            
            # All pairs must match for the answer to be correct
            if len(user_pairs) != len(correct_pairs):
                return False
                
            for left, right in user_pairs.items():
                if left not in correct_pairs or correct_pairs[left] != right:
                    return False
            
            return True
            
        except Exception:
            return False
