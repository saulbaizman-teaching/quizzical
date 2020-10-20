let correct_answer_count = 0 ;
let answered_question_count = 0 ;
let total_question_count = jQuery('div.quiz_body').length ;
let play_sound = false ;
let debug = true ;

if ( debug ) {
    console.info ('debug is enabled.') ;
}

jQuery(document).ready ( function ( ) {

    // Check for the presence of a student name.
    check_quiz_student_name () ;

    // Detect change in quiz selector menu (on q.php). Send user to selected quiz.
    jQuery('#quiz_selector').on ( "change", function (event) {
        if ( jQuery('#quiz_selector').val() != '0' ) {
            // console.log ('#quiz_selector',jQuery('#quiz_selector').val());
            const url = new URL ( window.location ) ;
            url.searchParams.set( 'quiz', jQuery('#quiz_selector').val()) ;
            window.location = url ;
        }
    } ) ;

    // For viewing the quiz statistics.
    // Detect change in quiz selector menu (on s.php).
    jQuery('#quiz_selector_stats').on ( "change", function (event) {
        if ( jQuery('#quiz_selector_stats').val() != '0' ) {
            // fetch firestore answers
            db.collection("answers").where("quiz", "==", jQuery('#quiz_selector_stats').val()).orderBy("question")
            .onSnapshot(function(querySnapshot) {
                let answers = [];
                querySnapshot.forEach(function(doc) {
                    let question_answer = {
                        answer: doc.data().answer,
                        question: doc.data().question,
                        student: doc.data().student
                    } ;
                
                    answers.push(question_answer);
                    // console.log("doc.id:",doc.id)
                });
        
                let answer_statistics = load_answers ( answers ) ;
                render_stats ( answer_statistics ) ;
            });
        }
    });

    // Mouse-over state toggle.
    jQuery('div.answers div.answer').on("mouseenter mouseleave", function (event) {
        jQuery(this).toggleClass("hover");
    });

    // When an answer is clicked, check if it's correct.
    jQuery('div.answers div.answer').on('click', function (event) {
        // console.log('clicked answer');
        answered_question_count += 1 ;
        // let class = jQuery(this).attr("class");
        let classes = this.classList;
        // console.log('classes',class);
        // console.log('classes', classes.length);
        // console.log('classes', classes.values());

        let question_class = classes[0];
        let answer_class = classes[1];
        console.log ("question_class:",question_class) ;
        console.log ("answer_class:",answer_class) ;
        let is_correct_answer = false ;
        let iterator = classes.values();

        for ( let value of iterator) {
            if ( value == 'is_correct' ) {
                is_correct_answer = true ;
                break ;
            }
        }

        if (is_correct_answer) {
            jQuery(this).addClass('correct_answer');
            let div_classes = jQuery(this).attr('class') ;
            let icon_selector = 'div.'+div_classes.replace(/ /g,'.')+'+div.icon' ;
            // console.log('icon_selector:',icon_selector) ;
            jQuery(icon_selector).animate( {opacity: 1}, 500 );
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
            jQuery(icon_selector).animate( {opacity: 1}, 500 );
            jQuery(icon_selector).html('&#10008;');
            jQuery(icon_selector).addClass('incorrect');
            if ( play_sound ) {
                new Audio('mp4/sad-trombone.mp4').play();
            }
            // find the correct answer
            jQuery('div.' + question_class + '.is_correct').addClass('correct_answer_not_selected');
        }

        // Reveal explanation.
        jQuery('div.' + question_class + '.explanation').slideToggle();

        // Reveal answer scores for this question.
        // Get the question index number.
        let q_index = jQuery(this).parent().parent().index('div.quiz_body') ;
        // console.log('q_index:',q_index);
        jQuery('div.q' + q_index + ' div.answer_score').animate( {opacity: 1}, 500 );
        // console.log('this:',this);

        // https://api.jquery.com/index/
        // console.log('index:',jQuery(this).parent().parent().index('div.quiz_body')) ;

        // Add answers to Firestore.
        if ( ! debug ) {
            db.collection("answers").add({
                answer: answer_class.substring(answer_class.length - 1, answer_class.length), // last character
                question: question_class.substring(question_class.length - 1, question_class.length), // last character
                quiz: jQuery('#quiz_selector').val(),
                student: jQuery('#student_name').text(), // fixme
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
                .then(function (docRef) {
                    // console.log("Question written with ID: ", docRef.id);
                })
                .catch(function (error) {
                    console.error("Error adding question: ", error);
                });
        }
        else {
            console.warn ('Debug mode = true. Answer not recorded.') ;
        }

        // Update the answer tally.
        update_answer_tally ( ) ;

        // console.log('correct_answer_count:', correct_answer_count);
        // console.log('question class:', question_class);

        // Get rid of the hover class.
        // Remove event handler.
        jQuery('div.' + question_class).off('click');
        jQuery('div.' + question_class).off('mouseenter');
        jQuery('div.' + question_class).off('mouseleave');

        // Is this the last question?
        // If so, display a summary.
        // console.log ('answered_question_count:',answered_question_count) ;
        // console.log('total_question_count:',total_question_count) ;
        if ( answered_question_count == total_question_count ) {
            let message = 'You got ' + correct_answer_count + ' out of ' + total_question_count + ' questions correct.' ;
            // Less than or equal to 50%.
            if ( correct_answer_count <= ( total_question_count/2 ) ) {
                message += ' Please message Saul to talk.' ;
            }

            // Better than 50% but not perfect.
            if ( ( correct_answer_count > ( total_question_count/2 ) ) && ( correct_answer_count != total_question_count ) ) {
                message += ' Whoa! You must be, like, wicked smaht.' ;
            }

            // Perfect score.
            if ( correct_answer_count == total_question_count) {
                message += ' Sweet, a perfect score!' ;
            }

            jQuery('section#main').append ('<p class="summary">' + message + '</p>') ;
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

/* FireStore database. */
let firebaseConfig = {
    apiKey: "AIzaSyCeYBxu0SmvCBreK_h-IsVzB-hdEs1sDq4",
    authDomain: "quizzer-8ebdf.firebaseapp.com",
    databaseURL: "https://quizzer-8ebdf.firebaseio.com",
    projectId: "quizzer-8ebdf",
    storageBucket: "quizzer-8ebdf.appspot.com",
    messagingSenderId: "1012004780160",
    appId: "1:1012004780160:web:9a764fa4dbbeb359408e65"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

// Add a new document in collection "cities"
/*
db.collection("quizzes").doc("quiz2").set({
    question: "1",
    answers: {
    0: "0",
    1: "0",
    2: "0",
    3: "0"
    }

})
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    }, { merge: true });
*/

/* Load answers for a given quiz. */

function load_answers ( answers ) {
    console.log('loading answers...')

    // console.log(questions) ;

    let quiz_question_count = _get_quiz_question_count ( answers ) ;

    // console.log(quiz_question_count) ;

    // Loop through questions
    let stats = [] ;
    for ( let question_index = 0 ; question_index <= quiz_question_count ; question_index++ ) {

        let question_answers = [] ;
        for ( let object_array_index = 0 ; object_array_index < answers.length ; object_array_index++ ) {
            
            // Does the outer index match the question number?
            if ( answers[object_array_index].question == question_index ) {
                question_answers.push (answers[object_array_index].answer) ;
            }

        }
        // console.log (question_index,'|',question_answers.join(", ")) ;
        stats.push ( { question_id: question_index, question_answers: question_answers} ) ;

    }
    return stats ;

    /*
    db.collection("questions").where("quiz", "==", quiz)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    */

}

function render_stats ( stats ) {
    console.log("rendering stats...") ;

    // console.log(stats) ;

    let stats_html = jQuery('div#stats') ;
    stats_html.html('') ; // wipe it out.

    for ( let question_index = 0 ; question_index < stats.length ; question_index++ ) {
        stats_html.append('<h2>question ' + (question_index+1) + '</h2>');
        // jQuery('<h2>question ' + (question_index+1) + '</h2>').appendTo('div#stats');
        
        // we'll assume we only have four possible answers for any given question, even true/false questions
        for ( let answer_index = 0 ; answer_index < 4 ; answer_index++ ) {

            let answer_counter = 0 ;
            // loop through the items in the question_answers array
            for ( let question_answers_index = 0 ; question_answers_index < stats[question_index].question_answers.length; question_answers_index++ ) {
                // console.log ( question_index,"answer:",stats[question_index].question_answers[question_answers_index] );

                if ( stats[question_index].question_answers[question_answers_index] == answer_index ) {
                    answer_counter++ ;
                }

            }
            stats_html.append("<p><strong>"+(answer_index+1)+":</strong> "+answer_counter+"</p>") ;

        }

    }

}

// Check for the presence of a student's name. If no name, prompt for one.
function check_quiz_student_name () {
    if ( document.getElementById('student_name_container' ) ) {
        console.log ( 'checking for email address...' ) ;

        if ( localStorage.student_name ) {
            set_student_name () ;
        }
        else {
            save_student_name () ;
        }
    }

}

// Save the student's name in localStorage.
function save_student_name ( ) {

    // Is there a name saved in localStorage? If not, prompt the user to enter something.
    // If so, print the name and allow the user to edit it.
    let student_name ;
    if ( ! localStorage.student_name ) {
        student_name = prompt ( "Please enter your MassArt email address: " ) ;
    }
    else {
        student_name = prompt ( "Please update your MassArt email address: ", localStorage.student_name ) ;
    }

    // If the user clicks Cancel, don't save any changes.
    if ( student_name != '' && student_name != null ) {
        localStorage.student_name = student_name ;
        set_student_name () ;
    }
    // anonymous person. give them a random ID.
    else {
        if ( ! localStorage.student_name ) {
            localStorage.student_name = 'anonymous-' + Math.floor(Math.random() * 10000000000) + 1;
            set_student_name () ;
        }
        // otherwise there's already a name, and they clicked cancel.
    }

}

// Set the student name on the webpage.
function set_student_name () {

    document.getElementById('student_name').innerText = localStorage.student_name ;

}

// Update the answer tally.
function update_answer_tally ( ) {
    console.log('updating tally...');
    db.collection("answers").where("quiz", "==", jQuery('#quiz_selector').val()).orderBy("question")
    .onSnapshot(function(querySnapshot) {
        let answers = [];
        querySnapshot.forEach(function(doc) {
            let question_answer = {
                answer: doc.data().answer,
                question: doc.data().question,
                student: doc.data().student
            } ;
        
            answers.push(question_answer);
            // console.log("doc.id:",doc.id)
        });

        let answer_statistics = load_answers ( answers ) ;
        render_quiz_stats ( answer_statistics ) ;

    }) ;
}

function render_quiz_stats ( stats ) {

    for ( let question_index = 0 ; question_index < stats.length ; question_index++ ) {
        // stats_html.append('<h2>question ' + (question_index+1) + '</h2>');
        // jQuery('<h2>question ' + (question_index+1) + '</h2>').appendTo('div#stats');
        
        // we'll assume we only have four possible answers for any given question, even true/false questions
        for ( let answer_index = 0 ; answer_index < 4 ; answer_index++ ) {

            let answer_counter = 0 ;
            // loop through the items in the question_answers array
            for ( let question_answers_index = 0 ; question_answers_index < stats[question_index].question_answers.length; question_answers_index++ ) {
                // console.log ( question_index,"answer:",stats[question_index].question_answers[question_answers_index] );

                if ( stats[question_index].question_answers[question_answers_index] == answer_index ) {
                    answer_counter++ ;
                }

            }
            jQuery('div.question_score' + question_index + '.answer_score' + answer_index ).html(answer_counter) ;
            // stats_html.append("<p><strong>"+(answer_index+1)+":</strong> "+answer_counter+"</p>") ;

        }

    }


}

/* Tally the number of questions for this quiz. */
/* So I can have a variable number of quiz questions. */
function _get_quiz_question_count ( questions ) {
    let max_question_count = 0 ;
    for ( let question_index = 0 ; question_index < questions.length ; question_index++ ) {

        if ( questions[question_index].question > max_question_count ) {
            max_question_count = questions[question_index].question ;
        }

    }

    return max_question_count ;

}