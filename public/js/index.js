const BASE_URL = "http://localhost:8000"
const BACKEND = "/backend"
// Just a test function to hit a fake PHP endpoint
async function testPHP() {
  fetch("backend/test.php").then((response) =>
    response.text().then((data) => console.log(`The API says: ${data}`))
  )
}
// Input the final '/endpoint' path to specify which API endpoint to hit.
// requestData is some JSON object containing the info the specific endpoint needs.
// method specifics which verb you'd like to run, ie. "POST", "GET", "UPDATE", etc.
async function callAPI(endpoint, requestData, method) {
  let url = BASE_URL + BACKEND + endpoint

  try {
    // Format the JSON request
    const response = await formatResponse(url, method, requestData)
    // Call the api
    const result = await response.json()

    // Determine if response was successful
    // Decode more of the responses
    switch (response.status) {
      case 200:
        console.log("Successful request...")
        return [response.status, result]
      case 404:
        console.log("Error result not found...")
        return [response.status, {}]
      case 500:
        console.log("Internal server error...")
        return [response.status, {}]
      default:
        console.log("Unexpected Error...")
        return [response.status, {}]
    }
  } catch (e) {
    console.log(e)
  }
}

// Format the request based on the HTTP method
async function formatResponse(url, method, requestData) {
  if (method == "GET") {
    url = url + "?" + new URLSearchParams(requestData).toString()
    return await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } else {
    return await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
  }
}
// Save user info into a cookie. Store user id which will make API calls easy
function saveUserCookie(user) {
  // Save time stamp
  let timestamp = new Date()
  timestamp.setTime(timestamp.getTime() + 20 * 60 * 1000)
  // Save user data
  let jsonUserData = JSON.stringify(user)
  jsonUserData = encodeURIComponent(jsonUserData)

  // Store the user data in cookie
  document.cookie =
    "user=" +
    jsonUserData +
    ";" +
    "expires=" +
    timestamp.toUTCString() +
    ";" +
    "path=/"
}
// Return user information from the browser cookie
function getUser() {
  let user = null

  for (let c of document.cookie.split(";")) {
    c = c.trimStart()

    if (c.startsWith("user=")) {
      let value = c.substring(5)
      // Decode the user object
      value = decodeURIComponent(value)
      user = JSON.parse(value)
    }
  }
  return user
}
// Delete user's cookie and send them to the home page
async function logout() {
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  window.location.replace("landing.html")
}
