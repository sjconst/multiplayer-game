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
// Score evaluation function
function scoreEval() {
    if (player1Roll > player2Roll) {
        // player1 score increases
        player1Score++;                
    } else if (player1Roll === player2Roll){
        //"It's a tie" popup
        UI.popup(); 
    } else {
        // player2 score increases
        player2Score++;                       
    };    
    return player1Score, player2Score;
}; 
//UI object
var UI = {
    diceDisplay: function(){
        DOM.$player1Dice.attr("src", `assets/images/dice-${player1Roll}.png`);           
        DOM.$player2Dice.attr("src", `assets/images/dice-${player2Roll}.png`);   
    },
    scoreDisplay: function(snapshot){
        DOM.$player2Score.text(snapshot.val().player2Score);   
        DOM.$player1Score.text(snapshot.val().player1Score);  
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
    UI.resetDiceClasses();
    player1Status = "active";
    player2Status = "inactive";
    player1Roll = 1;
    player2Roll = 1;
    databaseSet();
};
//Firebase and other event listeners
database.ref().on("value", function(snapshot){  
    //update variables based on database
    player1Roll = parseInt(snapshot.val().player1Roll);
    player2Roll = parseInt(snapshot.val().player2Roll);   
    //display corresponding dice and score
    UI.diceDisplay(); 
    UI.scoreDisplay(snapshot);    
}, function(errorObject) {
        console.log("The read failed: " + errorObject.code);        
});
// Whenever a user clicks the player1Roll button
$("#player1Btn").on("click", function(){
    //if computer oponent selected
    if(DOM.$option1.hasClass("active")){
        //player1 gets random number
        player1Roll = randomRoll();   
        //player2 gets random number
        player2Roll = randomRoll();  
        //evaluate rolls
        scoreEval();
        //send to database
        databaseSet();
    } else {
        //check the database to see if player 1 active
        database.ref().child("player1Status").once("value", function(snapshot){            
            if(snapshot.val() === "active"){                
                //if player 1 is the active player, assign random number to player1roll    
                player1Roll = randomRoll();   
                //switch active players
                player1Status = "inactive";
                player2Status = "active";  
                //send updated roll to firebase
                databaseSet();            
            }
        });                     
    }
});
$("#player2Btn").on("click", function(){
    //check the database to see if player 2 active 
    database.ref().child("player2Status").once("value", function(snapshot){            
        if(snapshot.val() === "active"){
        //if player 2 is the active player, give player2roll a random number
        player2Roll = randomRoll();  
        //switch active players
        player2Status = "inactive";
        player1Status = "active";   
        //evaluate the rolls    
        scoreEval();
        //send updated data to firebase
        databaseSet();         
        }
    }); 
});
//when click on computer opponent radio button, becomes active
$("#option1").on("click", function(){    
    DOM.$option1.addClass("active");    
    DOM.$option2.removeClass("active");
    init();
}); 
//when click on human opponent radio button, becomes active
$("#option2").on("click", function(){   
    DOM.$option2.addClass("active");  
    DOM.$option1.removeClass("active"); 
});
//reset score when pressed
$("#reset").on("click", function(){
    UI.scoresToZero();
    databaseSet();
})
//initialize game
init();
});
