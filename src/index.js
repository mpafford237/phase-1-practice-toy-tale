document.addEventListener("DOMContentLoaded", () => {
  let addToy = false;
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const addToyForm = document.querySelector('.add-toy-form');
  const toyCollection = document.getElementById('toy-collection');

  // Toggle form display
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display toys
  fetch('http://localhost:3000/toys')
  .then(response => response.json())  // Fixed: Added missing () after response.json
  .then(toys => {
    toys.forEach(toy => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" alt="Image of ${toy.name}" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;

      toyCollection.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error fetching toys:', error)
  });

  // Add a new toy
  addToyForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const toyName = event.target.elements.name.value;
    const toyImage = event.target.elements.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      // Use the same function to append the newly created toy
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" alt="Image of ${toy.name}" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;
      toyCollection.appendChild(card);
    })
    .catch(error => console.error('Error adding new toy:', error));
  });

  // Handle like button clicks
  toyCollection.addEventListener('click', event => {
    if (event.target.className === 'like-btn') {
      const button = event.target;
      const card = button.parentElement;
      const likesP = card.querySelector('p');
      const newLikes = parseInt(likesP.textContent.split(' ')[0]) + 1;

      fetch(`http://localhost:3000/toys/${button.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application.json"
        },
        body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
        likesP.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error updating likes:', error));
    }
  });
});
