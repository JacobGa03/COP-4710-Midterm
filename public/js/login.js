import { sha256 } from "./sha256.js"

async function login() {
  // Grab the credentials
  let email = $("body").find("#enterEmail")
  let password = $("body").find("#enterPassword")

  if (!validEntry(email.val(), password.val())) return

  // TODO: Log user in
}

function validEntry(email, password) {
  return email != "" && password != ""
}

window.login = login
