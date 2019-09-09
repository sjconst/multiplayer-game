$(document).ready(function() {
//Setup and initialize firebase
var firebaseConfig = {
    apiKey: "AIzaSyBSJk7QXljKOrv2Kw63Ok-SFsGkItk8TIw",
    authDomain: "multiplayer-game-8672a.firebaseapp.com",
    databaseURL: "https://multiplayer-game-8672a.firebaseio.com",
    projectId: "multiplayer-game-8672a",
    storageBucket: "",
    messagingSenderId: "433166556859",
    appId: "1:433166556859:web:a6e3a742dbe483f9"
    };
firebase.initializeApp(firebaseConfig);
//Global variables
var database = firebase.database();   
var randomRoll = () => Math.floor(Math.random() * 6) + 1;
var player1Roll, player2Roll, player1Score, player2Score, player1Status, player2Status;
//DOM object
var DOM = {    
    $player1Score: $("#player1Score"),
    $player2Score: $("#player2Score"),
    $player1Dice: $("img[id*='player1Dice']"),
    $player2Dice: $("img[id*='player2Dice']"),     
    $option1: $("label[id*='labelOption1']"),
    $option2: $("label[id*='labelOption2']")
};
//Database set function
function databaseSet(){
    database.ref().set({
        player1Roll: player1Roll,
        player2Roll: player2Roll,
        player1Score: player1Score,
        player2Score: player2Score ,
        player1Status: player1Status,
        player2Status: player2Status, 
    });    
};
//Check Status function
function checkStatus(player){
    if(player.hasClass("active")){
        status = "active";
        return status;
    } else {
        status = "inactive";
        return status;
    }
};
// Score evaluation function
function scoreEval() {
    if (player1Roll > player2Roll) {
        // player1 score increases
        player1Score++;                
    } else if (player1Roll === player2Roll){
        UI.popup(); 
    } else {
        // player2 score increases
        player2Score++;                       
    }; 
    console.log("score eval working and the scores are" + player1Score + player2Score)
    return player1Score, player2Score;
}; 
//UI object
var UI = {
    diceDisplay: function(){
        DOM.$player1Dice.attr("src", "assets/images/dice-" + player1Roll + ".png");           
        DOM.$player2Dice.attr("src", "assets/images/dice-" + player2Roll + ".png");    
        console.log("diceDisplay working");
    },
    scoreDisplay: function(snapshot){
        DOM.$player2Score.text(snapshot.val().player2Score);   
        DOM.$player1Score.text(snapshot.val().player1Score);  
        console.log("scoreDisplay working");
    },
    popup: function(){
        $("#popup").css("visibility", "visible");
        setTimeout( () => {
            $("#popup").css("visibility", "hidden");
        },1500);   
    },
    scoresToZero: function(){
        player1Score = 0;
        player2Score = 0;       
        DOM.$player2Score.text(player2Score);   
        DOM.$player1Score.text(player1Score); 
    },
    resetLabelClasses: function(){
        DOM.$option1.removeClass("active");
        DOM.$option2.removeClass("active");
        DOM.$option1.addClass("active");
    },
    resetDiceClasses: function(){
        DOM.$player1Dice.removeClass("active");
        DOM.$player2Dice.removeClass("active");
        DOM.$player1Dice.addClass("active");
    }
};
//initiate function
function init () {
    UI.resetLabelClasses();
    UI.scoresToZero();
    activePlayer = 0;
    UI.resetDiceClasses();
    player1Status = "active";
    player2Status = "inactive";
    player1Roll = 1;
    player2Roll = 1;
    databaseSet();
};
init();
//
//Firebase and other event listeners
database.ref().on("value", function(snapshot){  
        player1Roll = parseInt(snapshot.val().player1Roll);
        player2Roll = parseInt(snapshot.val().player2Roll);   
        UI.diceDisplay(); 
        UI.scoreDisplay(snapshot);
        console.log("database got a value");  
}, function(errorObject) {
        console.log("The read failed: " + errorObject.code);        
});
// Whenever a user clicks the player1Roll button
$("#player1Btn").on("click", function(){
    if(DOM.$option1.hasClass("active")){
        // get random number
        player1Roll = randomRoll();   
        // Play against the computer.
        player2Roll = randomRoll();  
        scoreEval();
        databaseSet();
    } else {
        database.ref().child("player1Status").once("value", function(snapshot){            
            if(snapshot.val() === "active"){
                console.log("this is now a two player game");
                //if player 1 is the active player, assign random number to player1roll    
                player1Roll = randomRoll();   
                player1Status = "inactive";
                player2Status = "active";  
                //make player 2 active
                databaseSet();            
            }
        });                     
    }
});
$("#player2Btn").on("click", function(){
    //if not a computer game and player 2 active  
    database.ref().child("player2Status").once("value", function(snapshot){            
        if(snapshot.val() === "active"){
        // give player2 a random number
        player2Roll = randomRoll();  
        player2Status = "inactive";
        player1Status = "active";        
        scoreEval();
        databaseSet();         
        }
    });
 
});
$("#option1").on("click", function(){    
    DOM.$option1.addClass("active");    
    DOM.$option2.removeClass("active");
    init();
}); 
$("#option2").on("click", function(){   
    DOM.$option2.addClass("active");  
    DOM.$option1.removeClass("active"); 
});
$("#reset").on("click", function(){
    UI.scoresToZero();
    databaseSet();
})
});
