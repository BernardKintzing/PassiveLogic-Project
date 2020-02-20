/**
signup.js

Created by Bernard Kintzing on 2/17/20

This file attempts to create a user account with given 
email address and password. If the sign up attempt
fails the user is displayed appropriate error messages.
 */

function signUp() {
	var name = document.querySelector("#name").value;
	var email = document.querySelector("#email").value;
	var password = document.querySelector("#password").value;
	var confirmPassword = document.querySelector("#confirm-password").value;

	if (password == confirmPassword) {
		var promise = createUserWithEmailAndPassword(email, password)

		promise.then(function(result) {
	
			if (result.user != null) {
				// User is successfully logged in
				updateUserDisplayName(name)
				window.location.replace("dashboard.html");

			} else {
				// Error attempting to sign in user
				alert(result)
			}
		})
	} else {
		alert("Passwords do not match.")
	}
}
