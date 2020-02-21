/**
dashboard.js

Created by Bernard Kintzing on 2/17/20
*/

// UI element variables
var dashboardTitle = document.getElementById("dashboard-title");
var searchField = document.getElementById("search-field");
var buildingName = document.getElementById("building-name");
var buildingDescription = document.getElementById("building-description");
var issues = document.getElementById("issues");
var issuesLabel = document.getElementById("issues-label");

// Unique identifiers for each issue
var issueID = 0;

// Hold onto all issue elements
var issuesDict = {};

// Safe guard to make sure a user who is not
// signed in can not access the dashboard
user.registerListener(function(val) {
	if (!val) {
		window.location.replace("index.html");
	} else {
		// If user has a displayName, update the
		// dashboard title
		var displayName = val.displayName;
		if (displayName != null) {
			dashboardTitle.innerHTML = displayName + "'s Dashboard";
		}

		// After user is signed in all buildings
		// are retrieved from the database.
		promise = retrieveBuildingsFromDatabase();
		promise.then(function(result) {
			var success = result[0];
			var data = result[1];

			if (success) {
				// Buildings successfully downloaded
				// Update the UI to display buildings
				populateBuildings(buildings);
			} else {
				alert("Unable to retrieve buildings");
			}
		});
	}
});

// Attempt to sign out the user
function signOut() {
	promise = signOutFirebaseUser();
	promise.then(function(result) {
		if (result == true) {
			// User successfully signed out, redirect
			// them to the home page
			window.location.replace("index.html");
		} else {
			alert(result);
		}
	});
}

// Attempt to send a new building to the database
function submitBuilding() {
	// Retrieve building information
	var buildingNameValue = buildingName.value;
	var buildingDescriptionValue = buildingDescription.value;
	var issueValues = [];

	// Retrive building issues
	issueElements = issues.getElementsByTagName("input");

	for (i = 0; i < issueElements.length; i++) {
		issueValues.push(issueElements[i].value);
	}

	promise = addBuildingToDatabase(
		buildingNameValue,
		buildingDescriptionValue,
		issueValues
	);

	promise.then(function(result) {
		if (result == true) {
			closeModal();
			alert("Building successfully added");
			populateBuildings(buildings);
		} else {
			alert(result);
		}
	});
}

function populateBuildings(content) {
	var buildingsElement = document.getElementById("buildings");
	buildingsElement.innerHTML = "";

	for (i = 0; i < content.length; i++) {
		buildingsElement.innerHTML +=
			'<div class="building"><h2>' +
			content[i].name +
			"</h2><button>View More</button><p>" +
			content[i].description +
			"</p><p>" +
			content[i].issues.length +
			" Issues</p></div>";
	}
}

function sortBuildings(select) {
	buildings = sortBuildingsByParameter(
		buildings,
		select.options[select.selectedIndex].text
	);
	populateBuildings(buildings);
}

function searchBuildings() {
	var query = searchField.value;
	var queryResult = [];

	for (i = 0; i < buildings.length; i++) {
		if (buildings[i].name.toLowerCase().includes(query.toLowerCase())) {
			queryResult.push(buildings[i]);
		}
	}

	populateBuildings(queryResult);
}

// Display an empty modal for user to
// create a new building
function displayBlankModal() {
	// Reset the modal to a blank form
	buildingName.value = "";
	buildingDescription.value = "";
	issues.innerHTML = "";
	issuesLabel.classList.add("hidden");
	issuesDict = {};

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

// Add a new issue input field
function addIssueField() {
	// If this is the first issue display the
	// issues label
	if (Object.keys(issuesDict).length == 0) {
		issuesLabel.classList.remove("hidden");
	}

	var newIssue = document.createElement("div");
	newIssue.classList.add("issue-wrapper");
	newIssue.innerHTML =
		'<input id="issue' +
		issueID +
		'" type="text" placeholder="New Issue" name="issue' +
		issueID +
		'" required> <span class="close" onclick="removeIssueField(' +
		issueID +
		')">&times;</span>';
	issues.appendChild(newIssue);

	issuesDict[issueID] = newIssue;
	issueID++;
}

// Remove and issue field given the issue number
function removeIssueField(num) {
	var issue = issuesDict[num];

	// Remove the element
	issue.remove();
	delete issuesDict[num];

	// If all issues are removed, then hide issues label
	if (Object.keys(issuesDict).length == 0) {
		issuesLabel.classList.add("hidden");
	}
}
