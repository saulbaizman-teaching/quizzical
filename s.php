<!DOCTYPE html>
<html lang="en" dir="ltr">
     <head>
          <meta charset="utf-8">
          <title>statistics</title>
          <link type="text/css" href="q.css" rel="stylesheet">
     </head>
     <body>
     <section id="main">
     <h1><a href="<?php printf($_SERVER['PHP_SELF']) ;?>"><span id="q">quiz</span>zical stats</a></h1>
<section id="main">

<select id="quiz_selector_stats">
    <?php
    printf ( '<option value="0">%1$s</option>', 'choose a quiz') ;
    foreach ( glob('*.json') as $quiz_file ) {
        $selected = ( isset ( $_GET['quiz'] ) ) && ( $_GET['quiz'] == basename ( $quiz_file, '.json' ) ) ? 'selected' : '' ;
        printf ( '<option value="%1$s" %2$s>%1$s</option>', basename ( $quiz_file, '.json' ), $selected) ;
    }
    ?>
</select>
<div id="stats"></div>
</section>

<?php print_footer () ; ?>

<?php
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
