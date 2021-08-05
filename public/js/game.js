console.log('game script is running!')
console.log('api key', key)

let googleUserId
let words
let score = 0
//when the user starts the game, we load up a list of words 
window.onload =  (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
            //check if the user has logged in
            googleUserId = user.uid
            getWords(googleUserId)
        }
        else{
            //navigate back to the login page
            window.location = "index.html"
        }
    }
    )
}

//gets the words from the database
const getWords = async (userId) => {
    //we now make an api call to get a list of words. We loop through the list of words to make sure they aren't repeated
    console.log('called')
    words =  new Set(await res.json())
    
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

const getWord = async (wordsGotten, previousWords) => {
        const randomWordAPI = 'https://random-words-api.vercel.app/word' 
        const res = await fetch(randomWordAPI)
        let word = await res.json()
        while (wordsGotten.has(word) && previousWords.has(word)){
            word = await( await fetch(randomWordAPI))
        }
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
const updateGameHTML = async () => {
    console.log('words', words)
    if(!words.length){
        alert('The game has finished!')
        window.location = '../results.html' 
    }
    else{
        const word = words.pop()
        console.log('word', word)
        const wordDefenition = await getWordDefenition(word)
        console.log('its defenition', wordDefenition)
        document.querySelector("#defenition").innerHTML = wordDefenition
        document.querySelector(`#choice1`).innerHTML = word
        for(let i = 2; i < 5; i++){
            document.querySelector(`#choice${i}`).innerHTML = words[i] || 'something random'
        }
    //this has a ton of edge cases, so I'm just hard coding it right now
    }
}

const getWordDefenition = async (word) => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`
    const res = await fetch(url)
    const myJsonResponse = await res.json()
    console.log(myJsonResponse[0].meanings[0].definitions[0].definition)    
   return myJsonResponse[0].meanings[0].definitions[0].definition
}

const onSubmit = async (elementId) => {
  console.log(words)
  const element = document.querySelector(`#${elementId}`)
  const word = element.innerHTML.trim().replace(/[\r\n]+/gm, '')
  const defenition = document.querySelector("#defenition").innerHTML.trim().replace(/[\r\n]+/gm, '')
  const actualWordDefenition = await getWordDefenition(word)
  if(actualWordDefenition === defenition){
      const scoreVal = document.querySelector("#score")
      scoreVal.innerHTML = `Score : ${++score}`
      console.log('score', score)
  }
  updateGameHTML()
}