/**
signin.js

Created by Bernard Kintzing on 2/13/20

This file attempts to sign in user with given 
email address and password. If the sign in attempt
fails the user is displayed appropriate error
messages.
 */

function signIn() {
	var email = document.querySelector("#email").value;
	var password = document.querySelector("#password").value;

	promise = signInWithEmailAndPassword(email, password);

	promise.then(function(result) {

        if (result.user != null) {
			// User is successfully logged in
			window.location.replace("dashboard.html");
        } else {
            // Error attempting to sign in user
            alert(result)
        }
    })
}
