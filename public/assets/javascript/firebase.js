/**
firebase.js

Created by Bernard Kintzing on 2/13/20

This file handles all interactions with Firebase
*/

// Firebase Variables
var auth = firebase.auth();

// User variables
var user = {
	aInternal: null,
	aListener: function(val) {},
	set data(val) {
		this.aInternal = val;
		this.aListener(val);
	},
	get data() {
		return this.aInternal;
	},
	registerListener: function(listener) {
		this.aListener = listener;
	}
};

// Firebase Auth Functions

// Listener method for state of user
// If user is signed in, their profile is retrieved
// If signed out, user is set to null
auth.onAuthStateChanged(function(updatedUser) {
	user.data = updatedUser;
});

// Sign user in with a given username and email
async function signInWithEmailAndPassword(email, password) {
	return auth
		.signInWithEmailAndPassword(email, password)
		.then(function(result) {
			return result;
		})
		.catch(function(error) {
			return error;
		});
}

// Create a user account with given name, email, and password
async function createUserWithEmailAndPassword(name, email, password) {
	return auth
		.createUserWithEmailAndPassword(email, password)
		.then(function(result) {
			result.user.updateProfile({
				displayName: name.value
			});
			return result;
		})
		.catch(function(error) {
			return error;
		});
}

// Sign out the current user
async function signOutFirebaseUser() {
	return auth
		.signOut()
		.then(function() {
			return true;
		})
		.catch(function(error) {
			return error;
		});
}
