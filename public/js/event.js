$(document).ready(function () {
  const event = JSON.parse(localStorage.getItem("event"))
  console.log(event)

  // Grab the start time
  // Adding Z here represents Eastern Time
  const startDate = new Date(event.start_time + "Z")
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Load the event information
  $("#eventName").text(event.name)
  $("#timedate").text(`${formattedDate} at ${formattedTime}`)
  $("#category").text(event.category)
  $("#contactInfo").text(`${event.contact_phone} or ${event.contact_email}`)
  $("#eventDescription").text(event.description || "None added...")
})
