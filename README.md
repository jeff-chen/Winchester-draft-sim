This is a little webapp that is a blatant plagiarism of another repository of my friends that allows you to run the Savage Worlds initiative system, but right now is a prototype for a Winston draft simulator for magic, using my cube as reference.  Edit the config.js file to set your port (default of 3141), loglevel can stay at 1.  Point your browser to the host's IP, and have fun!

The first person to make a room with a password is automatically the admin of that room.  That person can force cards to be drawn for others, or to boot others.

To do:
~*High Priority*~
1.  If a user leaves a game and relogs, make sure that when that user comes back, the current state of the game (what that user has taken, whose turn it is, what piles contain what) are up to date.  On that note, games should expire after a certain session length (this may already happen but I'm not too sure) Bug: if someone leaves and rejoins, sometimes the create new game button will show.

2.  Images of the cards being shown, seriously

3.  Display the pile last taken and who took it

4.  Rearrange the piles/list to look better.  It'd be nice to not have to constantly scroll to see the piles as each person's taken cards gets larger and larger.

~*Would be Nice*~

5.  Export decklist after done/deck building capabilities

6.  No login screen - users are asked for a username and automatically thrown into a lounge, and can propose games with others.  This is ambitious.

7.  Allow users to put in their own cube for a session?

8.  Sort taken cards by color - this would require importing data about the cards themselves