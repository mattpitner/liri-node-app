require("dotenv").config();

var axios = require("axios");
var operator = process.argv[2]
var userInput = process.argv.slice(3).join("+");
var fs = require("fs");
var moment = require('moment')

// OMDB API

function omdb(uInput) {
var omdbQueryUrl = "http://www.omdbapi.com/?t=" + uInput + "&y=&plot=short&apikey=trilogy";
var omdbData = []
if (process.argv.length === 3){
axios.get("http://www.omdbapi.com/?t=mr+nobody+&y=&plot=short&apikey=trilogy").then(
    function(response) {

      console.log(`\nTitle: ${response.data.Title}`);
      console.log(`Year Released: ${response.data.Year}`);
      console.log(`IMDB Rating: ${response.data.imdbRating}`);
      console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`)
      console.log(`Country of production: ${response.data.Country}`);
      console.log(`Language: ${response.data.Language}`);
      console.log(`Plot: ${response.data.Plot}`);
      console.log(`Actors: ${response.data.Actors}\n`);

      omdbData.push(`Title: ${response.data.Title}`, `Year Released: ${response.data.Year}`, `IMDB Rating: ${response.data.imdbRating}`, `Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`, `Country of production: ${response.data.Country}`, `Language: ${response.data.Language}`, `Plot: ${response.data.Plot}`, `Actors: ${response.data.Actors}`)
      logText(omdbData)
    })
} else {
axios.get(omdbQueryUrl).then(
    function(response) {
      console.log(`\nTitle: ${response.data.Title}`);
      console.log(`Year Released: ${response.data.Year}`);
      console.log(`IMDB Rating: ${response.data.imdbRating}`);
      if (response.data.Ratings) {
        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`)
      }
      console.log(`Country of production: ${response.data.Country}`);
      console.log(`Language: ${response.data.Language}`);
      console.log(`Plot: ${response.data.Plot}`);
      console.log(`Actors: ${response.data.Actors}\n`);

      omdbData.push(`Title: ${response.data.Title}`, `Year Released: ${response.data.Year}`, `IMDB Rating: ${response.data.imdbRating}`, `Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`, `Country of production: ${response.data.Country}`, `Language: ${response.data.Language}`, `Plot: ${response.data.Plot}`, `Actors: ${response.data.Actors}`)
      logText(omdbData)
    })
}
}

//Spotify API
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
  
function music(uInput) {
  var musicData = []
  if (!uInput) {
  spotify.search({ type: 'track', query: "the sign, ace of base", limit: 1}, function(err, data) {
    if (err) {
    return console.log('Error occurred: ' + err);
  }
  console.log(`\nArtist(s): ${data.tracks.items[0].artists[0].name}`); 
  console.log(`Song: ${data.tracks.items[0].name}`)
  console.log(`Preview: ${data.tracks.items[0].preview_url}`)
  console.log(`Album: ${data.tracks.items[0].album.name}\n`)

  musicData.push(`Artist(s): ${data.tracks.items[0].artists[0].name}`, `Song: ${data.tracks.items[0].name}`, `Preview: ${data.tracks.items[0].preview_url}`, `Album: ${data.tracks.items[0].album.name}`)
  logText(musicData)
})
  } else {
    spotify.search({ type: 'track', query: uInput}, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
    console.log(`\nArtist(s): ${data.tracks.items[0].artists[0].name}`); 
    console.log(`Song: ${data.tracks.items[0].name}`)
    console.log(`Preview: ${data.tracks.items[0].preview_url}`)
    console.log(`Album: ${data.tracks.items[0].album.name}\n`)

    musicData.push(`Artist(s): ${data.tracks.items[0].artists[0].name}`, `Song: ${data.tracks.items[0].name}`, `Preview: ${data.tracks.items[0].preview_url}`, `Album: ${data.tracks.items[0].album.name}`)
    logText(musicData)
  })
  }
}

//Bands-in-Town API
 
function concert(uInput) {
var bandsQueryUrl = "https://rest.bandsintown.com/artists/" + uInput + "/events?app_id=codingbootcamp"

axios.get(bandsQueryUrl).then(
  function(response) {
if (response.data.length === 0) {
  console.log("Sorry, no concert data. Pick a different artist.")
} else {
  var concertData = []
  for (var i=0; i<6; i++) {
      var eventDate = response.data[i].datetime
      var date = eventDate.split("T");
      var momentDate = moment(date[0], "YYYY-MM-DD");
      var finalDate = momentDate.format("MMMM Do YYYY")

      console.log("-----------------------------------------------------")
      console.log(`Concert Venue: ${response.data[i].venue.name}`);
      console.log(`Location: ${response.data[i].venue.city}`);
      console.log(`Event Date: ${finalDate}\n`);

      concertData.push(uInput)
      concertData.push(`Concert Venue: ${response.data[i].venue.name}`)
      concertData.push(`Location: ${response.data[i].venue.city}`)
      concertData.push(`Event Date: ${finalDate}`)
    }
  logText(concertData)
  }
  })
}

 // Do-what-it-says
function doit() {
 fs.readFile("random.txt", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }

  var command = data.split(",")
  var randomCommand = command[0]
  var randomSong = command[1]

  switchCase(randomCommand, randomSong)
 })
}

function logText(result) {
  fs.appendFile("log.txt", `${JSON.stringify(result)}\n`, function(err) {
    if (err) {
      return console.log(err);
    }
})
}

function switchCase(op, ui) {
 switch(op) {
    case "movie-this":
        omdb(ui)
        break;
    case "spotify-this-song":
        music(ui)
        break;
    case "concert-this":
        concert(ui)
        break;
    case "do-what-it-says":
        doit()
        break;
    default: // else
        return console.log("Not a valid command. Please try: 'concert-this', 'spotify-this-song', 'movie-this', or 'do-what-it-says'");
}
}
switchCase(operator, userInput)