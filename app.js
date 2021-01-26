//Adding Listening event to form

const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let dep = document.querySelector('#departure').value
  // console.log(dep)
  let arr = document.querySelector('#arrival').value
  // console.log(arr)
  let rt = document.querySelector('#roundtrip').checked
  // console.log(rt)
  getCarbonData(dep, arr, rt)

})


// API Setup
// let dep = 'LAX'
// let dest = 'BCN'
// let oneWay = `&segments[0][origin]=${dep}&segments[0][destination]=${dest}`
// let roundTrip = `&segments[1][origin]=${dest}&segments[1][destination]=${dep}`
// let cabinCurrency = `&cabin_class=economy&currencies[]=USD`
// var config = {
//   method: 'get',
//   url: `https://cors-anywhere.herokuapp.com/https://api.goclimate.com/v1/flight_footprint?user=0a03f81a6b2ac87829e10c4a` + oneWay + roundTrip + cabinCurrency,
//   headers: {
//     'Authorization': 'Basic MGEwM2Y4MWE2YjJhYzg3ODI5ZTEwYzRhOg==',
//     'Content-Type': 'application/x-www-form-urlencoded'

//   }
// };

// axios(config)
// .then(function (response) {
//   console.log(response);
// })
// .catch(function (error) {
//   console.log(error);
// });

// let allURL = 'https://cors-anywhere.herokuapp.com/https://api.goclimate.com/v1/flight_footprint?user=0a03f81a6b2ac87829e10c4a&segments[0][origin]=IND&segments[0][destination]=BCN&segments[1][origin]=BCN&segments[1][destination]=IND&cabin_class=economy&currencies[]=SEK&currencies[]=USD'

async function getCarbonData(dep, dest, rt) {
  let oneWay = `&segments[0][origin]=${dep}&segments[0][destination]=${dest}`
  let roundTrip= ``
  if (rt) {
    roundTrip += `&segments[1][origin]=${dest}&segments[1][destination]=${dep}`  
  }
  
  let cabinCurrency = `&cabin_class=economy&currencies[]=USD`
  var config = {
    method: 'get',
    url: `https://cors-anywhere.herokuapp.com/https://api.goclimate.com/v1/flight_footprint?user=0a03f81a6b2ac87829e10c4a` + oneWay + roundTrip + cabinCurrency,
    headers: {
      'Authorization': 'Basic MGEwM2Y4MWE2YjJhYzg3ODI5ZTEwYzRhOg==',
      'Content-Type': 'application/x-www-form-urlencoded'

    }
  };
  try {
    let response = await axios(config)
    console.log(response.data)
    let footprint = response.data.footprint
    console.log(footprint)
    let cost = response.data.offset_prices[0].amount
    cost = (cost/100).toFixed(2)
    console.log(cost)
    let buyOffset = response.data.offset_prices[0].offset_url
    console.log(buyOffset)
    appendCarbonData(footprint, cost, buyOffset)
  } catch (error) {
    console.error(error);
  }
}

function appendCarbonData(weight, cost, url) {
  let pollutionInfo = `
  <h3>Carbon Footprint: ${weight}kg</h3>
  <h3>Offset Cost: $${cost}</h3>
  <a href="${url}">Buy Offset Now!</a>
  `
  let dataContainer = document.querySelector('#carbon-data')

  dataContainer.insertAdjacentHTML('beforeend', pollutionInfo)
}





// 'Cookie': '__cfduid=d900671592eb2b7118d24f2463ea3e3731611330636; experiments=remove_signup_without_subscription%3D1; _go_climate_session=5tXyROV6x%2F7df0FiaGBRF9MpvHyA8AYqbk5FKHODRnMwtTGa55wplGTFa%2FqYlFGbc0mGyjUDf91PA4BZ8sDtF%2BjWEOcRFT42EE0S1yRz9vg6syxXxGNmb27wwxuYmbjUvsmmGIlWzxDtabuXKApHTChywsE2A3zX0eIQp5F2MAYDa63tnnqJWvzYDtJ7tYqm87L1eew%2BUdzuRC4XQNdi93xwbl9dblB6hL5BNmDB2xxofTg0Gu0Q%2Bawhu5jJmds9gfj4nz09hM%2BfI90pjMGtxj3zzecpbOMuuyds--S%2Br1M4YxMyVq%2BcDh--CXllPzoJDAx%2FyhTj2khx%2Fw%3D%3D'