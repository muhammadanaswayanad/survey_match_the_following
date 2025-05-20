odoo.define('survey_match_the_following.match_question', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');
    var core = require('web.core');

    publicWidget.registry.SurveyFormWidget.include({
        /**
         * Initialize match questions
         * 
         * @override
         */
        start: function () {
            var self = this;
            return this._super.apply(this, arguments).then(function () {
                // Initialize match questions if they exist
                if (self.$('div.match_question_container').length) {
                    self.$('div.match_question_container select').on('change', function () {
                        self._onMatchSelectionChange($(this));
                    });
                }
            });
        },

        /**
         * Handle the change event on match question dropdowns
         * 
         * @param {jQuery} $select - The dropdown that changed
         */
        _onMatchSelectionChange: function ($select) {
            // Implement any logic needed when a match selection changes
            // For example, validation or visual feedback
        },

        /**
         * Add match questions answers to the form submission
         * 
         * @override
         */
        _prepareSubmitValues: function (formData, params) {
            this._super.apply(this, arguments);
            
            // Add match question answers to the form data
            this.$('div.match_question_container').each(function () {
                var $container = $(this);
                var questionId = $container.data('question-id');
                
                $container.find('select').each(function () {
                    var $select = $(this);
                    var pairId = $select.data('left-id');
                    var value = $select.val();
                    
                    if (value) {
                        // Add to the form data
                        formData.append('match_answer_' + pairId, value);
                    }
                });
            });
        }
    });
});
