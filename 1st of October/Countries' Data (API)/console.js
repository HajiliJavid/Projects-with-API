const apiUrl = 'https://restcountries.com/v3.1/';
const submitButton = document.querySelector(`#submit-button`)
const searchInput = document.querySelector(`#search-input`)
const countryContainer = document.querySelector(`#country`)

const findCountry = (name) => {
    const link = `${apiUrl}name/${name}`
    fetch(link).then(res => res.json()).then(response => {
        if (response.status === 404)  {
            alert('Country not found')
            return 
        }

        countryContainer.style.display = 'flex'

        country = response[0]

        const {languages} = country

        const languageList = []

        for (const key in languages) {
            languageList.push(`<li>${languages[key]}</li>`)
        }
        countryContainer.innerHTML = `
        <img src="${country.flags.png}" alt="${country.name.common} flag">
        <h1>${country.name.common}</h1>
        <h3>Capital: ${country.capital[0]}</h3>
        <h3>Languages</h3>
        <ul>
        ${languageList}
        </ul>
        <button>
        <a target="_blank" href="${country.maps.googleMaps}">Map</a>
        </button>
        `
    })
}

submitButton.addEventListener('click', (e) => {
    countryContainer.style.display = 'none'
    e.preventDefault()
    findCountry(searchInput.value)
})


