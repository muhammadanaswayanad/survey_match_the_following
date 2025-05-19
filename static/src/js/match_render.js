odoo.define('survey_match_the_following.match_render', function (require) {
'use strict';

var core = require('web.core');
var publicWidget = require('web.public.widget');
var SurveyFormWidget = require('survey.form');

SurveyFormWidget.include({
    /**
     * @override
     */
    init: function () {
        this._super.apply(this, arguments);
        this.matchResults = {};
    },
    
    /**
     * @override
     */
    start: function () {
        var self = this;
        return this._super.apply(this, arguments).then(function () {
            // Initialize match questions
            self._initMatchQuestions();
            
            // Handle match dropdown change
            self.$el.on('change', '.match-dropdown', function (ev) {
                self._onMatchDropdownChange(ev);
            });
        });
    },
    
    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------
    
    /**
     * Initialize match questions by loading any saved answers
     */
    _initMatchQuestions: function () {
        var self = this;
        this.$('.match_question_wrapper').each(function () {
            var $wrapper = $(this);
            var questionId = $wrapper.data('name');
            var $resultInput = $wrapper.find('.match_result_input');
            
            // Load existing answers if any
            try {
                self.matchResults[questionId] = JSON.parse($resultInput.val() || '{}');
                
                // Set dropdown values based on stored results
                $.each(self.matchResults[questionId], function (leftOption, rightOption) {
                    $wrapper.find('.match-dropdown[data-left-option="' + leftOption + '"]')
                            .val(rightOption);
                });
            } catch (e) {
                self.matchResults[questionId] = {};
                console.error('Failed to parse match results', e);
            }
        });
    },
    
    /**
     * Handle dropdown change and update hidden input with JSON result
     */
    _onMatchDropdownChange: function (ev) {
        var $select = $(ev.currentTarget);
        var $wrapper = $select.closest('.match_question_wrapper');
        var questionId = $wrapper.data('name');
        var leftOption = $select.data('left-option');
        var rightOption = $select.val();
        
        // Update results object
        if (!this.matchResults[questionId]) {
            this.matchResults[questionId] = {};
        }
        
        if (rightOption) {
            this.matchResults[questionId][leftOption] = rightOption;
        } else {
            delete this.matchResults[questionId][leftOption];
        }
        
        // Update hidden input
        $wrapper.find('.match_result_input').val(JSON.stringify(this.matchResults[questionId]));
    },
    
    /**
     * @override
     * Prepare form data before submit
     */
    prepareSubmitValues: function (formData, params) {
        this._super.apply(this, arguments);
        
        // Add match question answers to form data
        $('.match_question_wrapper').each(function () {
            var $wrapper = $(this);
            var questionId = $wrapper.data('name');
            var inputName = 'question_' + questionId;
            var $resultInput = $wrapper.find('.match_result_input');
            
            // Add the match results to the form data
            if ($resultInput.length) {
                formData.append(inputName, $resultInput.val());
            }
        });
    },
    
    /**
     * @override
     * Validate match questions
     */
    validateForm: function () {
        var self = this;
        var errors = this._super.apply(this, arguments) || [];
        
        // Validate match questions are fully answered
        $('.match_question_wrapper').each(function () {
            var $wrapper = $(this);
            var questionId = $wrapper.data('name');
            var isRequired = $wrapper.closest('.js_question-wrapper').hasClass('o_survey_form_required');
            
            if (isRequired) {
                var totalPairs = $wrapper.find('.match-pair-row').length;
                var answeredPairs = Object.keys(self.matchResults[questionId] || {}).length;
                
                if (answeredPairs < totalPairs) {
                    errors.push({
                        $el: $wrapper,
                        message: "Please complete all matches"
                    });
                }
            }
        });
        
        return errors.length ? errors : false;
    }
});

});
