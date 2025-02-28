// Majority of code used from GFG
// https://www.geeksforgeeks.org/form-validation-using-jquery/
$(document).ready(function () {
  // Validate Email
  const email = document.getElementById("enterEmail")
  let emailError = true
  email.addEventListener("blur", () => {
    let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/
    let s = email.value

    // Valid email
    if (regex.test(s)) {
      $("#enterEmail").removeClass("is-invalid").addClass("is-valid")
      $("#emailError").hide()
      emailError = true
    }
    // Invalid email
    else {
      $("#enterEmail").removeClass("is-valid").addClass("is-invalid")
      $("#emailError").show()
      emailError = false
    }
  })

  $("#passwordError").hide()
  let passwordError = true
  $("#enterPassword").keyup(function () {
    validatePassword()
  })

  // Validate Password
  function validatePassword() {
    let passwordValue = $("#enterPassword").val()
    // Invalid password
    if (passwordValue == "") {
      $("#enterPassword").removeClass("is-valid").addClass("is-invalid")
      $("#passwordError").show()
      passwordError = false
      return false
    }
    // Valid password
    $("#enterPassword").removeClass("is-invalid").addClass("is-valid")
    $("#passwordError").hide()
    passwordError = true
    return true
  }
  // Submit button
  $("#submitLogin").click(function (e) {
    validatePassword()
    email.dispatchEvent(new Event("blur"))

    // Ensure that both email and password were entered correctly
    if (passwordError && emailError) {
      e.preventDefault()
      // Grab the email and hash the password
      let emailVal = $("#enterEmail").val()
      let password = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
      password.update($("#enterPassword").val())
      let hashedPassword = password.getHash("HEX")

      // Call the login function and handle the response
      login(emailVal, hashedPassword)
        .then(([code, result]) => {
          if (code != 200) {
            // Handle error
            $("#enterEmail").removeClass("is-valid").addClass("is-invalid")
            $("#enterPassword").removeClass("is-valid").addClass("is-invalid")
            $("#passwordError").show()
            return false
          } else {
            // Save the user information into a cookie
            saveUserCookie(result)
            // Redirect to dashboard
            window.location.replace("dashboard.html")
            return true
          }
        })
        .catch((error) => {
          // Handle any errors that occurred during the API call
          console.error("Error during login:", error)
          $("#enterEmail").removeClass("is-valid").addClass("is-invalid")
        })
      return false
    } else {
      return false
    }
  })
})

async function login(email, password) {
  return await callAPI(
    "/login.php",
    { email: email, password: password },
    "POST"
  )
}
