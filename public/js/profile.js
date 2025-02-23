$(document).ready(function () {
  user = getUser()
  // Insert their name and school
  $("#displayName").append(`<h2>${user["email"]}</h2>`)
  $("#displaySchool").append(`<h2>${user["university"]}</h2>`)

  // Enable the button to sign the user out and direct them back to the home page
  $("#signOut").click(function (e) {
    e.preventDefault()
    logout()
  })
})
