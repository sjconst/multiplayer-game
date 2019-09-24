# Multiplayer game
A simple dice game let's you either play the computer or another person. Give the second player the URL to get started and see who can get the highest score in 10 minutes! 

![multiplayerScreenshot](https://user-images.githubusercontent.com/42453320/64482611-f6b13e80-d1a9-11e9-83b0-afaa99cd5465.jpg)

## Getting Started

To view this live on your browser, go to https://sjconst.github.io/multiplayer-game/

## Authors

* **Stephanie Lake** - (https://github.com/sjconst)

## Key Features

* Firebase. Scores and dice rolls are saved in firebase and then pulled back to the current game. 
* Easily toggle between a computer or human opponent.
* Mobile-responsive design.
* Organized, DRY code.

## How to Use

* Play another human opponent by sharing the URL and selecting "human opponent."
* Switch back to playing the computer by selecting "computer opponent."

## Technical Approach

The main challenge of this web application was sequencing the calls to firebase correctly to enable the dice being rolled in two separate windows, but only when the respective player's turn is up. To achieve this, "active" and "inactive" classes are toggled on several elements and the status is sent to firebase in additional to each players' score and randomized dice roll. 

## Acknowledgments

This software uses the following open source packages:

* Firebase
* jQuery
* Bootstrap