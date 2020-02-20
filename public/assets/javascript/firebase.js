/**
firebase.js

Created by Bernard Kintzing on 2/13/20

This file handles all interactions with Firebase
*/

// Firebase Variables
var auth = firebase.auth();
var database = firebase.database();

// User object
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

// Building object

function building() {
	return {
		name: "",
		description: "",
		dateModified: "",
		issues: []
	};
}

// Store all buildings
var buildings = [];

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
async function createUserWithEmailAndPassword(email, password) {
	return auth
		.createUserWithEmailAndPassword(email, password)
		.then(function(result) {
			// User account successfully created
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
			// Successfully signed out
			return true;
		})
		.catch(function(error) {
			return error;
		});
}

function updateUserDisplayName(name) {
	console.log(user.data);
	user.data.updateProfile({
		displayName: name
	});
}

// Firebase Realtime Database functions

// Retrieve all buildings from the database
async function retrieveBuildingsFromDatabase() {
	if (user.data) {
		return database
			.ref("users/" + user.data.uid + "/buildings/")
			.once("value")
			.then(function(snapshot) {
				// Convert the snapshot into an array
				snapshot.forEach(function(buildingSnapshot) {
					var newBuilding = building();

					// Update information for new building
					newBuilding.name = buildingSnapshot.key;
					newBuilding.description = buildingSnapshot
						.child("description")
						.val();
					newBuilding.dateModified = buildingSnapshot
						.child("dateModified")
						.val();

					// If there are no building issues, set issues to 
					// an empty array rather than null
					buildingIssues = buildingSnapshot.child("issues").val();
					if (buildingIssues != null) {
						newBuilding.issues = buildingIssues;
					}

					buildings.push(newBuilding);
				});

				return [true, buildings];
			})
			.catch(function(error) {
				return [false, error];
			});
	} else {
		return "Unable to retrieve user account";
	}
}

// Attempt to add a building to the database, if the insert
// fails the error message is sent back to the user.
async function addBuildingToDatabase(name, description, issues) {
	// TODO: Set requirement for unique building name

	if (user.data) {
		// Retrieve current date formateed as yyyy-mm-ddThh:mm:ss
		var now = new Date().toISOString().slice(0, 19);

		return database
			.ref("users/" + user.data.uid + "/buildings/" + name)
			.set({
				description: description,
				dateModified: now,
				issues: issues
			})
			.then(function() {
				// Building successfully added
				return true;
			})
			.catch(function(error) {
				return error;
			});
	} else {
		return "Unable to retrieve user account";
	}
}

// Sort the buildings alphabetically using merge sort
function sortBuildingsByParameter(unsortedBuildings, parameter) {
	// No need to sort the array if there is one building or less
	if (unsortedBuildings.length <= 1) {
		return unsortedBuildings;
	}
	// Find middle of buildings array
	var middle = Math.floor(unsortedBuildings.length / 2);

	// Split the building array in half down
	// the middle
	var left = unsortedBuildings.slice(0, middle);
	var right = unsortedBuildings.slice(middle);

	// Recursively sort the buildings depending on
	// the parameter
	if (parameter == "Alphabetically") {
		return mergeBuildingsAlphabetically(
			sortBuildingsByParameter(left, parameter),
			sortBuildingsByParameter(right, parameter)
		);
	} else if (parameter == "Date Modified") {
		return mergeBuildingsByDate(
			sortBuildingsByParameter(left, parameter),
			sortBuildingsByParameter(right, parameter)
		);
	} else if (parameter == "Issues") {
		return mergeBuildingsIssuesCount(
			sortBuildingsByParameter(left, parameter),
			sortBuildingsByParameter(right, parameter)
		);
	}
}

// Sort the building alphabetically by name
function mergeBuildingsAlphabetically(left, right) {
	let resultArray = [];

	while (left.length && right.length) {
		if (left[0].name < right[0].name) {
			resultArray.push(left.shift());
		} else {
			resultArray.push(right.shift());
		}
	}
	resultArray = resultArray.concat(left.slice().concat(right.slice()));
	return resultArray;
}

// Sort the buildings by last date modified.
// More recently modified at the start of the 
// array.
function mergeBuildingsByDate(left, right) {
	let resultArray = [];

	while (left.length && right.length) {
		if (left[0].dateModified < right[0].dateModified) {
			resultArray.push(left.shift());
		} else {
			resultArray.push(right.shift());
		}
	}
	resultArray = resultArray.concat(left.slice().concat(right.slice()));
	return resultArray;
}

// Sort the buldings based on the number of
// issues.
// Buildings with more isses come first.
function mergeBuildingsIssuesCount(left, right) {
	let resultArray = [];

	while (left.length && right.length) {
		if (left[0].issues.length > right[0].issues.length) {
			resultArray.push(left.shift());
		} else {
			resultArray.push(right.shift());
		}
	}
	resultArray = resultArray.concat(left.slice().concat(right.slice()));
	return resultArray;
}
