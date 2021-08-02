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
            words = myJson
        })
        .catch(err => {
            console.log('error was', err)
        })
    //we now choose a random element from our list of words 
}
