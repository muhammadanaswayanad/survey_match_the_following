{
    'name': 'Survey Match Question',
    'version': '1.0',
    'summary': 'Adds Match the Following question type in Survey',
    'description': 'Extends the Survey module with a new question type for matching items',
    'category': 'Survey',
    'author': 'Odoo Community',
    'website': '',
    'license': 'LGPL-3',
    'depends': ['survey'],
    'data': [
        'security/ir.model.access.csv',
        'views/survey_question_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            '/survey_match_the_following/static/src/js/survey_match.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
