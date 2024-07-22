document.addEventListener("DOMContentLoaded", function () {
  const taskList = document.getElementById('taskList');

  taskList.addEventListener('click', (event) => {
      // Verify that the clicked element is a list item
      if (event.target.tagName === 'LI') {
          // Toggle the selected class on the clicked item
          event.target.classList.toggle('selected');
      }
  });

  document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(this);
      const email = formData.get('email');
      
      fetch('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `email=${encodeURIComponent(email)}`
      })
      .then(response => response.text())
      .then(data => alert(data));
  });

  // JSON data for demonstration
  const movieDataJson = `[
      {
          "title": "Inception",
          "director": "Christopher Nolan",
          "year": 2010,
          "genre": ["Sci-Fi", "Action", "Thriller"],
          "actors": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]
      },
      {
          "title": "The Shawshank Redemption",
          "director": "Frank Darabont",
          "year": 1994,
          "genre": ["Drama"],
          "actors": ["Tim Robbins", "Morgan Freeman", "Bob Gunton"]
      },
      {
          "title": "The Godfather",
          "director": "Francis Ford Coppola",
          "year": 1972,
          "genre": ["Crime", "Drama"],
          "actors": ["Marlon Brando", "Al Pacino", "James Caan"]
      }
  ]`;

  // Parse the JSON string into a JavaScript object
  const movieCollection = JSON.parse(movieDataJson);

  // Access individual movie data
  console.log(movieCollection[0].title); // Output: Inception
  console.log(movieCollection[1].director); // Output: Frank Darabont
  console.log(movieCollection[2].actors); // Output: ["Marlon Brando", "Al Pacino", "James Caan"]

  // Convert the JavaScript object back to a JSON string
  const jsonString = JSON.stringify(movieCollection);
  console.log(jsonString);
});
