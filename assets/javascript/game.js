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
var player1Roll = 1;
var player2Roll = 2;
var player1Score = 0;
var player2Score = 0;

database.ref().set({
    player1Roll: player1Roll,
    player2Roll: player2Roll,
    player1Score: player1Score,
    player2Score: player2Score  
});  

//Firebase listener
database.ref().on("value", function(snapshot){
    // If Firebase has a player2Roll stored
    if($("#option2").hasClass("active")/* snapshot.child("player2Roll").exists() && snapshot.child("player1Roll").exists() */){
        // Set the variables for player2Roll equal to the stored values in firebase.
        player1Roll = parseInt(snapshot.val().player1Roll);
        player2Roll = parseInt(snapshot.val().player2Roll);              
        // //Change the UI 
        $("img[id*='player1Dice']").attr("src", "assets/images/dice-" + player1Roll + ".png");           
        $("img[id*='player2Dice']").attr("src", "assets/images/dice-" + player2Roll + ".png");
        //human opponent button is selected
        // $("#option2").addClass("active").attr("checked");
        // $("#option1").removeClass("active").removeAttr("checked");
    } /* else if($("#option2").hasClass("active")){
        //Update UI
        $("#player1Score").text(player1Score);    
        $("img[id*='player1Dice']").attr("src", "assets/images/dice-" + player1Roll + ".png"); 
    } */ else {                 
        // //diplay resulting dice;
        $("img[id*='player1Dice']").attr("src", "assets/images/dice-" + player1Roll + ".png");   
        $("img[id*='player2Dice']").attr("src", "assets/images/dice-" + player2Roll + ".png");  
        //display score
        $("#player2Score").text(snapshot.val().player2Score);   
        $("#player1Score").text(snapshot.val().player1Score);        
        //Computer Opponent button is active
        // $("#option1").addClass("active").attr("checked");
        // $("#option2").removeClass("active").removeAttr("checked");
        // }
    }}, function(errorObject) {
        console.log("The read failed: " + errorObject.code);        
    });

// Whenever a user clicks the player1Roll button
$("#player1Btn").on("click", function(){
        // get random number
        player1Roll = randomRoll();   
        console.log(player1Roll);
        // if playing computer, give player2 score randomly
        if(document.getElementById("option1").hasAttribute("checked")){
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
        }    
        database.ref().set({
            player1Roll: player1Roll,
            player2Roll: player2Roll,
            player1Score: player1Score,
            player2Score: player2Score  
        });        
    })

$("#player2Btn").on("click", function(){
    // give player2 a random number
    player2Roll = randomRoll();
    console.log(player1Roll);    
    if(document.getElementById("option2").hasAttribute("checked")){       
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
    database.ref().set({
        player1Roll: player1Roll,
        player2Roll: player2Roll,
        player1Score: player1Score,
        player2Score: player2Score  
    });        
})

$("#option2").on("click", function(){
    $("#option2").addClass("active").attr("checked");
    $("#option1").removeClass("active").removeAttr("checked");
    //display popup for 2 seconds that says how to play with two players
})

$("#option1").on("click", function(){
    $("#option1").addClass("active").attr("checked");
    $("#option2").removeClass("active").removeAttr("checked");
    //display popup for 2 seconds that says how to play with the computer
})
    

});
