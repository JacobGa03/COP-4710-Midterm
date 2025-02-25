$(document).ready(function () {
  for (let i = 0; i < 10; i++) {
    // Give each displayed RSO a unique id so grabbing
    // a specific id will be much easier to do.
    $("#rsoContainer").append(`<div class="rsoCard" id=rso-${i}></div>`)

    // Load the content into the event card
    $(".rsoCard")
      .last()
      .load("components/event_card.html", function () {
        // This callback function runs after the content is loaded
        $(this).find("h5").text("RSO Name")
        $(this).find("h6").text("RSO Type")
      })
  }
})

async function getRSO(searchQuery = "") {
  // Need the uuid of the user to make queries
  user = getUser()
  return await callAPI(
    "/getRSO.php",
    {
      userId: user.stuId,
      query: searchQuery,
    },
    "POST"
  )
}
