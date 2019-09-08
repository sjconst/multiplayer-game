$(document).ready(function() {
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
//DOM object
var DOM = {    
    $player1Score: $("#player1Score"),
    $player2Score: $("#player2Score"),
    $player1Dice: $("img[id*='player1Dice']"),
    $player2Dice: $("img[id*='player2Dice']"),    
    $option1: $("input[id*='option1']"),
    $option2: $("input[id*='option2']"),
    $option1Label: $("label[id*='labelOption1']"),
    $option2Label: $("label[id*='labelOption2']")
};
//Global variables, setup objects
var database = firebase.database();   
var randomRoll = () => Math.floor(Math.random() * 6) + 1;
var player1Roll, player2Roll, player1Score, player2Score, computerGame;
//Database set function
function databaseSet(){
    database.ref().set({
        player1Roll: player1Roll,
        player2Roll: player2Roll,
        player1Score: player1Score,
        player2Score: player2Score  
    });    
};

//UI object
var UI = {
    diceDisplay: function(){
        DOM.$player1Dice.attr("src", "assets/images/dice-" + player1Roll + ".png");           
        DOM.$player2Dice.attr("src", "assets/images/dice-" + player2Roll + ".png");    
    },
};
//initiate function
function init () {
    if(DOM.$option1Label.hasClass("active")){
        computerGame = true;
    };
    player1Roll = 1;
    player2Roll = 2;
    player1Score = 0;
    player2Score = 0;       
    DOM.$player2Score.text(player2Score);   
    DOM.$player1Score.text(player1Score); 
};
init();
//Firebase listener
database.ref().on("value", function(snapshot){  
    player1Roll = parseInt(snapshot.val().player1Roll);
    player2Roll = parseInt(snapshot.val().player2Roll);   
    UI.diceDisplay(); 
    DOM.$player2Score.text(snapshot.val().player2Score);   
    DOM.$player1Score.text(snapshot.val().player1Score);    
}, function(errorObject) {
        console.log("The read failed: " + errorObject.code);        
});
// Whenever a user clicks the player1Roll button
$("#player1Btn").on("click", function(){
    if (computerGame) {
        // get random number
        player1Roll = randomRoll();   
        console.log(player1Roll);
        // if playing computer, give player2 score randomly
        if(DOM.$option1Label.hasClass("active")){
            // Play against the computer.
            player2Roll = randomRoll();  
            console.log(player2Roll); 
            // If then statements to compare against player 2
            if (player1Roll > player2Roll) {
                // player1 score increases
                player1Score++;                
            } else if (player1Roll === player2Roll){
                $("#popup").css("visibility", "visible");
                setTimeout( () => {
                    $("#popup").css("visibility", "hidden");
                } ,1500);   
            } else {
                // player2 score increases
                player2Score++;                       
            };           
        };   
        databaseSet();
    }
});
$("#player2Btn").on("click", function(){
    // give player2 a random number
    player2Roll = randomRoll();
    console.log(player1Roll);    
    if(DOM.$option2Label.hasClass("active")){       
        // If then statements to compare against player 2
        if (player1Roll > player2Roll) {
            // player1 score increases
            player1Score++;     
            console.log(player1Roll);            
        } else if (player1Roll === player2Roll){
            $("#popup").css("visibility", "visible");
            setTimeout( () => {
                $("#popup").css("visibility", "hidden");
            } ,1500);   
        } else {
            // player2 score increases
            player2Score++;    
            console.log(player1Roll);                    
        };        
    }     
    databaseSet();     
});
$("#option1").on("click", function(){    
    DOM.$option1Label.addClass("active");    
    DOM.$option2Label.removeClass("active");
    init();
    //display popup for 2 seconds that says how to play with the computer
}) 
$("#option2").on("click", function(){   
    DOM.$option2Label.addClass("active");  
    DOM.$option1Label.removeClass("active");
    init();
    //display popup for 2 seconds that says how to play with two players
});
$("#reset").on("click", function(){
    databaseSet();
})
});
