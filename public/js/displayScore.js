console.log('script running')

let googleUserId
window.onload = (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //check if the user has logged in
            googleUserId = user.uid
            console.log('google user id', googleUserId)
            updateScore(googleUserId)
        }
        else {
            //navigate back to the login page
            window.location = "./index.html"
        }
    }
    )
}

//get data from api and display score
const updateScore =  (userId) => {
    const ref = firebase.database().ref(`users/${userId}`)
    ref.limitToLast(1).on('child_added', (snapshot, prevChildKey)=> {
        const data = snapshot.val()
        console.log(`recently added post`, data)
        const score = data.gameScore
        document.querySelector("#totalScore").innerHTML = score
    })
}