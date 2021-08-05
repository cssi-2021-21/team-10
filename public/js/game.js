console.log('game script is running!')
//console.log('api key', key)

let googleUserId
let words
let defenitions
let temp = {}
let score = 0
//when the user starts the game, we load up a list of words 
window.onload = (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //check if the user has logged in
            googleUserId = user.uid
            getWords(googleUserId)
        }
        else {
            //navigate back to the login page
            window.location = "index.html"
        }
    }
    )
}
/*
//gets the words from the database
const getWords = (userId) => {
    //we now make an api call to get a list of words. We loop through the list of words to make sure they aren't repeated
    console.log('called')
    const randomWordAPI = 'https://random-word-api.herokuapp.com/all?swear=0' //making sure no swear words so it's pg
    fetch(randomWordAPI)
        .then(res => res.json())
        .then(myJson => {
            console.log('reached')
            words = new Set(myJson)
            console.log('words', words)
        })
        .catch(err => {
            console.log('error was', err)
        })
    //we now choose a set or random elements from our list of words- from our list of words
    const seenWords = getPastSeenWords(userId)
    for(const seenWord of seenWords){
        words.delete(seenWord)
    }
    //words is now a set of words that the user hasn't seen before. We now just take the first 10 elements 
    words = ([...words]).slice(0, 10) //converting it into an array and taking the first 10 words from it
    if(words.length < 10){
        //inform the user that we have run out of words
        alert('Sorry, but we have run out of words. Come back later when we have updated our database')
        window.location = '../index.html'
    }
    else{
        //update this by rendering it into html
        updateGameHTML()
    }
}

*/
const getWords = (userID) => {
    words = [
        'scarf',
        'houses',
        'optimal',
        'check',
        'preserve',
        'actor',
        'tan',
        'yak',
        'few',
        'baby',
        'bat',
        'cellar']
    defenitions = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l'
    ]
    for (let i = 0; i < words.length; i++) {
        temp[words[i]] = defenitions[i]
    }

    if (words.length < 10) {
        //inform the user that we have run out of words
        alert('Sorry, but we have run out of words. Come back later when we have updated our database')
        window.location = '../index.html'
    }
    else {
        //update this by rendering it into html
        updateGameHTML()
    }
}

/*

user:
    userId:
        p1:
            wordData : {
                w1: false 
                w2: true

            }
        p2 :
            wordData :{
                w1 : false
                w2 : true
                w3 : false
            }

*/

/*
//this gets the past seen words of the user and returns a set of their past words
const getPastSeenWords = (userId) => {
    const ref = firebase.database().ref(`users/${userId}`)
    const seenWords = new Set() 
    ref.on('value', (snapshot) => {
        const data = snapshot.val()
        for(val in data){
            for (word in data[val].wordData){
                seenWords.add(word)
            }
        }
    })
    console.log('seen words', seenWords)
    return seenWords
}
*/
//this updates the html
const updateGameHTML = () => {
    console.log('words', words)
    if (!words.length) {
        alert('The game has finished!')
        window.location = '../results.html'
    }
    else {
        const word = words.pop()
        console.log('word', word)
        const wordDefenition = getWordDefenition(word)
        console.log('its defenition', wordDefenition)
        document.querySelector("#defenition").innerHTML = wordDefenition
        document.querySelector(`#choice1`).innerHTML = word
        for (let i = 2; i < 5; i++) {
            document.querySelector(`#choice${i}`).innerHTML = words[i] || 'random'
        }
        //this has a ton of edge cases, so I'm just hard coding it right now
    }
}

const getWordDefenition = (word) => {
    /* const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${key}`
     fetch(url)
     .then(res => res.json())
     .then (myJson => {
         console.log(myJson)
 
     })
     */

    return temp[word]
}



const onSubmit = (elementId) => {

    console.log(words)
    const element = document.querySelector(`#${elementId}`)
    const word = element.innerHTML.trim().replace(/[\r\n]+/gm, '')
    const defenition = document.querySelector("#defenition").innerHTML.trim().replace(/[\r\n]+/gm, '')
    if (getWordDefenition(word) === defenition) {
        const scoreVal = document.querySelector("#score")
        console.log('score', score)
        scoreVal.innerHTML = `Score : ${++score}`
    }



    updateGameHTML()
    timeSecond = 11; //time reset for each question
    move();


}


//time
timeSecond = 10;
const startBtn = document.querySelector("#startBtn")
startBtn.addEventListener("click", () => {
    defenition = document.querySelector("#defenition")
    defenition.classList.remove("hidden")
    hiddenTile = document.querySelector("#hiddenTile")
    hiddenTile.classList.remove("hidden");
    const timeH = document.querySelector("h1");
    //const startBtn= document.querySelector("#startBtn")
    startBtn.style.display = 'none';
    displayTime(timeSecond);

    const countDown = setInterval(() => {
        timeSecond--;
        displayTime(timeSecond);
        if (timeSecond == 0 || timeSecond < 1) {
            /* endCount();
              times[index] = 10- timeSecond;
              index+=1; */


            // clearInterval(countDown);
            
            updateGameHTML();
            timeSecond = 11;
            move();

        }
    }, 1000);
    function displayTime(second) {
        const min = Math.floor(second / 60);
        const sec = Math.floor(second % 60);
        timeH.innerHTML = ` <b><font size="8">
  ${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}</font></b>
  `;
    }

})

function endCount() {
    timeH.innerHTML = "Time out";
}



//progress bar
var width = 1;

function move() {
  var elem = document.getElementById("myBar");
    if (width < 100) {
      width+=9;
      elem.style.width = width + '%';
      elem.innerHTML = width * 1 + '%';
    }
  
}

