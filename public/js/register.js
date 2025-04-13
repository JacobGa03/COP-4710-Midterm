$(document).ready(function () {
  // Validate email
  const email = document.getElementById("enterEmail")
  let emailError = true
  email.addEventListener("blur", () => {
    let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/
    let s = email.value
    $("#emailInput .invalid-feedback").text("Please enter a valid email")

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

  async function doesDomainMatchSchool(schoolName, email) {
    const data = await $.getJSON("assets/university_domains.json")
    const school = data.find((school) => school.name === schoolName)
    if (school) {
      console.log(school.domain)
      let emailDomain = email.split("@")[1]
      console.log(email.split("@")[1])
      return emailDomain == school.domain
    } else {
      return false // Return false if the school is not found
    }
  }

  // Handle submit
  $("#submitRegister").click(function (e) {
    e.preventDefault()
    validateConfirmationPass()
    validatePassword()
    email.dispatchEvent(new Event("blur"))

    // Grab the email and hash the password
    let emailVal = $("#enterEmail").val()
    let password = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
    password.update($("#enterPassword").val())
    let hashedPassword = password.getHash("HEX")
    let university = $("#enterSchool").val()
    let userType = $("input[name='flexRadioDefault']:checked").val()
    let name = $("#enterName").val()

    // Ensure that students sign up with the correct email domain

    // Ensure that both email and password were entered correctly
    if (passwordError && emailError && confirmationPasswordError) {
      // Ensure the user's email matches the domain of their university
      doesDomainMatchSchool(university, emailVal).then((emailMatch) => {
        // The email matches
        if (emailMatch) {
          console.log("Your email domain matches")
          register(emailVal, hashedPassword, university, userType, name).then(
            ([code, result]) => {
              console.log("API response ", { code, result })
              if (code == 409) {
                // Indicate email is already taken
                $("#enterEmail").removeClass("is-valid").addClass("is-invalid")
                $("#emailInput .invalid-feedback").text(
                  "Email is already taken"
                )
                $("#emailError").text("Email is already taken")
                $("#emailError").show()

                // Set proper class errors
                emailError = false
                return false
              } else if (code == 500) {
                // Server error
                console.log("Error: ", result)
                alert("There was an error registering. Please try again.")
              } else {
                // Save the user information into a cookie
                saveUserCookie(result)
                console.log(`Saving the user's cookie ${result}`)

                // Redirect to dashboard
                window.location.replace("dashboard.html")
                return true
              }
            }
          )
        }
        // The email doesn't match
        else {
          console.log("Your email domain doesn't match")
          $("#enterEmail").removeClass("is-valid").addClass("is-invalid")
          $("#emailInput .invalid-feedback").text(
            "Your Email Domain Must Match Your Institution"
          )
          $("#emailError").text("Your Email Domain Must Match Your Institution")
          $("#emailError").show()
          return false
        }
      })
    } else {
      return false
    }
  })
})

async function register(email, password, university, userType, name) {
  return await callAPI(
    "/register.php",
    {
      email: email,
      password: password,
      university: university,
      role: userType,
      name: name,
    },
    "POST"
  )
}
