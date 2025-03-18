$(document).ready(function () {
  user = getUser()

  keys = ["name", "email"]

  var rows = $("#infoContainer").children()
  // Fill in the information for the different tiles
  for (let i = 0; i < 2; i++) {
    $(`#row-${i} h3`).text(user[keys[i]])
  }

  // Get the university's name and display
  // Make an async call to the API to grab the actual name.
  getUniversityName(user.u_id)
    .then(([code, result]) => {
      if (code == 200) {
        $(`#row-2 h3`).text(result.name)
      } else {
        $(`#row-2 h3`).text("State University")
        console.error("Error fetching university name:", result)
      }
    })
    .catch((error) => {
      console.error("Error fetching university name:", error)
    })

  // Fil in the different RSO information
  if (getUserType() == "student") {
    $("#RSOSection").append("<h1>Your RSOs</h1>")
    // Display a list view of the RSOs the user is a admin/member of
    loadRSOView()
  }

  // Enable the button to sign the user out and direct them back to the home page
  $("#signOut").click(function (e) {
    e.preventDefault()
    logout()
  })
})

async function loadRSOView() {
  // Grab the list of RSO id's the user is a admin of
  Object.values(
    getUser()
      .rso_admin.replace(/[\[\] ]/g, "")
      .split(",")
      .filter(Boolean)
  ).forEach((rso_id) => {
    $("#displayRSOAdmins").append("")
  })

  // Grab the list of the RSOs which the user is a member of
  Object.values(
    getUser()
      .rso_member.replace(/[\[\] ]/g, "")
      .split(",")
      .filter(Boolean)
  ).forEach((rso_id) => {
    $("#displayRSOMember").append("")
  })
}
