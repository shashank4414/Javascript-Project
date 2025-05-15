//let countryURL = "json/country.json";
//let countryURL = "json/countryNoNeighbours.json";
let countryURL = "json/countryBonus.json";
//let countryURL = "json/countryNoData.json";

let countrydetailsURL = "https://restcountries.com/v3.1/all";
let country = [];        

// Load and sort country.json data
$.getJSON(countryURL, function(data){
    country = data.sort((a,b)=>{
        if (a.country>b.country) return -1;
        else if (a.country<b.country) return 1;
        else return 0;
    });  
    }
);

// Load Web data using Async Fetch/Promice 
async function fetchdata(sourceURL){
    let response = await fetch(sourceURL);
    if (response.ok != true){
        throw new Error(response.statusText);
    }
    return await response.json();
}

// Determine if border key exists within element
haveNeighbours = function(element,keyname){
    for (let k of Object.keys(element)){
        if (k==keyname){ return true; }
    }
    return false;

};
// Button Event Listener
document.getElementById("btnDisplay").addEventListener("click", function(){
    let divOutput = document.getElementById("output");
    let outputString = "";
    // Fetch web data when country JSON contains data
    if (country.length>0){
        fetchdata(countrydetailsURL)
        .then(
            data=>{
                let countryFound=[];
                country.forEach(c=>{ // Loop through country json data 
                    outputString+=`<br>Country:${c.country}<br>&nbspCities: ${c.city==undefined?"None":c.city}<br>`;
                    data.forEach(CD=>{ // Loop through Web Data
                        if (CD.name.common == c.country){ // Matching Country json with web data
                            countryFound.push(CD);
                            if (haveNeighbours(CD,"borders")) // If country has neighbours then get neighbour country common name and display them
                                { outputString+= `&nbsp&nbspNeighbours:${CD.borders.map(cb=>data.filter(ct=>ct.cca3==cb).pop().name.common)}<br>`; }
                            else { outputString+="&nbsp&nbspNeighbours: None <br>";}
                        }
                    });  
                    if (countryFound.length == 0){ // Display message when a match is not found
                        outputString+="&nbsp&nbspCountry Not Found in Web Data! <br>";
                    }
                    else{ countryFound = []; // Reset found array when match was found
                    }
                    divOutput.innerHTML = outputString;
                })
            }         
            )
        .catch(err=>divOutput.innerHTML = err)
    }
    else{ // Display message when no data is found in Country json
        divOutput.innerHTML = "<br>&nbsp&nbspNo Country Data is Available to View"
    }


});