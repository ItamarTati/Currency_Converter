const axios = require('axios');

// https://fixer.io/
const FIXER_API_KEY = '88510ea363251eeac469565d730d35d3';
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

// https://restcountries.eu
const REST_COUNTRIES_API = `https://restcountries.eu/rest/v2/currency`;

// Fetch data about currencies
const getExchangeRate = async(fromCurrency, toCurrency) => {
    try {
    const { data: { rates } } = await axios.get(FIXER_API);
    const euro = 1/ rates[fromCurrency];
    const exchangeRate = euro * rates[toCurrency];
    return exchangeRate;
    } catch (error) {
        throw new Error (`Unable to get currency ${fromCurrency} and ${toCurrency}`)
    }
}

// Fetch data about countries

const getCountries = async (currencyCode) => {
    try {
    const {data} = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}`);
    return data.map(({name}) => name);
    } catch (error) {
        throw new Error (`Unable to get countries that use ${currencyCode}`)
    }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();
    const [countries, exchangeRate] = await Promise.all([
        getCountries(toCurrency),
        getExchangeRate(fromCurrency, toCurrency),
    ]);
    const convertedAmount = (amount * exchangeRate).toFixed(2);
    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. 
        You can spend these in the following countries: ${countries}.`
}
// const result = await convertCurrency('GBP', 'EUR', 20)
// console.log(result)
convertCurrency('GBP', 'EUR', 20)
    .then((result) => console.log(result))
    .catch((error) => console.log(error))