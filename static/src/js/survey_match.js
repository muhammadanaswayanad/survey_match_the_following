odoo.define('survey_match_the_following.match', function (require) {
'use strict';

var publicWidget = require('web.public.widget');
var core = require('web.core');

publicWidget.registry.SurveyMatchQuestion = publicWidget.Widget.extend({
    selector: '.match_question_container',
    events: {
        'change select.match-dropdown': '_onMatchChange',
    },

    /**
     * @override
     */
    start: function () {
        var res = this._super.apply(this, arguments);
        return res;
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Handle selection change in match dropdowns
     *
     * @private
     * @param {Event} event
     */
    _onMatchChange: function (event) {
        var $select = $(event.currentTarget);
        var questionId = $select.data('question-id');
        var leftId = $select.data('left-id');
        var rightId = $select.val();
        
        // Optional: Add validation or UI enhancement here
        // For example, you could highlight matched pairs, prevent duplicate selections, etc.
    }
});

return publicWidget.registry.SurveyMatchQuestion;

});
