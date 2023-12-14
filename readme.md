# Drawing Game
## About
Idea of app can simply be shrunk to one sentence, Online multiplayer draw and guess.

## Node.js
To start the game server, you need to install Node.js. You can get the latest version [***here***](https://nodejs.org/en/).

## Text Editor
If you are interested in game development/modification, you should have a text editor, such as [***Visual Studio Code***](https://code.visualstudio.com/). It comes with many useful tools and has numerous extensions that facilitate game development.

## Node Packages

To install node modules for the game, navigate to the drawing game program folder in the command prompt by typing:
```sh
cd "C:/path/to/the/folder/"
```
Now, you are ready to install the node packages:
```sh
npm install
```
Wait for the installation to complete, and then type:
```sh
npm start
```
The command prompt should now print:
```sh
Server running on port 3000!
```
To shut down the server, press CTRL+C twice.

## Changing the Port
In the file index.js, on line 7, the application's port number is defined. By changing this number, you can alter the port (changes to the server require a restart).

## Known Bugs
- The drawer can take someone else's turn by typing their own answer in the chat.
- When the drawer generates a new word, the server thinks the round has changed, leading to an incorrect increment in the round counter.
- Players with the same name encounter various issues.
- Players can disrupt the drawer by removing the ***draw-block*** element using inspect element, allowing them to draw as well.
- Modifying the code reveals the correct word. The fix will involve moving the message check to the server side. (Other code modifications will also be addressed in the same way.)

## Future Improvements
- Enhance game security by restructuring the server and client software.
- Change login to a database-stored account instead of a "one-time" user account (fixing the issue where players with the same username face problems).
- Implement a user-account tied scoring system.
- Expand the color palette for more drawing options.
