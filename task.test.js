const { getData, mapData, filterData } = require('./index.js')

test('should get data from bom endpoint correctly', async () => {
    const url = "http://www.bom.gov.au/fwo/IDN60801/IDN60801.95765.json";
    const response = await getData(url) 
    expect(response.observations.data[0].name).toBe("Sydney Olympic Park");
})

test('should throw 404 error for incorrect endpoint', async () => {
    const url = "http://www.bom.gov.au/fwo/IDN60801/IDN60801.95765x.json";
    const response = await getData(url)
    expect(response).toBe("Request failed with status code 404");
})

test('should only map datapoints to required fields', async () => {
    const url = "http://www.bom.gov.au/fwo/IDN60801/IDN60801.95765.json";
    const response = await getData(url).then( res => mapData( res ));
    var keys = Object.keys(response[0]).sort();
    expect(keys).toStrictEqual(["apparent_t", "lat", "long", "name"]);
})

test('should pass integration test for getData, mapData and filterData', async () => {
    const url = "http://www.bom.gov.au/fwo/IDN60801/IDN60801.95765.json";
    const response = await getData(url).then( res => mapData( res )).then( res => filterData( res ));
    expect(response[0]).toHaveProperty("apparent_t", "lat", "long", "name")
    expect(response[0].apparent_t).toBeGreaterThanOrEqual(18);
})