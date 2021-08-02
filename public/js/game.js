console.log('game script is running!')

let googleUserId

//when the user starts the game, we load up a list of words 
window.onload = (event) => {
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
const getWords = (userId) => {
    //we now make an api call to get a list of words. We loop through the list of words to make sure they aren't repeated
    const randomWordAPI = 'https://random-word-api.herokuapp.com/all?swear=0' //making sure no swear words so it's pg
    let words 
    fetch(randomWordAPI)
        .then(res => res.json())
        .then(myJson => {
            words = new Set(myJson)
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
        alert('Sorry, but we have run out of words')
        window.location = '../index.html'
    }
    else{
        //update this by rendering it into html
        renderDataAsHTML(userID, words)
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
    return seenWords
}

const renderDataAsHTML = (userID, words) => {

}
