// Majority of code used from GFG
// https://www.geeksforgeeks.org/form-validation-using-jquery/
$(document).ready(function () {
  // Validate Email
  const email = document.getElementById("enterEmail")
  let emailError = true
  email.addEventListener("blur", () => {
    let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/
    let s = email.value
    if (regex.test(s)) {
      email.classList.remove("is-invalid")
      emailError = true
    } else {
      email.classList.add("is-invalid")
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
    if (passwordValue == "") {
      $("#passwordError").show()
      $("#passwordError").html("Enter Your Password")
      $("#passwordError").css("color", "red")
      passwordError = false
      return false
    }
    $("#passwordError").hide()
    passwordError = true
    return true
  }
  // Submit button
  $("#submitLogin").click(function () {
    validatePassword()
    email.dispatchEvent(new Event("blur"))

    // Ensure that both email and password were entered correctly
    if (passwordError && emailError) {
      return true
    } else {
      return false
    }
  })
})
