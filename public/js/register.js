async function register() {
  // Grab elements from the page
  let email = $("body").find("#enterEmail")
  let password = $("body").find("#enterPassword")
  let confirmPassword = $("body").find("#reEnterPassword")
  let school = $("body").find("#enterSchool")
  let userType = $("input[name='form-check']:checked")

  console.log(`${email} ${password} ${confirmPassword} ${school} ${userType}`)

  // Ensure some other fields are checked and report their validity
  // If checks fail, don't register the user
  // Register the user with the database
}
