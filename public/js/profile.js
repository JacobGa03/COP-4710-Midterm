$(document).ready(function () {
  user = getUser()

  keys = ["name", "email", "university"]

  var rows = $("#infoContainer").children()
  // Fill in the information for the different tiles
  for (let i = 0; i < rows.length; i++) {
    $(`#row-${i} h3`).text(user[keys[i]])
  }

  // Enable the button to sign the user out and direct them back to the home page
  $("#signOut").click(function (e) {
    e.preventDefault()
    logout()
  })
})
