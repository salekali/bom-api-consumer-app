const express = require('express');
const axios = require('axios');

const app = express();
var endpoint = "http://www.bom.gov.au/fwo/IDN60801/IDN60801.95765.json";

app.listen(process.env.PORT || 8080); // listening on port 8080


app.get("/", (req, res) => {

	getData( endpoint, res )
	.then( res => mapData( res ))
	.then( res => filterData( res ) )
	.then( filteredData => res.json( { "data" : filteredData } ))
	.catch( error => console.log(error) )

});


// retrieving data from the endpoint

async function getData(url, res=null) { 
    return await axios.get(url)
    .then( response => response.data ) 
	.catch( error => !res? error.message : res.json( {'error': error.message } ) ) //error response
};


// mapping data to only the fields requested in the brief

function mapData(data){
	try{
		return data.observations.data.map( x => newx = {
			name: x.name,
			apparent_t: x.apparent_t,
			lat: x.lat,
			long: x.lon
		})
	}
	catch (error) {
		console.log(error)
	}
}


// filtering data to only display results where the temperature >= 18, in ascending order of temperature 
// (there weren't any datapoints above 20)

function filterData(data){
	try{
		console.log( data.length )
		var filteredData = data.filter( item => item.apparent_t >= 18 ).sort( (a,b) => a.apparent_t - b.apparent_t ) 
		console.log(filteredData.length)
		return filteredData
	}
	catch(error) {
		console.log(error)
	}
}


module.exports = { getData, mapData, filterData }