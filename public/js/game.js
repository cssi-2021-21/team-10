console.log('game script is running!')

let googleUserId
let words
let statistics 
let wordEntry 
let score = 0
//when the user starts the game, we load up a list of words 
window.onload =  (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //check if the user has logged in
            googleUserId = user.uid
            console.log('google user id', googleUserId)
            gameUpdate(googleUserId)
        }
        else {
            //navigate back to the login page
            window.location = "./index.html"
        }
    }
    )
}

const gameUpdate = async (userId) => {
    const pastWords = getPastSeenWords(userId)
    words = await getWords(pastWords)
    wordEntry = Array.from(words)
    statistics = new Map()
    updateGameHTML()    
}

const getWords = async (wordsGotten) => {
        const randomWordAPI = 'https://random-words-api.vercel.app/word' 
        const res = await fetch(randomWordAPI)
        let ret = await (await fetch(randomWordAPI)).json()
        let count = 0
        let set = 0
        const words = new Map()
        while ( count < 10 && set < 20){
            ret = await( await fetch(randomWordAPI)).json()
            let word = ret[0].word
            let definition = ret[0].definition
            if(!(wordsGotten.has(word) && words.has(word))){
                words.set(word, definition)
                count ++
            }
            set ++ 
        }
        if(count < 10){
            alert('Sorry, but we have run out of words. Come back later when we have updated our database')
            window.location = '../index.html'
        }
        return words
}

/*

users:

    user:{
        highScore : //stores number correct
        p1:{ 
            wordData : {
                w1: false 
                w2: true

            }
        }

        p2 : {
            wordData :{
                w1 : {
                    correct : true/false
                    defenition :'something something'
                }
                w2 : {
                    correct : true/false
                    defenition : 'something something"
                }
                w3 : {
                    correct: true/false
                    defenition : 'something something'
                }
            }
        }
    }

*/


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

//this updates the html
const updateGameHTML =  () => {
    console.log('words', wordEntry)
    if (!wordEntry.length) {
        alert('The game has finished!')
        window.location = '../results.html'
        //push the words to firebase here

        /*
        we're going to add to the database and also delete words from the database 


        */
       console.log('userid', googleUserId)
       console.log('game score', score)
       
        const ref = firebase.database().ref(`users/${googleUserId}`)
        ref.push(
            {   gameScore : score,
                wordData: getGameData()
            }
        )
        ref.on('value', (snapshot) => {
            const data = snapshot.val()

        })
        console.log('game data', getGameData())    

    }
    else {
        //if the game hasn't finished, then pop a new word
        const entry = wordEntry.pop()
        const word = entry[0]
        const wordDefenition =  entry[1]
        console.log('its defenition', wordDefenition)
        document.querySelector("#defenition").innerHTML = wordDefenition
        document.querySelector(`#choice1`).innerHTML = word
        let i = 2
        for (let key of words.keys()) {
            if(key !== word){
                document.querySelector(`#choice${i}`).innerHTML = key
                i++
            }
            if(i == 5){
                break
            }
        }
        //did a bit of hardcoding but I can fix this later
    }
}

const getGameData = () => {
    const gameData = {}
    for(const key of words.keys()){
        gameData[key] = {
            status : statistics.get(key),
            definition : words.get(key)
        }
    }
    return gameData
}

//triggers when a button is pressed
const onSubmit =  (elementId) => {
  console.log(words)
  const word = getWordOnButton(elementId)
  const defenition = getDefinitionOnDisplay()
  const actualWordDefenition =  words.get(word)

  if(actualWordDefenition.replace(/\s+/g, "") === defenition.replace(/\s+/g, "")){
      statistics.set(word, 'Correct')
      const scoreVal = document.querySelector("#score")
      scoreVal.innerHTML = `Score : ${++score}`
      console.log('score', score)
  }
  else{
      statistics.set(getCorrectWord(defenition), 'Incorrect')
  }

    updateGameHTML()
    timeSecond = 11; //time reset for each question
    move(); //progress bar

}
//gets word on the button
const getWordOnButton= (elementId) => {
    const element = document.querySelector(`#${elementId}`)
    return element.innerHTML.trim().replace(/[\r\n]+/gm, '')
}
//gets word defenition 
const getDefinitionOnDisplay = () => {
    return document.querySelector("#defenition").innerHTML.trim().replace(/[\r\n]+/gm, '')
}
//gets word based on the defenition
const getCorrectWord = (defenition) => {
    for(let key of words.keys() ){
        if (words.get(key).replace(/[\r\n]+/gm, '') === defenition.replace(/[\r\n]+/gm, '')){
            return key
        }
    }
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
            const word = getCorrectWord(getDefinitionOnDisplay()) //getting the 
            statistics.set(word, 'Time ran out') //keeping track of statistics
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
//end of time functions


//progress bar
var width = 10;

function move() {
  var elem = document.getElementById("myBar");
    if (width < 100) {
      width+=10;
      elem.style.width = width + '%';
      elem.innerHTML = width * 1 + '%';
    }

}

