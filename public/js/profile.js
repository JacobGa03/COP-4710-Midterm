$(document).ready(function () {
  user = getUser()
  // Keys to grab from when displaying user information
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
    $("#superAdminSection").hide()
    // Display a list view of the RSOs the user is a admin/member of
    loadRSOView()
  } else {
    $("#RSOSection").hide()
  }

  // Enable the button to sign the user out and direct them back to the home page
  $("#signOut").click(function (e) {
    e.preventDefault()
    logout()
  })
})

async function loadRSOView() {
  getUser().rso_admin.forEach((rso_id) => {
    // Load each card
    getRSO(rso_id).then(([code, result]) => {
      if (code == 200) {
        // Load the card
        $("#RSOAdminCards").append(`<div class="rsoCard" ></div>`)
        $(".rsoCard")
          .last()
          .load("components/rso_info.html", function () {
            $(this).find("h5").text(result["name"])
            $(this).find("h6").text("You are an Admin")
          })
      }
    })
  })
  // Use the list of RSO ids to display them in a card list view
  getUser().rso_member.forEach((rso_id) => {
    // Load each card
    getRSO(rso_id).then(([code, result]) => {
      if (code == 200) {
        // Load the card
        $("#RSOMemberCards").append(`<div class="rsoCard" ></div>`)
        $(".rsoCard")
          .last()
          .load("components/rso_info.html", function () {
            $(this).find("h5").text(result["name"])
            $(this).find("h6").text("You are a Member")
          })
      }
    })
  })
}
// Get the RSOs information
async function getRSO(rso_id) {
  return await callAPI("/getRSO.php", { rso_id: rso_id }, "POST")
}
