//THIS FILE REQUIRES NODE & NPM - USE THE INCLUDED INSTALLER (node-v16.14.0-x64.msi).
var actions = require('./actions.js');
// Code will not run if files are missing
var tmi = require('./node_modules/tmi.js');
const { username } = require('./node_modules/tmi.js/lib/utils');
const jp = require('jsonpath');

var data = require('./database.json');
const { param } = require('jquery');
const obj = data;

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//BUILD SELECT - EDIT number value to select a build AND streamer (see "selector" values in database.json for options)

const buildSelect = 0;
const streamerSelect = 0;

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//BUILD VARIABLES - Edit in database.json, NOT here.
const channelName = obj.streamer[streamerSelect].channelname; //Twitch channel the bot is posting to. If empty, defaults to test channel (MartieStreams)
if (channelName === "") { 
    var streamChannel = "martiestreams"
} else {
    var streamChannel = channelName
};
var spons = obj.build[buildSelect].sponsored; //Is this game sponosred? (Most likely, yes)
var sponsor= obj.build[buildSelect].sponsorname; //Sponsor's Name
if (obj.build[buildSelect].sponsoredmsg === "") { //Did the sponsor include a link or message?
    var spons_ad = false;
} else {
    var spons_ad = true;
};
var adcontent = obj.build[buildSelect].sponsoredmsg; //Optional sponsor link/message content
var buildID = obj.build[buildSelect].buildID;
var streamerID = obj.streamer[streamerSelect].streamerID;
var gameURL = "https://streamplay.live/";
var liveURL = gameURL; //URL to the PlayLive game (Live Mode)
var firstPrize = obj.streamer[streamerSelect].firstprize;
var secondPrize = obj.streamer[streamerSelect].secondprize;
var thirdPrize = obj.streamer[streamerSelect].thirdprize;

//CONFIGURATION (Don't edit this)
const opts = {
  options: {
    debug: true,
  },
  identity: {
    username: "Qimo",
    password: "oauth:2nic9948amecyg62rxai87fevwps1w"
  },
  channels: [
   streamChannel
  ]
};
const client = new tmi.client(opts);

//GAME VARIABLES - THESE REQUIRE INPUT FROM PLAYLIVE GAME
var live = true; //Set to "true" when alink is open
var firstplace = "FIRST" //@Username
var secondplace = "SECOND" //@Username
var thirdplace = "THIRD" //@Username
var mostrecentgame = "" //Game start timestamp (MM/DD/YYYY HH:MM)

//CHAT CONTENT - Triggered by chat input (DO NOT EDIT)
client.on('message',(channel, userstate, message, self)=>{
    //GAME FUNCTIONS - PlayLive events trigger these
    function gameLoad() {
        client.say(channel, `Time to play! Scan the QR on stream, or tap this link on your phone to join in: ${liveURL}`)
    };

    function loadMin() {
        client.say(channel, `One minute left to load in! Scan the QR on stream, or tap this link on your phone to join the game: ${liveURL}`)
    };

    function loadThirty() {
        client.say(channel, `Thirty seconds left to load in! Scan the QR on stream, or tap this link on your phone to join the game: ${liveURL}`)
    };
    function loadTen() {
        client.say(channel, `Ten seconds left to load in! Scan the QR on stream, or tap this link on your phone to join the game: ${liveURL}`)
    };

    function gameLaunch() {
        client.say(channel, `The game starts NOW! Good luck, everyone!`)
    };

    function countdownThirty() {
        client.say(channel, `Thirty seconds left!`)
    };

    function gameOver() {
        client.say(channel, `Time's up! @${streamChannel} Wins! PogChamp PogChamp PogChamp `)
    };

    //STANDARD (STATIC) COMMANDS
    if(message ==="!hello") {
        var mention = userstate['display-name']
        client.say(channel, `Hi there, @${mention}! I'm Qimo! :) Let's play some games together!`);
    };
    if(message ==="!qimo") {
        var mention = userstate['display-name']
        client.say(channel, `I'm Qimo, your PlayLive automatic assistant. Check out the "Qimo Commands" panel on the left for a full list of commands!`);
    };
    if(message ==="!commands") {
        client.say(
            channel, `Check out the "Qimo Commands" panel on the left for a full list of commands!`
        );
    };
    if(message ==="!test") {
        var mention = userstate['display-name']
        client.say(channel, `${streamChannel}`);
    };

    //CONDITIONAL COMMANDS: Sponsor Status
    if (spons === true && spons_ad === false) {
        if(message ==="!sponsor") {
            client.say(channel, `Today's prizes were provided by ${sponsor}! Show them some love!`);
        }
    };
    if (spons === true && spons_ad === true) {
        if(message ==="!sponsor") {
            client.say(channel, `Today's prizes were provided by ${sponsor}! ${adcontent}`);
        };
    };
    
    //CONDITIONAL COMMANDS: Live Status
    if(live === false && message ==="!playlive") {
        client.say(channel, `There isn't a live event underway, but you can still play for fun! ${gameURL}`);
    };
    if(live === true && message ==="!playlive") {
        client.say(channel, `Visit this link on your phone and connect your Twitch account to join in! ${liveURL}`);
    };
    if(live === false && message ==="!prizes") {
        client.say(channel, `There isn't a live event underway, so there are no prizes at the moment.`);
    };
    if(live === true && message ==="!prizes") {
        if(firstPrize === "" && message ==="!prizes") {
            client.say(channel, `There aren't any prizes at the moment.`);
        } else if(secondPrize === "" && message ==="!prizes") {
            client.say(channel, `Current Prize: 1st Place - ${firstPrize}`);
        } 
        else {
            client.say(channel, `Current Prizes: 1st Place - ${firstPrize}, 2nd Place - ${secondPrize}, 3rd Place - ${thirdPrize}`);
        };
    };

    //FUNCTION TEST COMMANDS: For dev testing ONLY
    if(message ==="!test-initLoad") {
        gameLoad();
    };
    if(message ==="!test-1m") {
        countdownMin();
    };
    if(message ==="!test-30s") {
        countdownThirty();
    };
    if(message ==="!test-win") {
        gameWin();
    };
    if(message ==="!testLoad") {
        function testLoad(){
            gameLoad();
            let min = setTimeout(loadMin, 10000);
            let thirty = setTimeout(loadThirty, 30000);
            let ten = setTimeout(loadTen, 50000);
            let launch = setTimeout(gameLaunch, 60000);
        };
        testLoad(); 
    };
    if(message ==="!testGame") {
        function testGame(){
            countdownThirty();
            let end = setTimeout(gameOver, 30000);
        };
        testGame(); 
    };
});

client.connect();

function success(){
    window.alert("success!")
};