from odoo import models, fields, api

class SurveyUserInputLine(models.Model):
    _inherit = 'survey.user_input.line'

    def save_lines(self, user_input, question, answer_type, answers, comment=None):
        if question.question_type == 'match':
            # Special handling for match questions
            vals_list = []
            for answer_key, answer_val in answers.items():
                if answer_key.startswith('match_answer_'):
                    # Extract the pair ID from the key
                    pair_id = int(answer_key.split('_')[-1])
                    
                    vals = {
                        'user_input_id': user_input.id,
                        'question_id': question.id,
                        'answer_type': 'text',
                        'value_text': answer_val,
                        'value_text_box': f"pair_{pair_id}:{answer_val}"
                    }
                    vals_list.append(vals)
            
            # Create the lines
            if vals_list:
                return self.create(vals_list)
            return self
        else:
            # For other question types, use the standard method
            return super(SurveyUserInputLine, self).save_lines(user_input, question, answer_type, answers, comment)

class SurveyQuestion(models.Model):
    _inherit = 'survey.question'

    def _get_match_correct_answers(self):
        """Return the correct answers for match questions."""
        self.ensure_one()
        if self.question_type != 'match':
            return {}
            
        return {pair.id: pair.right_text for pair in self.match_pair_ids}

    def compare_answer(self, user_input, answer, answer_type):
        """Extended to handle match questions."""
        if self.question_type == 'match':
            if answer_type != 'text':
                return False
                
            # Get the correct matching
            correct_answers = self._get_match_correct_answers()
            
            # Parse the user's answer
            if ':' in answer:
                pair_id_str, user_answer = answer.split(':', 1)
                pair_id = int(pair_id_str.replace('pair_', ''))
                
                # Check if the answer is correct
                return correct_answers.get(pair_id) == user_answer
            return False
        return super(SurveyQuestion, self).compare_answer(user_input, answer, answer_type)
