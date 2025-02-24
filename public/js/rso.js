$(document).ready(function () {
  for (let i = 0; i < 10; i++) {
    // Add a container
    $("#rsoContainer").append('<div class="rsoCard"></div>')

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
