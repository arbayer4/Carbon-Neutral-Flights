//Adding Listening event to form

const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let dep = document.querySelector('#departure')
  let depCaps = dep.value.toUpperCase()
  dep.value = ''
  let arr = document.querySelector('#arrival')
  let arrCaps = arr.value.toUpperCase()
  arr.value = ``
  let box = document.querySelector('#roundtrip')
  let rt = box.checked
  box.checked = false
  if (!depCaps || !arrCaps) {
    removeData()
    appendErrorData()
  } else {
    removeData()
    loadingCircle()
    getCarbonData(depCaps, arrCaps, rt)
    takeOff()
  }
})



async function getCarbonData(dep, dest, rt) {
  let oneWay = `&segments[0][origin]=${dep}&segments[0][destination]=${dest}`
  let roundTrip = ``
  if (rt) {
    roundTrip += `&segments[1][origin]=${dest}&segments[1][destination]=${dep}`
  }

  let cabinCurrency = `&cabin_class=economy&currencies[]=USD`
  var config = {
    method: 'get',
    url: `https://cors-anywhere.herokuapp.com/https://api.goclimate.com/v1/flight_footprint?user=0a03f81a6b2ac87829e10c4a` + oneWay + roundTrip + cabinCurrency,
    headers: {
      'Authorization': 'Basic MGEwM2Y4MWE2YjJhYzg3ODI5ZTEwYzRhOg==',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    }
  }
  try {
    let response = await axios(config)
    let footprint = response.data.footprint
    let cost = response.data.offset_prices[0].amount
    cost = (cost / 100).toFixed(2)
    let buyOffset = response.data.offset_prices[0].offset_url
    removeLoadingCircle()
    appendCarbonData(footprint, cost, buyOffset)
  } catch (error) {
    removeLoadingCircle()
    appendErrorData()
    console.error(error);
  }
}

function appendCarbonData(weight, cost, url) {
  let pollutionInfo = `
  <h3>Carbon Footprint: ${weight}kg</h3>
  <h3>Offset Cost: $${cost}</h3>
  <a href="${url}" target="_blank">Buy Offset Now!</a>
  `
  let dataContainer = document.querySelector('#carbon-data')

  dataContainer.insertAdjacentHTML('beforeend', pollutionInfo)
}
function removeData() {
  let parent = document.querySelector('#carbon-data')
  while (parent.firstElementChild) {
    parent.removeChild(parent.firstElementChild)

  }
  return
}
function appendErrorData() {
  let errorInfo = `
  <h3>Error, Airport Codes Not Found</h3>
  <p>Please visit<a id = "error-a" href="https://www.iata.org/en/publications/directories/code-search/" target="_blank">IATA</a>website to find your
  cities code. </p>
  `
  let dataContainer = document.querySelector('#carbon-data')
  dataContainer.insertAdjacentHTML('beforeend', errorInfo)

}
//Below is a click event to make dropdown menu when the hamburger
//menu is shown on smaller screens. I learned it from:
//https://www.w3schools.com/howto/howto_js_topnav_responsive.asp
const menu = document.querySelector(".icon")
menu.addEventListener('click', (e) => {
  e.preventDefault();
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }

})
//Loading circle code from https://dev.to/vaishnavme/displaying-loading-animation-on-fetch-api-calls-1e5m
function loadingCircle() {
  const loading = document.querySelector("#loading-circle");
  loading.classList.add("display");
  setTimeout(() => {
    loading.classList.remove("display");
  }, 15000);
}
function removeLoadingCircle() {
  const loading = document.querySelector("#loading-circle");
  loading.classList.remove("display")
}

//Function to make my plane take off. I use the getBoundingClientRect to get
//the plane coordinates so that the plane movement can be responsive based on
//screen size. 
function takeOff() {
  let plane = document.querySelector('#plane');
  let domRect = plane.getBoundingClientRect()
  let bound = window.innerWidth - domRect.left
  let start = Date.now();
  let left = 0
  let top = 0
  let resetLeft = -domRect.right
  let resetTop = -50
  let x = 0
  let xReset = 0
  let timer = setInterval(() => {

    let timePassed = Date.now() - start;
    if (timePassed >= 8000 || resetLeft >= 0) {
      clearInterval(timer);
      plane.style.left = `0px`
      plane.style.top = `0px`
      return;
    } else if (left > bound) {
      plane.style.left = `${resetLeft += 4}px`
      if (resetTop < 0) {
        plane.style.top = `${resetTop += 1.5 * x ** 2}px`
      } else {
        plane.style.top = `0px`
      }
      xReset++
    } else {
      plane.style.left = `${left += 4}px`
      if (left > 200) {
        plane.style.top = `${top -= (3 / 4) * x ** 2}px`

      }
    }

  }, 20)
  x++;
}



