odoo.define('survey_match_the_following.match_render', function (require) {
'use strict';

const core = require('web.core');
const publicWidget = require('web.public.widget');
const _t = core._t;

publicWidget.registry.SurveyMatchQuestion = publicWidget.Widget.extend({
    selector: '.match_question_container',

    events: {
        'change .match-pair-select': '_onMatchPairChanged',
    },
    
    /**
     * @override
     */
    start: function () {
        var self = this;
        return this._super.apply(this, arguments).then(function () {
            self._initializeMatchQuestion();
        });
    },

    /**
     * Initialize the matching question UI
     */
    _initializeMatchQuestion: function () {
        const questionId = this.$el.data('question-id');
        
        if (!questionId) {
            console.warn('Question ID not found for match question');
            return;
        }
        
        // Fetch the match pairs for this question
        this._rpc({
            model: 'survey.question',
            method: 'read',
            args: [[questionId], ['match_pair_ids']],
        }).then(result => {
            if (result && result.length && result[0].match_pair_ids && result[0].match_pair_ids.length) {
                const matchPairIds = result[0].match_pair_ids;
                
                // Fetch the match pair details
                this._rpc({
                    model: 'survey.match.pair',
                    method: 'read',
                    args: [matchPairIds, ['left_option', 'right_option']],
                }).then(pairs => {
                    if (pairs && pairs.length) {
                        this._renderMatchPairs(questionId, pairs);
                    } else {
                        console.warn('No match pairs found for question', questionId);
                    }
                }).catch(error => {
                    console.error('Error fetching match pairs:', error);
                });
            } else {
                console.warn('No match_pair_ids found for question', questionId);
            }
        }).catch(error => {
            console.error('Error fetching question details:', error);
        });
    },

    /**
     * Render the match pairs UI
     */
    _renderMatchPairs: function (questionId, pairs) {
        var $container = this.$('.match-pairs-container');
        $container.empty();
        
        // Extract all right options for the dropdown
        var rightOptions = pairs.map(function (pair) {
            return pair.right_option;
        });
        
        // Shuffle the right options for display
        rightOptions = this._shuffleArray(rightOptions);
        
        // Create a row for each left option with a dropdown of right options
        pairs.forEach(function (pair, index) {
            var $row = $('<div/>', {
                'class': 'row match-pair-row mb-2',
                'data-left-option': pair.left_option
            });
            
            var $leftCol = $('<div/>', {
                'class': 'col-md-5 match-left-option',
                'text': pair.left_option
            });
            
            var $middleCol = $('<div/>', {
                'class': 'col-md-2 text-center'
            });
            
            var $rightCol = $('<div/>', {
                'class': 'col-md-5'
            });
            
            var $select = $('<select/>', {
                'class': 'form-select match-pair-select',
                'data-left-option': pair.left_option
            });
            
            // Add an empty default option
            $select.append($('<option/>', {
                'value': '',
                'text': _t('-- Select --')
            }));
            
            // Add all right options
            rightOptions.forEach(function (option) {
                $select.append($('<option/>', {
                    'value': option,
                    'text': option
                }));
            });
            
            $rightCol.append($select);
            $row.append($leftCol, $middleCol, $rightCol);
            $container.append($row);
        });
    },
    
    /**
     * Update the result when a match is selected
     */
    _onMatchPairChanged: function () {
        var results = {};
        var $selects = this.$('.match-pair-select');
        
        // Collect all selections
        $selects.each(function () {
            var $select = $(this);
            var leftOption = $select.data('left-option');
            var rightOption = $select.val();
            
            if (rightOption) {
                results[leftOption] = rightOption;
            }
        });
        
        // Update the hidden input with JSON results
        this.$('.match_result').val(JSON.stringify(results));
    },
    
    /**
     * Shuffle array elements (Fisher-Yates algorithm)
     */
    _shuffleArray: function (array) {
        var shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
});

return {
    SurveyMatchQuestion: publicWidget.registry.SurveyMatchQuestion
};
});
