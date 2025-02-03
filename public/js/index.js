// Just a test function to hit a fake PHP endpoint
async function testPHP() {
  document.getElementById("fetchData").addEventListener("click", function () {
    fetch("backend/test.php")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("paraText").innerText = data
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  })
}
