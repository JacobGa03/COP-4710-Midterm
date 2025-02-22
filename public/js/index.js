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
  let url = "http://localhost:8000/backend" + endpoint

  const response = await formatResponse(url, method, requestData)
  // Call the api
  const result = await response.json()

  // Determine if response was successful
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
