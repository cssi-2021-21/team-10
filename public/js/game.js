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

}