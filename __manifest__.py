{
    'name': 'Survey Match the Following Questions',
    'version': '17.0.1.0.0',
    'category': 'Survey',
    'summary': 'Add "Match the Following" question types to Odoo surveys',
    'description': """
This module adds a new question type "Match the Following" to Odoo surveys.
Users can create match pairs where respondents need to match left options with right options.
""",
    'depends': ['survey'],
    'data': [
        'security/ir.model.access.csv',
        'views/survey_question_views.xml',
        'views/survey_survey_views.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'survey_match_the_following/static/src/js/match_render.js',
            'survey_match_the_following/static/src/css/match_question.css',
        ]
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
