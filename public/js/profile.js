$(document).ready(function () {
  user = getUser()
  // Keys to grab from when displaying user information
  keys = ["name", "email"]

  var rows = $("#infoContainer").children()
  // Fill in the information for the different tiles
  for (let i = 0; i < 2; i++) {
    $(`#row-${i} h3`).text(user[keys[i]])
  }

  let u_id = user.u_id != null ? user.u_id : user.university
  // Get the university's name and display
  // Make an async call to the API to grab the actual name.
  getUniversityName(u_id)
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
        const rsoAdminCard = $(`<div id="rso-${result["rso_id"]}"></div>`)
        rsoAdminCard.load("components/rso_info.html", function () {
          $(this).find("h5").text(result["name"])
          $(this).find("h6").text("You are an Admin")
          const description =
            result["description"] == null
              ? "No description..."
              : result["description"]
          $(this)
            .find("p")
            .text(
              `${
                description.length > 100
                  ? description.substring(0, 100) + "..."
                  : description
              }`
            )
          $(this).find(".btn").hide()
        })
        $("#RSOAdminCards").append(rsoAdminCard)
      }
    })
  })
  // Use the list of RSO ids to display them in a card list view
  getUser().rso_member.forEach((rso_id) => {
    // Load each card
    getRSO(rso_id).then(([code, result]) => {
      if (code == 200) {
        const rsoMemberElement = $(`<div id="rso-${result["rso_id"]}" ></div>`)

        rsoMemberElement.load("components/rso_info.html", function () {
          $(this).find("h5").text(result["name"])
          $(this).find("h6").text("You are a Member")
          const description =
            result["description"] == null
              ? "No description..."
              : result["description"]
          $(this)
            .find("p")
            .text(
              `${
                description.length > 100
                  ? description.substring(0, 100) + "..."
                  : description
              }`
            )
          $(this).find(".btn").show()
          // Remove the user from the event
          $(this)
            .find(".btn")
            .on("click", function () {
              // Leave the rso
              leaveRSO(result["rso_id"])
              // Remove the RSO from the list of which the user is a part
              $(`#rso-${result["rso_id"]}`).remove()

              // Update user cookie to reflect that they have left
              let user = getUser()
              let newRSO = []
              newRSO = user.rso_member.forEach((rso_id) => {
                if (rso_id != result["rso_id"]) newRSO.push(rso_id)
              })
              user.rso_member = newRSO || []
              saveUserCookie(user)
            })
        })
        $("#RSOMemberCards").append(rsoMemberElement)
      }
    })
  })
}

async function leaveRSO(rso_id) {
  return await callAPI(
    "/leaveRSO.php",
    { rso_id: rso_id, stu_id: getUser().stu_id },
    "POST"
  )
}
