/**
dashboard.js

Created by Bernard Kintzing on 2/17/20
*/

// Attempt to sign out the user
function signOut() {
    promise = signOutFirebaseUser()

    promise.then(function(result) {
        if (result == true) {
            window.location.replace("index.html");
        } else {
            alert(result)
        }
    })
}