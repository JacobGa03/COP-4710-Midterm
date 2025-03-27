$(document).ready(function () {
    // Submit button
    $("#submitSearch").click(function (e) {
      e.preventDefault();
  
      // Grab the input values
      let nameVal = $("#name").val();
      let categoryVal = $("#category").val();
      let locationVal = $("#location").val();
      let associatedUniVal = $("#associated_uni").val();
      let timeVal = $("#time").val();
  
      // Call the findEvent function and handle the response
      findEvent(nameVal, categoryVal, locationVal, associatedUniVal, timeVal)
        .then(([code, events]) => {
          if (code != 200) {
            // Handle error
            alert("An error occurred while searching for events.");
            return false;
          } else {
            displayEvents(events);
            return true;
          }
        })
        .catch((error) => {
          // Handle any errors that occurred during the API call
          console.error("Error during event search:", error);
          alert("An error occurred while searching for events.");
        });
    });
  });
  
  async function findEvent(name, category, location, associatedUni, time) {
    return await callAPI(
      "/findEvent.php",
      { name: name, category: category, location: location, associated_uni: associatedUni, time: time },
      "POST"
    );
  }
  
  function displayEvents(events) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
  
    if (events.length === 0) {
      resultsContainer.innerHTML = '<p>No events found.</p>';
      return;
    }
  
    events.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('event');
      eventElement.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.description}</p>
        <p>Category: ${event.category}</p>
        <p>Location: ${event.location}</p>
        <p>Contact: ${event.contact_info}</p>
        <p>Time: ${event.time}</p>
      `;
      resultsContainer.appendChild(eventElement);
    });
  }