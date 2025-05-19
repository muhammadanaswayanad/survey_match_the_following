{
    'name': 'Survey Match The Following',
    'summary': 'Add "Match the Following" question type to Survey module',
    'description': """
        This module adds a new question type "Match the Following" to the Survey module.
        It allows creating matching questions where users need to pair items from two columns.
    """,
    'version': '17.0.1.0.0',
    'category': 'Marketing/Surveys',
    'author': 'Odoo Community Association (OCA)',
    'website': 'https://github.com/OCA/survey',
    'license': 'LGPL-3',
    'depends': ['survey'],
    'data': [
        'security/ir.model.access.csv',
        'views/survey_question_views.xml',
        'views/survey_survey_views.xml',
        'views/survey_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'survey_match_the_following/static/src/js/match_render.js',
            'survey_match_the_following/static/src/css/match_render.css',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
