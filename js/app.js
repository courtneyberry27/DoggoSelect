const select = document.getElementById('breeds');
const card = document.querySelector('.card');
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log('Looks like there was a problem.', error))
}

Promise.all([
        fetchData('https://dog.ceo/api/breeds/list'), //drop down menu values
        fetchData('https://dog.ceo/api/breeds/image/random') //images
    ])
    .then(data => {
        const breedList = data[0].message;
        const randomImage = data[1].message;

        generateOptions(breedList);
        generateImage(randomImage);
    })

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
//CHECKS STAUS OF RESPONSE TO REQUEST
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

//DISPLAYS DOG bREED MENU
function generateOptions(data) {
    const options = data.map(item => `
      <option value='${item}'>${item}</option>
    `).join('');
    select.innerHTML = options;
}

//DISPLAYS DDOG IMAGE
function generateImage(data) {
    const html = `
        <img src='${data}' alt>
        <p>Click to view images of ${select.value}s</p>
    `;
    card.innerHTML = html;
}

//GETTING BREED IMAGE THAT IS CHOSEN FROM LIST
function fetchBreedImage() {
    const breed = select.value;
    const img = card.querySelector('img');
    const p = card.querySelector('p');

    fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(data => {
            img.src = data.message;
            img.alt = breed;
            p.textContent = `Click to view more ${breed}s`;
        })
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
select.addEventListener('change', fetchBreedImage); //BREED SELECTION
card.addEventListener('click', fetchBreedImage); //IMAGE
form.addEventListener('submit', postData); //NAME AND COMMENT
// ------------------------------------------
//  POST DATA
// ------------------------------------------
function postData(e) {
    e.preventDefault();
    let name = document.getElementById('name').value;
    let comment = document.getElementById('comment').value;
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, comment })
    };

    fetch('https://jsonplaceholder.typicode.com/comments', config) //POST REQUEST
        .then(checkStatus)
        .then(response => response.json())
        .then(data => console.log(data))
}
