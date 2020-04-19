//Create a Class for Quiz
function Quiz(questions) {
    this.score = 0;
    this.questions = questions;
    this.questionIndex = 0;
}

//Add the index of the question in the class
Quiz.prototype.getQuestionIndex = function() {
    return this.questions[this.questionIndex];
}
 //ADD the pick choice of the user in the class
Quiz.prototype.pick = function(answer) {
    if(this.getQuestionIndex().isCorrectAnswer(answer)) {
        this.score++;
    }
 
    this.questionIndex++;
}

 //Index question is same as lenght of questions
 //Add the class ended if the questions is at the last question 
Quiz.prototype.isEnded = function() {
    return this.questionIndex === this.questions.length;
}
 
 
function Question(text, choices, answer) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
}
 
Question.prototype.isCorrectAnswer = function(choice) {
    return this.answer === choice;
}
 
 
function populate(quiz) {
    if(quiz.isEnded()) {
        showScores(quiz);
    }
    else {
        // show question
        var element = document.getElementById("question");
        element.innerHTML = quiz.getQuestionIndex().text;
 
        // show options
        var choices = quiz.getQuestionIndex().choices;
        for(var i = 0; i < choices.length; i++) {
            var element = document.getElementById("choice" + i);
            element.innerHTML = choices[i];
            pick("btn" + i, choices[i],quiz);
        }
 
        showProgress(quiz);
    }
};

//user click a button, goes to the next quiz
function pick(id, pick, quiz) {
    var button = document.getElementById(id);
    button.onclick = function() {
        quiz.pick(pick);
        populate(quiz);
    }
};
 
 //Function that shows the current progress/ question number
function showProgress(quiz) {
    var currentQuestionNumber = quiz.questionIndex + 1;
    var element = document.getElementById("progress");
    element.innerHTML = "Question " + currentQuestionNumber + " of " + quiz.questions.length;
};

//Show Scores on the final result
function showScores(quiz) {
    $('#dwn-btn').show();    
    var gameOverHTML = "<h1>Result</h1>";
    gameOverHTML += "<h2 id='score'> Your scores: " + quiz.score + "</h2>";
    var element = document.getElementById("quiz");
    element.innerHTML = gameOverHTML;
};

//To randomize the choices
function getRndChoices(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

window.onload = function(){
    //Make sure download btn is hidden first
    //console.log(getCookie("username"));
    var username = getCookie("username");

    if(username === null){
        username = 'User';
    }
    $('#user').html("Hello " + username);
    //console.log(x);
    $('#dwn-btn').hide();
    $.ajax({
        //Get the path for all the Json file that I will be using 
        url: "https://opentdb.com/api.php?amount=15&category=19&type=multiple",
        dataType: 'JSON', // type of file (text, json, xml, etc)
        success: function(data){
            var questions = [];
        //  callback for successful completion                
                $.each(data.results, function( index, value ) {
                    var multiChoices = [];
                    $.each(value.incorrect_answers, function(key, choices){
                        multiChoices.push(choices);
                    });
                    multiChoices.push(value.correct_answer);

                    questions.push(new Question(value.question, multiChoices, value.correct_answer));
                    //console.log(value.incorrect_answers)
                    
                });
                var quiz = new Quiz(questions);
    
                populate(quiz);
                
                document.getElementById("dwn-btn").addEventListener("click", function(){
                    //jsPDF convertion API
                    var doc = new jsPDF();
                    var res = quiz.score;   
                    var summary;               
                    var totalquiz = quiz.questions.length;
                    //Create the PDF file for the result
                    doc.setFontStyle("bold");
                    doc.text("QUIZ RESULTS", 105, 40, null, null, "center");
                    doc.setFontStyle("bold");
                    doc.text("Name:", 20, 60);
                    doc.setFontStyle("normal");
                    doc.text(username, 50, 60);
                    doc.setFontStyle("bold");
                    doc.text("Test Type:", 20, 70);
                    doc.setFontStyle("normal");
                    doc.text("MATH", 50, 70);
                    doc.setFontStyle("bold");
                    doc.text("Score:", 20, 80);
                    doc.setFontStyle("normal");              
                    doc.text(res.toString()+" out of "+totalquiz.toString(), 50, 80);
                    doc.setFontStyle("bold");
                    doc.text("Results: ", 20, 90);
                    doc.setFontStyle("normal");
                    //If score gets 60% below
                    if(res/totalquiz < 0.60){
                        doc.setTextColor(255, 0, 0);
                        doc.text("FAILED!", 50, 90); 
                    }else{
                        doc.setTextColor(0, 255, 0);
                        doc.text("PASSED!", 50, 90); 
                    }
                    //Save the PDF file Results    
                    doc.save('TestResults.pdf')

                });
                

        }
    }); 
    //Logging out means deleting cookies and going to the login page
    $('#logout').click(function(){
            location.href = "login.html";
            document.cookie = "username=;";
    });

}