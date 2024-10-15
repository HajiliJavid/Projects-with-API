const ActorFullName = document.querySelector('h2');
const role = document.querySelector('.actor-role');
const description = document.querySelector('.actor-description');
const imagePart = document.querySelector('.image-section img');
const btnLeft = document.querySelector('.btn-left');
const btnRight = document.querySelector('.btn-right');
const showSkillButton = document.querySelector('.toggle-skill-btn');

let currentIndex = 0;
let actorsData = [];

function fetchActors() {
    fetch('https://jsonplaceholder.typicode.com/users') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network Error');
            }
            return response.json();
        })
        .then(data => {
            actorsData = data.map((actor, index) => ({
                id: index + 1,
                name: actor.name,
                role: actor.username, 
                description: actor.email, 
                image: `https://i.pravatar.cc/150?img=${index + 1}`
            }));

            displayActor(currentIndex);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayActor(index) {
    const actor = actorsData[index];
    if (actor) {
        ActorFullName.textContent = actor.name;
        role.textContent = actor.role;
        description.textContent = actor.description;

        imagePart.src = actor.image;
        imagePart.alt = actor.name;
    }
}

function changeButtonColor() {
    showSkillButton.style.backgroundColor = currentIndex % 2 === 0 ? 'blue' : 'green';
}

btnLeft.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayActor(currentIndex);
        changeButtonColor();
    }
});

btnRight.addEventListener('click', () => {
    if (currentIndex < actorsData.length - 1) {
        currentIndex++;
        displayActor(currentIndex);
        changeButtonColor();
    }
});

window.onload = () => {
    fetchActors();
};
