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
//DOM object
const DOM = {    
    $player1Score: $("#player1Score"),
    $player2Score: $("#player2Score"),
    $player1Dice: $("img[id*='player1Dice']"),
    $player2Dice: $("img[id*='player2Dice']"),    
    $option1: $("input[id*='option1']"),
    $option2: $("input[id*='option2']"),
    $option1Label: $("label[id*='labelOption1']"),
    $option2Label: $("label[id*='labelOption2']")
};
//UI object
const UI = {
    diceDisplay: function(){
        DOM.$player1Dice.attr("src", "assets/images/dice-" + player1Roll + ".png");           
        DOM.$player2Dice.attr("src", "assets/images/dice-" + player2Roll + ".png");    
    },
    option1Checked: document.getElementById("option1").hasAttribute("checked"),
    option2Checked: document.getElementById("option2").hasAttribute("checked")
};
//initiate function
function init () {
    if(UI.option1Checked){
        computerGame = true;
    };
    player1Roll = 1;
    player2Roll = 2;
    player1Score = 0;
    player2Score = 0;
    databaseSet();      
    DOM.$player2Score.text(player2Score);   
    DOM.$player1Score.text(player1Score); 
};
init();
//Firebase listener
database.ref().on("value", function(snapshot){
    // If playing another player live
    if(UI.option2Checked){
        // Set the variables for player2Roll equal to the stored values in firebase.
        player1Roll = parseInt(snapshot.val().player1Roll);
        player2Roll = parseInt(snapshot.val().player2Roll);              
        // //Change the UI 
        UI.diceDisplay();  
        } else if(document.getElementById("option1").hasAttribute("checked")) {                          
        // diplay resulting dice;
        UI.diceDisplay();  
        //display score
        DOM.$player2Score.text(snapshot.val().player2Score);   
        DOM.$player1Score.text(snapshot.val().player1Score);  
        } else {
        //wait for player2
        console.log("waiting for player 2")
        }
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
        if(UI.option1Checked){
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
    if(UI.option2Checked){       
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
$("#option2").on("click", function(){
    DOM.$option2.attr("checked");
    DOM.$option2Label.addClass("active");
    DOM.$option1.removeAttr("checked");
    DOM.$option1Label.removeClass("active");
    init();
    //display popup for 2 seconds that says how to play with two players
});
$("#option1").on("click", function(){
    DOM.$option1.attr("checked");
    DOM.$option1Label.addClass("active");
    DOM.$option2.removeAttr("checked");
    DOM.$option2Label.removeClass("active");
    init();
    //display popup for 2 seconds that says how to play with the computer
}) 
});
