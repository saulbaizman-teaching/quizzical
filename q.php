<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>quizzy</title>
    <link type="text/css" href="q.css" rel="stylesheet">
</head>
<body>
<section id="main">
    <h1>quizzy</h1>
    <?php
    $json = json_decode ( file_get_contents('01-html-basics.json')) ;
//var_dump($json);

$quiz = $json->quizzes[0] ;
$quiz_name = $quiz->quizname ;
    ?>

    <h2><?php printf ($quiz_name) ;?></h2>
    <?php
    $question_counter = 0 ;
    foreach ($quiz->questions as $question ) {
//	    var_dump($question);
	    printf ('<div id="quiz_body">') ;
        printf ('<div class="question_number"><h3>%1$02d.</h3></div><div class="question_details"><h3>%2$s</h3>', $question_counter+1, $question->question_text ) ;
	    printf ('<ul class="answers">') ;
	    $answer_counter = 0 ;
	    foreach ( $question->answers as $answer) {
	        printf('<li class="question%2$s answer%3$s %4$s">%1$s</li>',htmlentities($answer->answer_text), $question_counter, $answer_counter, $question->correct_answer == $answer_counter ? 'is_correct' : '' ) ;
		    $answer_counter++ ;
        }
	    printf('</ul>') ;
	    printf('</div>') ;
	    printf('</div>') ;
	    $question_counter++ ;
    }
    ?>
</section>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="application/javascript">
    let correct_answer_count = 0 ;
    let answered_question_count = 0 ;
    let total_question_count = <?php printf($question_counter)?>;

    jQuery(document).ready ( function ( ) {

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
</script>
</body>
</html>