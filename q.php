<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>quizzical | quiz</title>
    <link type="text/css" href="q.css" rel="stylesheet">
</head>
<body>
<section id="main">
    <h1><a href="<?php printf($_SERVER['PHP_SELF']) ;?>"><span id="q">quiz</span>zical</a></h1>

    <select id="quiz_selector">
        <?php
        printf ( '<option value="0">%1$s</option>', 'choose a quiz') ;
        foreach ( glob('*.json') as $quiz_file ) {
            $selected = ( isset ( $_GET['quiz'] ) ) && ( $_GET['quiz'] == basename ( $quiz_file, '.json' ) ) ? 'selected' : '' ;
            printf ( '<option value="%1$s" %2$s>%1$s</option>', basename ( $quiz_file, '.json' ), $selected) ;
        }
        ?>
    </select>
    <div id="student_name_container"><strong>Email:</strong> <span id="student_name"></span> <small>[<a href="javascript:save_student_name();" id="edit_name">edit</a>]</small></div>
    <?php
    if ( isset ( $_GET['quiz'] ) ) :

    if ( ! file_exists($_GET['quiz'] . '.json') ) {
        printf ('<p>Sorry, no quiz by the name <strong>%s</strong>!</p>', $_GET['quiz']) ;
	    print_footer ();
	    die() ;
    }
    $json = json_decode ( file_get_contents ($_GET['quiz'] . '.json' ) ) ;
    //var_dump($json);

    $quiz = $json->quizzes[0] ;
    $quiz_name = $quiz->quizname ;
    ?>

    <h2><?php printf ($quiz_name) ;?></h2>
    <?php
    $question_counter = 0 ;
    foreach ($quiz->questions as $question ) {
//	    var_dump($question);
        printf ('<div class="quiz_body q%d">',$question_counter) ;
        printf ('<div class="question_number"><h3>%1$02d.</h3></div><div class="question_details"><h3>%2$s</h3>', $question_counter+1, htmlentities($question->question_text )) ;
        printf ('<div class="answers">') ;
        $answer_counter = 0 ;
        foreach ( $question->answers as $answer) {
            printf('<div class="question%2$s answer%3$s %4$s answer">%1$s</div><div class="icon">&nbsp;</div>',htmlentities($answer->answer_text), $question_counter, $answer_counter, $question->correct_answer == $answer_counter ? 'is_correct' : '' ) ;
            $answer_counter++ ;
        }
        printf('</div>') ;

        if (isset($question->explanation) ) {
            printf ('<div class="question%2$s explanation">%1$s</div>', $question->explanation, $question_counter) ;
                
        }
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
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.21.0/firebase-firestore.js"></script>

<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<!-- Local scripts -->
<script src="q.js"></script>
</body>
</html>
  <?php
}
