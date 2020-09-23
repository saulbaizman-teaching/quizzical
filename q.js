let correct_answer_count = 0 ;
let answered_question_count = 0 ;
let total_question_count = jQuery('div.answers').length ; // FIXME
let play_sound = false ;
// console.log ('total_question_count:',total_question_count) ;

jQuery(document).ready ( function ( ) {

    // Detect change in quiz selector menu. Send user to selected quiz.
    jQuery('#quiz_selector').on ( "change", function (event) {
        if ( jQuery('#quiz_selector').val() != '0' ) {
            // console.log ('#quiz_selector',jQuery('#quiz_selector').val());
            const url = new URL ( window.location ) ;
            url.searchParams.set( 'quiz', jQuery('#quiz_selector').val()) ;
            window.location = url ;
        }
    } ) ;

    /* Mouse-over state toggle. */
    jQuery('div.answers div.answer').on("mouseenter mouseleave", function (event) {
        jQuery(this).toggleClass("hover");
    });

    /* When clicked, check if an answer is correct. */
    jQuery('div.answers div.answer').on('click', function (event) {
        // console.log('clicked answer');
        answered_question_count += 1 ;
        // var class = jQuery(this).attr("class");
        let classes = this.classList;
        // console.log('classes',class);
        // console.log('classes', classes.length);
        // console.log('classes', classes.values());

        let question_class = classes[0];
        console.log ("question_class:",question_class) ;
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
            let div_classes = jQuery(this).attr('class') ;
            let icon_selector = 'div.'+div_classes.replace(/ /g,'.')+'+div.icon' ;
            console.log('icon_selector:',icon_selector) ;
            jQuery(icon_selector).html('&#10004;');
            jQuery(icon_selector).addClass('correct');
            // console.log('this class:',jQuery(this).attr('class')) ;
            if ( play_sound ) {
                new Audio('mp4/yay.mp4').play();
            }
            correct_answer_count += 1;
        } else {
            jQuery(this).addClass('incorrect_answer');
            let div_classes = jQuery(this).attr('class') ;
            let icon_selector = 'div.'+div_classes.replace(/ /g,'.')+'+div.icon' ;
            jQuery(icon_selector).html('&#10008;');
            jQuery(icon_selector).addClass('incorrect');
            if ( play_sound ) {
                new Audio('mp4/sad-trombone.mp4').play();
            }
            // find the correct answer
            jQuery('div.' + question_class + '.is_correct').addClass('correct_answer_not_selected');
        }

        // Get rid of the hover class.
        // jQuery(this).removeClass('hover');

        console.log('correct_answer_count:', correct_answer_count);

        console.log('question class:', question_class);
        // remove event handler.
        jQuery('div.' + question_class).off('click');
        jQuery('div.' + question_class).off('mouseenter');
        jQuery('div.' + question_class).off('mouseleave');

        // is this the last question?
        // if so, display a summary.
        if ( answered_question_count == total_question_count ) {
            jQuery('section#main').append ('<p class="summary">You got ' + correct_answer_count + ' out of ' + total_question_count + ' questions correct. Hooray!</p>') ;
            jQuery('body')[0].scrollIntoView(false);
            if ( play_sound ) {
                if ( ( correct_answer_count/total_question_count) > .5 ) {
                    new Audio('mp4/applause.mp4').play();
                }
                else {
                    new Audio('mp4/slow-clap.mp4').play();
                }
            }

            }

    });

} ) ;
