odoo.define('survey_match_the_following.match_render', function (require) {
'use strict';

const core = require('web.core');
const publicWidget = require('web.public.widget');
const SurveyFormWidget = require('survey.form');
const _t = core._t;

publicWidget.registry.SurveyFormWidget.include({
    /**
     * @override
     */
    init: function () {
        this._super.apply(this, arguments);
        this.matchConnections = {};
    },

    /**
     * @override
     */
    start: function () {
        var def = this._super.apply(this, arguments);
        this.$('.o_survey_match_question').each((index, element) => this._setupMatchQuestion($(element)));
        return def;
    },

    /**
     * Setup the match question interaction
     * @param {jQuery} $matchQuestion
     * @private
     */
    _setupMatchQuestion: function ($matchQuestion) {
        const questionId = $matchQuestion.data('question-id');
        this.matchConnections[questionId] = {};
        
        // Set up the left options click handlers
        $matchQuestion.find('.o_survey_match_left_item').on('click', (event) => {
            const $target = $(event.currentTarget);
            $matchQuestion.find('.o_survey_match_left_item').removeClass('active');
            $target.addClass('active');
        });

        // Set up the right options click handlers
        $matchQuestion.find('.o_survey_match_right_item').on('click', (event) => {
            const $target = $(event.currentTarget);
            const $activeLeft = $matchQuestion.find('.o_survey_match_left_item.active');

            if ($activeLeft.length === 0) {
                this._showMatchError(_t("Please select a left item first"));
                return;
            }

            // Get the ids
            const leftId = $activeLeft.data('option-id');
            const rightId = $target.data('option-id');

            // Remove any previous connection for this left item
            this._removeConnectionForLeft($matchQuestion, leftId);

            // Create visual connection
            this._createConnection($matchQuestion, leftId, rightId);

            // Store the connection
            this.matchConnections[questionId][leftId] = rightId;

            // Update hidden field with JSON data
            this._updateMatchInput(questionId);

            // Reset active state
            $activeLeft.removeClass('active');
        });

        // Setup the clear button
        $matchQuestion.find('.o_survey_match_clear_btn').on('click', () => {
            this._clearAllConnections($matchQuestion, questionId);
        });
    },

    /**
     * Remove connection for a left item
     * @param {jQuery} $matchQuestion
     * @param {string} leftId
     * @private
     */
    _removeConnectionForLeft: function ($matchQuestion, leftId) {
        const questionId = $matchQuestion.data('question-id');
        const previousRightId = this.matchConnections[questionId][leftId];
        
        if (previousRightId) {
            $matchQuestion.find(`.o_survey_match_connection[data-left-id="${leftId}"]`).remove();
            delete this.matchConnections[questionId][leftId];
        }
    },

    /**
     * Create a visual connection between left and right items
     * @param {jQuery} $matchQuestion
     * @param {string} leftId
     * @param {string} rightId
     * @private
     */
    _createConnection: function ($matchQuestion, leftId, rightId) {
        const $leftItem = $matchQuestion.find(`.o_survey_match_left_item[data-option-id="${leftId}"]`);
        const $rightItem = $matchQuestion.find(`.o_survey_match_right_item[data-option-id="${rightId}"]`);
        
        const $connection = $('<div>').addClass('o_survey_match_connection')
            .attr('data-left-id', leftId)
            .attr('data-right-id', rightId);
            
        $matchQuestion.find('.o_survey_match_connections').append($connection);
            
        // Highlight the connected items
        $leftItem.addClass('connected');
        $rightItem.addClass('connected');
    },

    /**
     * Update the hidden input field with the current connections
     * @param {number} questionId
     * @private
     */
    _updateMatchInput: function (questionId) {
        const $input = $(`input[name="question_${questionId}"]`);
        $input.val(JSON.stringify(this.matchConnections[questionId]));
    },

    /**
     * Clear all connections for a match question
     * @param {jQuery} $matchQuestion
     * @param {number} questionId
     * @private
     */
    _clearAllConnections: function ($matchQuestion, questionId) {
        $matchQuestion.find('.o_survey_match_connection').remove();
        $matchQuestion.find('.o_survey_match_left_item, .o_survey_match_right_item').removeClass('connected active');
        this.matchConnections[questionId] = {};
        this._updateMatchInput(questionId);
    },

    /**
     * Show an error message for match questions
     * @param {string} message
     * @private
     */
    _showMatchError: function (message) {
        // Simple error display, can be enhanced later
        alert(message);
    },

    /**
     * @override
     */
    _validateForm: function () {
        // Check match questions
        const $matchQuestions = this.$('.o_survey_form .o_survey_match_question:not(.d-none)');
        let errors = [];

        $matchQuestions.each((index, element) => {
            const $question = $(element);
            const questionId = $question.data('question-id');
            const isRequired = $question.data('required');
            const connections = Object.keys(this.matchConnections[questionId] || {}).length;
            const totalLeftOptions = $question.find('.o_survey_match_left_item').length;
            
            if (isRequired && connections < totalLeftOptions) {
                errors.push({
                    $el: $question,
                    message: _t("Please match all items")
                });
            }
        });

        // Combine with other validations
        return this._super.apply(this, arguments).then((baseErrors) => {
            return baseErrors.concat(errors);
        });
    }
});

});
