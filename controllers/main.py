from odoo import http
from odoo.addons.survey.controllers.main import Survey
from odoo.http import request
import json

class SurveyMatchExtended(Survey):
    
    @http.route('/survey/submit/<string:survey_token>/<string:answer_token>', type='json', auth='public', website=True)
    def survey_submit(self, survey_token, answer_token, **post):
        """ Extend to handle match questions """
        result = super(SurveyMatchExtended, self).survey_submit(survey_token, answer_token, **post)
        
        # Get current user input
        access_data = self._get_access_data(survey_token, answer_token, ensure_token=True)
        if not access_data['validity_code']:
            return {'error': access_data['validity_code']}
            
        user_input = access_data['user_input']
        question = request.env['survey.question'].browse(int(post.get('question_id')))
        
        # Handle match questions
        if question.exists() and question.question_type == 'match':
            answer_values = {}
            for key, value in post.items():
                if key.startswith('match_') and value:
                    answer_values[key] = value
                    
            if answer_values:
                # Store answer as JSON in user_input_line
                user_input_line_values = {
                    'user_input_id': user_input.id,
                    'question_id': question.id,
                    'answer_type': 'text',  # Store match answers as text (JSON)
                    'value_text_box': json.dumps(answer_values),
                    'skipped': False,
                }
                request.env['survey.user_input.line'].create(user_input_line_values)
                
        return result
