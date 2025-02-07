// import { sha256 } from "sha256.js"

async function login() {
  let email = $("body").find("#enterEmail").val()
  //   let password = sha256($("body").find("#enterPassword")).val()
  let password = $("body").find("#enterPassword").val()

  console.log(`email: ${email} & password: ${password} `)
}
