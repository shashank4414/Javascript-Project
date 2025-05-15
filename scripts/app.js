let url = "JSON/country.json";
let api = "https://restcountries.com/v3.1/all"

// function to fetch json
async function fetchdata(sourceURL) {
    let response = await fetch(sourceURL);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json(); //return response as json
}


// Event listener for the button click
document.getElementById("btnDisplay").addEventListener("click", function () {
    let divOutput = document.getElementById("output");
    divOutput.innerHTML = ""; // clear output area
    let outputString = "";

    let countries = []; // array for local json
    let countriesAll = []; // array for api json

    fetchdata(url) // fetch from local json
        .then(
            data => {
                data.forEach(object => {
                    countries.push(object); // adds each country object to array
                });
                // sort the objects in descending order by country name
                countries.sort((a, b) => b.country.localeCompare(a.country));
                return fetchdata(api); // fetch from api json
            })
        .then( // chaining .then methods ensures forEach loop doesn't run prematurely
            data => {
                data.forEach(element => {
                    countriesAll.push(element);
                });

                if (countries.length == 0) { // if local json has no country data
                    divOutput.innerHTML = `<p>No Country Data is Available to View</p>`;
                }

                countries.forEach(country => { // iterates over countries array
                    let matchedCountry = countriesAll.find(c => c.name.common == country.country);
                    if (matchedCountry) { // checks if there is a match
                        let borderNames = (matchedCountry.borders || []).map(countryCode => { // incase object has no borders key
                            let borderCountry = countriesAll.find(c => c.cca3 == countryCode);
                            return borderCountry.name.common;
                        });

                        if (borderNames.length === 0) {
                            borderNames.push("None"); // response for no borders
                        }

                        console.log(borderNames);
                        // create the output string for matched countries
                        outputString = `
                            <div>
                                <p>Country: ${country.country}</p>
                                <p>&nbsp;Cities: ${country.cities.join(", ")}</p>
                                <p>&nbsp;&nbsp;Neighbors: ${borderNames.join(", ")}</p>
                            </div>
                            <br>`;
                        divOutput.innerHTML += outputString;
                    } else {
                        // create the output string if no match found
                        outputString = `
                            <div>
                                <p>Country: ${country.country}</p>
                                <p>&nbsp;Cities: ${country.cities.join(", ")}</p>
                                <p>&nbsp;&nbsp;Country not Found in Web Data!</p>
                            </div>
                            <br>`;
                        divOutput.innerHTML += outputString;
                    }
                });
            })
        .catch(err => divOutput.innerHTML = err);

    console.log(countries);
    console.log(countriesAll);
});