$(document).ready(function () {
  for (let i = 0; i < 10; i++) {
    $("#eventContainer").append('<div class="eventCard"></div>')

    // Grab the most recently added event card and inject the 'event_card.html' into it.
    // Use the callback to insert anything else into the card that we want to modify
    $(".eventCard")
      .last()
      .load("components/event_card.html", function () {})
  }
})
