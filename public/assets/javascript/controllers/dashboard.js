/**
dashboard.js

Created by Bernard Kintzing on 2/17/20
*/

// UI element variables
var buildingName = document.getElementById("building-name")
var buildingDescription = document.getElementById("building-description")
var issues = document.getElementById("issues")
var issuesLabel = document.getElementById("issues-label")

// Unique identifiers for each issue
var issueID = 0

// Hold onto all issue elements
var issueElements = {}


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

// Attempt to send a new building to the database
function submitBuilding() {

}

// Display an empty modal for user to
// create a new building
function displayBlankModal() {

	// Reset the modal to a blank form
	buildingName.value = ""
	buildingDescription.value = ""
	issues.innerHTML = ""
	issuesLabel.classList.add("hidden");
	issueElements = {}

	modal.style.display = "block"
}

// Hide the modal when user clicks on X
// in top right
function closeModal() {
    modal.style.display = "none"
}

// Hide modal is user clicks anywhere on
// page besides modal
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none"
	}
};

// Add a new issue input field
function addIssueField() {

	// If this is the first issue display the 
	// issues label
	if(Object.keys(issueElements).length == 0) {
		issuesLabel.classList.remove("hidden");
	}

	var newIssue = document.createElement("div");
	newIssue.classList.add("issue-wrapper")
	newIssue.innerHTML = '<input id="issue' + issueID + '" type="text" placeholder="New Issue" name="issue' + issueID + '" required> <span class="close" onclick="removeIssueField('+ issueID +')">&times;</span>'
	issues.appendChild(newIssue)

	issueElements[issueID] = newIssue
	issueID ++
}

// Remove and issue field given the issue number
function removeIssueField(num) {
	var issue = issueElements[num]

	// Remove the element
	issue.remove()
	delete issueElements[num]

	// If all issues are removed, then hide issues label
	if(Object.keys(issueElements).length == 0) {
		issuesLabel.classList.add("hidden");
	}
}
