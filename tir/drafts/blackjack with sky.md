# to-do

- draw card backs
	- jack: sparky
	- queen: qibli
	- king: firecrackers
	- (implying joker is sky)

# plans

- [ ] start screen
	- [ ] save / load
	- [x] settings
		- [x] sound
		- [x] language
		- [x] stand or hit at soft 17
		- [x] how many decks (1 - 8)
		- [x] strict splitting rules (specifics down in code)
	- [x] start
	- [x] continue
- [ ] game start
	- [x] intro cutscene
		- [x] bag lifted off face, white screen fades into sky
		- [x] sky explaining you have been sentenced to death but play blackjack to live
		- [ ] skippable tutorial
			- [ ] Blackjack is a game of comparing who has a higher hand. You want to get as close to 21 as possible without going over.
			- [ ] Numbered cards count as their number. Face cards (J, Q, K) count as 10. Aces count as either 1 or 11, depending on which gives you the highest number that's not over 21.
			- [ ] Place some bets! In the tutorial you have infinite money. (I also set a minimum bet of $10 that won't be in the actual game.)
			- [ ] At the start, I will deal us both 2 cards. One of my cards will be facing down.
			- [ ] You can choose to "hit," which is to take a new card, or "stand," which ends your round.
			- [ ] Now try hitting.
			- [ ] Great! Now your cards are totalled at 20. This is a good time to stand, because if you hit, there's a big chance you will bust — go over 21.
			- [ ] Now that you're standing, I will start drawing. I have to draw until my total gets over 17, after which I have to stand.
			- [ ] (If I reach a "soft 17" — my cards count as 17 only if the ace is counted as 11, whether I will hit or stand is configurable in the settings. It defaults to hit.)
			- [ ] If I bust, you win, provided you didn't bust.
			- [ ] I got 18. You win! You will be paid twice the amount you bet. Let's play another round. Bets in.
			- [ ] Natural blackjack! You got 21 in your first two cards alone.
			- [ ] The game ends immediately, and you will be paid 1.5 times the amount you bet. Next round, bets in.
			- [ ] You got an 11. This is a good time to double down!
			- [ ] Doubling down means doubling your bet, taking one more card, and then standing. You can only double down when you have 2 cards in your hand.
			- [ ] See, 21! With the highest number in the game, you can only win or tie. My turn.
			- [ ] I got 18. You win! Doubling down is risky but also rewarding. Another round.
			- [ ] I have an ace! When this happens, you can buy insurance.
			- [ ] This is because I have a good chance of having natural blackjack — that is, the card that's face-down has a good chance of being a card of value 10. If that's the case, you can only tie or lose.
			- [ ] Buying insurance is betting on whether I have blackjack. You can bet for up to half your original bet. If I do have blackjack, you will be paid 3 times your insurance bet. It is carried out independently of the outcome of the main game.
			- [ ] Now that you've placed your insurance bet, it's time to play as usual. I'll leave this part up to you.
			- [ ] My turn. Looks like I *do* have blackjack! That means you lose. But your insurance bet won.
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
