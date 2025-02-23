$(document).ready(function () {
  for (let i = 0; i < 10; i++) {
    $("#eventContainer").append('<div class="eventCard"></div>')

    $(".eventCard").each(function () {
      $(this).load("components/event_card.html")
    })
  }
})
