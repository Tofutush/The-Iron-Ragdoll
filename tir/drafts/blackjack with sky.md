# immediate to-do

- subtract bet right after betting and adjust win rates accordingly
- floor it on `GameManager.changeMoney`
- in case you don't end up with the stuff on `one-signal`, move the `toString` functions back

# plans

- start screen
	- save / load
	- settings
		- sound
		- language
		- stand or hit at soft 17
- game start
	- intro cutscene
		- bag lifted off face, white screen fades into sky
		- sky explaining you have been sentenced to death but play blackjack to live
		- choose between starting or tutorial?
			- how to make tutorial?
- main game
	- bets in
	- deal
		- 2 cards to player
		- 2 cards to dealer but one face down
	- check for natural blackjack
	- check for split
		- if split, double bets. exchange chips if needed
	- player draw until stand or bust
		- if split, do the other too
	- dealer draw until past 17
	- check for win
		- if split, check each
	- play again
- goes under $21
	- lose cutscene
- goes above $1000
	- lose anyways
