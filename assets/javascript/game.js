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
var player1Roll;
var player2Roll;
var player1Score = 0;
var player2Score = 0;

//Firebase listener
database.ref().on("value", function(snapshot){
    // If Firebase has a player2Roll stored
    if(snapshot.child("player2Roll").exists()){
        // Set the variables for player2Roll equal to the stored values in firebase.
        console.log("player 2 is active");
        player2Roll = parseInt(snapshot.val().player2Roll);              
        // //Change the UI            
        $("img[id*='player2Dice']").attr("src", "assets/images/dice-" + player2Roll + ".png");
        //human opponent button is selected
        $("#option2").addClass("active").attr("checked");
        $("#option1").removeClass("active").removeAttr("checked");
    } else {
        // Else Firebase doesn't have a player2, play against the computer.
        player2Roll = randomRoll();
        console.log(player2Roll);        
        $("img[id*='player2Dice']").attr("src", "assets/images/dice-" + player2Roll + ".png");
        //Computer Opponent button is active
        $("#option1").addClass("active").attr("checked");
        $("#option2").removeClass("active").removeAttr("checked");
        }
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);        
    });

// Whenever a user clicks the player1Roll button
$("#player1Btn").on("click", function(){
        // get random number
        player1Roll = randomRoll();
        // //diplay resulting dice;
         $("img[id*='player1Dice']").attr("src", "assets/images/dice-" + player1Roll + ".png");
        //  $("img[id*='player2Dice']").attr("src", "assets/images/dice-" + player2Roll + ".png");
        // save the new roll in Firebase
        database.ref().set({
            player1Roll: player1Roll,         
        });
        // If Then statements to compare against player 2
        if (player1Roll > player2Roll) {
            // player1 score increases
            player1Score++;         
            console.log("player 1 won with " + player1Roll + " points");  
            console.log(player2Roll);              
        } else if (player1Roll === player2Roll){
            console.log("its a tie")
            console.log(player1Roll);
            console.log(player2Roll);
        } else {
            // player2 score increases
            player2Score++;
            //update UI
            console.log("player 2 won with " + player2Roll + " points");  
            console.log(player1Roll);     
        }
    })

$("#player2Btn").on("click", function(){
    // give player2 a random number
    player2Roll = randomRoll();
    //pass that score to firebase
    database.ref().set({
        player2Roll: player2Roll
    })
    // Change the HTML/dice image to reflect the stored value
})

$("#option2").on("click", function(){
    //display popup for 2 seconds that says how to play with two players
})

$("#option1").on("click", function(){
    //display popup for 2 seconds that says how to play with the computer
})
    

});
