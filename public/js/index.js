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
  let url = "localhost:8000/backend" + endpoint

  let options = {
    body: JSON.stringify(requestData),
    method: method,
  }
  // Make the call to PHP
  let response = await fetch(url, options)

  // Decode the response
  let body = JSON.parse(await response.response.text())

  // Determine if response was successful
  switch (response.status) {
    case 200:
      console.log("Successful request...")
      return [response.status, body]
    case 400:
      console.log("Error result not found...")
      return [response.status, null]
    case 500:
      console.log("Internal server error...")
      return [response.status, null]
  }
}
