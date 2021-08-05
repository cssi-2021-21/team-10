let googleUserId


window.onload = (event) => {
    console.log('user id', googleUserId)
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
            //check if the user has logged in
            console.log('logged in as')
            googleUserId = user.uid
            console.log(googleUserId)
        }
        else{
            //navigate back to the login page
           //get data from api and display score
            window.location = "index.html"
        }
    }
    )
}