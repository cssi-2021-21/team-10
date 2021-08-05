console.log('game script is running!')

let googleUserId
let words
let wordEntry 
let score = 0
//when the user starts the game, we load up a list of words 
window.onload =  (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //check if the user has logged in
            googleUserId = user.uid
            gameUpdate(googleUserId)
        }
        else {
            //navigate back to the login page
            window.location = "index.html"
        }
    }
    )
}

const gameUpdate = async (userID) => {
    const pastWords = getPastSeenWords(userID)
    words = await getWords(pastWords)
    wordEntry = Array.from(words)
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
    userId:{
        highScore : //stores number correct
        p1:{ 
            wordData : {
                w1: false 
                w2: true

            }
        }

        p2 : {
            wordData :{
                w1 : false
                w2 : true
                w3 : false
            }
        }
    }
    ,
    userId:{
        highScore : //stores number correct
        p1:{ 
            wordData : {
                w1: false 
                w2: true

            }
        }

        p2 : {
            wordData :{
                w1 : false
                w2 : true
                w3 : false
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



        */
    }
    else {
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


const onSubmit =  (elementId) => {
  console.log(words)
  const element = document.querySelector(`#${elementId}`)
  const word = element.innerHTML.trim().replace(/[\r\n]+/gm, '')
  const defenition = document.querySelector("#defenition").innerHTML.trim().replace(/[\r\n]+/gm, '')
  const actualWordDefenition =  words.get(word)

  if(actualWordDefenition.replace(/\s+/g, "") === defenition.replace(/\s+/g, "")){
      const scoreVal = document.querySelector("#score")
      scoreVal.innerHTML = `Score : ${++score}`
      console.log('score', score)
  }

    updateGameHTML()
    timeSecond = 11; //time reset for each question
    move(); //progress bar

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

