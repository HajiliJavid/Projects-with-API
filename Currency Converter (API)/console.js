const CURRENCY_API_URL = 'https://api.currencyapi.com/v3/latest?apikey=cur_live_EMpVJyUMLpRMDOHk3XppyVYmdD3AK81Sml4YJ0NK';

let exchangeRates = {};

const amountFrom = document.getElementById('amount-from');
const amountTo = document.getElementById('amount-to');
const currencyFrom = document.getElementById('currency-from');
const currencyTo = document.getElementById('currency-to');
const swapButton = document.getElementById('swap-button');
const rateDisplay = document.getElementById('rate-display');
const keypadButtons = document.querySelectorAll('.keypad button');

function fetchExchangeRates() {
    fetch(CURRENCY_API_URL)
        .then(response => response.json())
        .then(data => {
            exchangeRates = data.data;
            updateCurrencyOptions();
            convertCurrency();
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
        });
}

function updateCurrencyOptions() {
    const currencies = Object.keys(exchangeRates);
    [currencyFrom, currencyTo].forEach(select => {
        select.innerHTML = currencies.map(currency => 
            `<option value="${currency}">${currency}</option>`
        ).join('');
    });
    currencyFrom.value = 'USD';
    currencyTo.value = 'EUR';
}

function convertCurrency() {
    const fromCurrency = currencyFrom.value;
    const toCurrency = currencyTo.value;
    const amount = parseFloat(amountFrom.value) || 0;

    const rate = exchangeRates[toCurrency].value / exchangeRates[fromCurrency].value;
    const convertedAmount = amount * rate;
    
    amountTo.value = Math.round(convertedAmount * 100) / 100;
    rateDisplay.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
}

function swapCurrencies() {
    [currencyFrom.value, currencyTo.value] = [currencyTo.value, currencyFrom.value];
    convertCurrency();
}

function handleKeypadInput(value) {
    if (value === '⌫') {
        amountFrom.value = amountFrom.value.slice(0, -1);
    } else if (value === '.' && !amountFrom.value.includes('.')) {
        amountFrom.value += value;
    } else if (value !== '.') {
        amountFrom.value += value;
    }
    convertCurrency();
}

amountFrom.addEventListener('input', convertCurrency);
currencyFrom.addEventListener('change', convertCurrency);
currencyTo.addEventListener('change', convertCurrency);
swapButton.addEventListener('click', swapCurrencies);

keypadButtons.forEach(button => {
    button.addEventListener('click', () => handleKeypadInput(button.textContent));
});

fetchExchangeRates();