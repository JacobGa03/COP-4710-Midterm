$(document).ready(function () {
  // Validate email
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
      // $("#passwordError").show()
      passwordError = false
      return false
    }
    // Valid password
    $("#enterPassword").removeClass("is-invalid").addClass("is-valid")
    // $("#passwordError").hide()
    passwordError = true
    return true
  }

  $("#confirmPasswordError").hide()
  let confirmationPasswordError = true
  $("#reEnterPassword").keyup(function () {
    validateConfirmationPass()
  })

  // Validate confirmation password
  function validateConfirmationPass() {
    let confirmation = $("#reEnterPassword").val()

    // Password and confirm password don't match
    if (confirmation != $("#enterPassword").val()) {
      $("#reEnterPassword").removeClass("is-valid").addClass("is-invalid")
      $("#confirmPasswordError").show()
      confirmationPasswordError = false
      return false
    }
    $("#reEnterPassword").removeClass("is-invalid").addClass("is-valid")
    $("#confirmPasswordError").hide()
    confirmationPasswordError = true
    return true
  }

  // Enable auto complete for the school names
  $.getJSON("assets/us_institutions.json", function (data) {
    const schoolNames = data.map((school) => school.institution)

    // Initialize autocomplete
    $("#enterSchool").autocomplete({
      source: schoolNames,
    })
  })

  // Handle submit
  $("#submitRegister").click(function () {
    validateConfirmationPass()
    validatePassword()
    email.dispatchEvent(new Event("blur"))

    // Ensure that both email and password were entered correctly
    if (passwordError && emailError && confirmationPasswordError) {
      return true
    } else {
      return false
    }
  })
})
