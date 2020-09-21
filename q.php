<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>quizzy</title>
    <link type="text/css" href="q.css" rel="stylesheet">
</head>
<body>
<section id="main">
    <h1><a href="<?php printf($_SERVER['PHP_SELF']) ;?>">quizzy</a></h1>

    <select id="quiz_selector">
        <?php
        printf ( '<option value="0">%1$s</option>', 'choose a quiz') ;
        foreach ( glob('*.json') as $quiz_file ) {
	        $selected = ( isset ( $_GET['quizzy'] ) ) && ( $_GET['quizzy'] == basename ( $quiz_file, '.json' ) ) ? 'selected' : '' ;
            printf ( '<option value="%1$s" %2$s>%1$s</option>', basename ( $quiz_file, '.json' ), $selected) ;

        }
        ?>
    </select>
    <?php
    if ( isset ( $_GET['quizzy'] ) ) :

    if ( ! file_exists($_GET['quizzy'] . '.json') ) {
        printf ('<p>Sorry, no quiz by the name <strong>%s</strong>!</p>', $_GET['quizzy']) ;
	    print_footer ();
        die() ;
    }
    $json = json_decode ( file_get_contents ($_GET['quizzy'] . '.json' ) ) ;
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
<?php
endif ;

print_footer () ;

function print_footer () {
    ?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="q.js"></script>
</body>
</html>
  <?php
}
