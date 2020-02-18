/**
dashboard.js

Created by Bernard Kintzing on 2/17/20
*/

// Safe guard to make sure a user who is not
// signed in can not access the dashboard
user.registerListener(function(val) {
	if (!val) {
		window.location.replace("index.html");
	}
});

// Attempt to sign out the user
function signOut() {
	promise = signOutFirebaseUser();

	promise.then(function(result) {
		if (result == true) {
			window.location.replace("index.html");
		} else {
			alert(result);
		}
	});
}

// Display an empty modal for user to
// create a new building
function displayBlankModal() {
	modal.style.display = "block";
}

// Hide the modal when user clicks on X
// in top right
function closeModal() {
    modal.style.display = "none";
}

// Hide modal is user clicks anywhere on
// page besides modal
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
};
