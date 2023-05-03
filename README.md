# Texas Hold'em Poker

This game have all the classic rules of Texas Hold'em and was implemented during Evolution Typescript Course.
All the game logic was written by me, no other libraries were used for it.

## Tech Stack

- Typescript
- React
- MobX
- ReactPixi
- SCSS
- Howler
- Jest

### Main functionality (What was made)

- Combination and winner check functions (tested with Jest)
- Combination check for low Straight/Straight flush (with ace)
- Split-Pot functionality
- Low all-in winner functionality (checks all winners step-by-step if main winner has low all-in, so others will fight for remaining bank)
- Ability to calculate winnings when players splitted pot with not equal bets (also low all-in case)
- Remaining money returning functionality (if player raises for more than other player could afford, remaining will be returned)
- Bots AI
- Spectating ability of bots game after losing
- Bidding functionality
- Blinds and dealer clockwise changing functionality
- Blinds rising functionality
- Heads-up rules functionality
- Animations for card distribution, winning amount, board cards
- Showdown waiting time (if more players paricipating in showdown, user will have more time to see combinations and opposite)
- All calculations logic
- Sound effects and music
- Eliminating from the table functionality and blinds/dealer changing after it
- Fully responsive canvas
- Responsive first page with SCSS
- Could be played at any device which supports canvas
- Canvas visual part and rendering
- All UI in the game was implemented with PixiJS/ReactPixi
- Ability to choose number of opponents
- Ability to choose start stack amount


### Tricky poker rules/logic moments videos of game and them explanation
1. [video 1](https://www.youtube.com/watch?v=wUrnj26QieU)

As you see here small all-in has the best combination so he is able to take maximum the same amount of his bet from everyone and other part of bank will be
taken by Bot-Bella because she has higher combination than me (Michel Morgan). Also after showdown you will see animation of winning amount of winners. 12 for
Bella as remaining bank and other huge part for low all-in winner Edward. This animation will work also if there will be split pot, more than one winner and other cases. 
And pay attention on showdown timings,if at the showdown we have only 2 players we will have 10 second to see other hands and combinations and if we have more players at showdown 
this timing will rise by 2seconds for each +1 player.Maximum could be 20 sec.
____________________________________________________________
2. [video 2](https://www.youtube.com/watch?v=fpri1qP_Gpc)

Here firstly we can see the eliminating process from the table, so if players stack after hand is less than big blind
this player will be eliminated. And if he had some small remaining in the stack, this money will be placed into a bank for next hand.
And how you see after the elimination of real player(Michel Morgan) - game still continues and we can spectate how bots are playing.
Also now we have hands-up poker situation where only two players are playing, so we have only dealer chip and dealer always is small blind player.
So heads-up and blinds logic also works well after eliminating. And in the end of the video you could see when the game is over, so last player has 400$ stack, it means that
calculations also work well.
____________________________________________________________
3. [video 3](https://www.youtube.com/watch?v=WbaGTc0qwQs)

Here you will see all-in bets for three players, with not equal amounts. So I placed max all-in with 229 and it means that in any case the remaining will be returned to my stack.
Also Mark goes all-in with 73 and Bot-Travis with 98. In the end you can see that the smallest all-in won, so he can take maximum only the size of his bet from all players, thats why he won
only a part of bank which is 222 and other part of bank was played between me and Travis, and this part is only something around 50$, 
thats because extra amount of placed bet should be returned to me in any case.
_________________________________________________________
4. [video 4](https://www.youtube.com/watch?v=HOghjdmsnjk)

Split-pot logic between not equal all-ins also was implemented.
So here Bot-Travis will place 25$ and then fold, me and Bot-Bella will go all-in and Nelson will call my bet. How you see Bella will have low all-in. So in the end everyone will take their 
stack from the beginning of the hand and 25$ which was Travis bet will be splitted by the percentage of bets. So because Bella has a little bit lower bet, she will take less from this money,
and Nelson and me will split the last amount, because of same bets. 
This logic also will works perfectly if we have a winner with low all-in and all others splitted the remaining bank by their bets percentage and so on.


## Run project
1. Install dependencies - `npm install`
2. Start the project - `npm start`

