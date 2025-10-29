# to-do

- draw card backs
	- jack: sparky
	- queen: qibli
	- king: firecrackers
	- (implying joker is sky)

# plans

- [x] start screen
	- [x] save / load
	- [x] settings
		- [x] sound
		- [x] language
		- [x] stand or hit at soft 17
		- [x] how many decks (1 - 8)
		- [x] strict splitting rules (specifics down in code)
	- [x] start
	- [x] continue
- [x] game start
	- [x] intro cutscene
		- [x] bag lifted off face, white screen fades into sky
		- [x] sky explaining you have been sentenced to death but play blackjack to live
- [x] main game
	- [x] bets in
	- [x] deal
		- [x] 2 cards to player
		- [x] 2 cards to dealer but one face down
	- [x] check for natural blackjack
	- [x] check for split
		- [x] if split, double bets, add new hand
		- [x] deal new cards to split hands
	- [x] check dealer upcard
		- [x] prompt insurance if dealer upcard is ace
			- [x] show bet slider again, maxed at bet / 2 floored
	- [x] player draw until stand or bust
		- [x] after drawing once, disable insurance, double down, and surrender
		- [x] if split, keep doing until all 4 hands are done
	- [x] reveal dealer down card
	- [x] dealer draw until past 17
	- [x] check for win
		- [x] determine insurance bet wins or not
		- [x] if split, check all
	- [x] play again
- [x] goes under $21
	- [x] lose cutscene
- [x] goes above $1000
	- [x] lose anyways

## dialog

- win
	1. What do you plan to do if you're free? Defect? They won't have let you end up here if you're still worth anything to them. You truly don't belong anywhere.
	2. I used to sit on that side, where you were. My chips were heavier than yours. But I won, and my chips are still here with me.
- lose
	1. There's that saying. The house always wins. The Ministry always wins.
	2. You're lucky we're even giving you a chance at all.
	3. I don't even know who you are or what you did. And I'm not supposed to. I'm just dealing cards here.
- tie
	1. Good game, but you'll need more luck than that.
- natural bj eat half dollar
	- didn't see surrender
		- The payout is 1.5 times your bet, so you should've received {amount}. I ate your half dollar. Think about this next time you want to bet an odd number.
	- saw surrender
		- I ate your half dollar again. This is pure floor() now. You haven't learned a thing about betting odd, have you?
- surrender eat half dollar
	- didn't see natural bj
		- I was supposed to return you half your bet, so {amount}. But in GDScript, the part after the decimal is discarded in integer divisions, so the half dollar is gone. Too bad. Maybe not bet an odd amount next time.
	- saw natural bj
		- Okay, the half dollar is gone don't blame the dev this time; in GDScript, the part after the decimal is discarded in integer divisions. (The dev still called floor() just in case) You haven't learned a thing about betting odd, have you?
- get to $900
	- You're almost there! I didn't expect you to make it this far.
