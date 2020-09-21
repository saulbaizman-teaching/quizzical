let correct_answer_count = 0 ;
let answered_question_count = 0 ;
let total_question_count = jQuery('ul.answers').length ; // FIXME
// console.log ('total_question_count:',total_question_count) ;

jQuery(document).ready ( function ( ) {

    // Detect change in quiz selector menu. Send user to selected quiz.
    jQuery('#quiz_selector').on ( "change", function (event) {
        if ( jQuery('#quiz_selector').val() != '0' ) {
            // console.log ('#quiz_selector',jQuery('#quiz_selector').val());
            const url = new URL ( window.location ) ;
            url.searchParams.set( 'quizzy', jQuery('#quiz_selector').val()) ;
            window.location = url ;
        }
    } ) ;

jQuery('ul.answers li').on("mouseenter mouseleave", function (event) {
    jQuery(this).toggleClass("hover");

        });

        jQuery('ul.answers li').on('click', function (event) {
            console.log('clicked answer');
            answered_question_count += 1 ;
            // var class = jQuery(this).attr("class");
            let classes = this.classList;
            // console.log('classes',class);
            // console.log('classes', classes.length);
            // console.log('classes', classes.values());

            let question_class = classes[0];

            let is_correct_answer = false ;
            var iterator = classes.values();

            for(var value of iterator) {
                if ( value == 'is_correct' ) {
                    is_correct_answer = true ;
                    break ;
                }
            }

            if (is_correct_answer) {
                jQuery(this).addClass('correct_answer');
                correct_answer_count += 1;
            } else {
                jQuery(this).addClass('incorrect_answer');
                // find the correct answer
                jQuery('li.' + question_class + '.is_correct').addClass('correct_answer_not_selected');
            }

            // Get rid of the hover class.
            // jQuery(this).removeClass('hover');

            console.log('correct_answer_count:', correct_answer_count);

            console.log('question class:', question_class);
            // remove event handler.
            jQuery('li.' + question_class).off('click');
            jQuery('li.' + question_class).off('mouseenter');
            jQuery('li.' + question_class).off('mouseleave');

            // is this the last question?
            // if so, display a summary.
            if ( answered_question_count == total_question_count ) {
                jQuery('section#main').append ('<p class="summary">You got ' + correct_answer_count + ' out of ' + total_question_count + ' questions correct. Hooray!</p>') ;
jQuery('body')[0].scrollIntoView(false);

}

});

} ) ;
