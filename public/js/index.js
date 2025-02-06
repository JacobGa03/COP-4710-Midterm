// Just a test function to hit a fake PHP endpoint
async function testPHP() {
  // fetch("backend/test.php")
  //   .then((response) => response.text())
  //   .then((data) => {
  //     document.getElementById("testingAPI").innerText = data
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching data:", error)
  //   })
  fetch("backend/test.php").then((response) =>
    response
      .text()
      .then((data) => (document.getElementById("testingAPI").innerText = data))
  )
}
