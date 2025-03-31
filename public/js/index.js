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
        return [response.status, result]
      case 404:
        return [response.status, {}]
      case 500:
        return [response.status, {}]
      default:
        return [response.status, {}]
    }
  } catch (e) {
    console.log("API error: ", e)
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
// Get the user type of the current user. Distinction is important
// since the different type of users have different things they can do.
function getUserType() {
  user = getUser()
  return user && user.hasOwnProperty("stu_id") ? "student" : "super admin"
}
// Delete user's cookie and send them to the home page
async function logout() {
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  window.location.replace("landing.html")
}
// Get the university name for a given University ID
async function getUniversityName(uni_id) {
  return await callAPI("/getUniversityName.php", { u_id: uni_id }, "POST")
}

// * This stores time in UTC, meaning that most times will look off.
// * One can use 'toLocaleTimeString()' to convert to your local time zone.
function convertToDateTime(isoString) {
  // Create a Date object from the ISO string
  const date = new Date(isoString)

  // Extract the components
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0") // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  const seconds = String(date.getUTCSeconds()).padStart(2, "0")

  // Format to MySQL DATETIME format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
// Get the RSO information based on an RSO id
async function getRSO(rso_id) {
  return await callAPI("/getRSO.php", { rso_id: rso_id }, "POST")
}
