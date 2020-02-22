/**
index.js

Created by Bernard Kintzing on 2/13/20

This file checks to see if user is signed in when page loads.
If so the user is redirected to their dashboard.
 */

// If user is already signed in then they are
// automatically redirected to the dashboard.
user.registerListener(function(val) {
	if (val != null) {
		// User is signed in 
		window.location.replace("dashboard.html");
	}
});
