//Adding Listening event to form
//

//Select form, add event listener on submission that will pull text and use
//it to access API
const form = document.querySelector('form')
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let dep = document.querySelector('#departure')
  let depCaps = dep.value.toUpperCase()//Allows user to enter lower or uppercase IATA code
  dep.value = '' //Clear form
  let arr = document.querySelector('#arrival')
  let arrCaps = arr.value.toUpperCase()//Allows user to enter lower or uppercase IATA code
  arr.value = ``//clear form
  let box = document.querySelector('#roundtrip')
  let rt = box.checked
  box.checked = false //clear checkbox
  if (!depCaps || !arrCaps) {
    //If user doesnt enter anything, just immediately give error rather than making API
    //call
    removeData()
    appendErrorData()
  } else {
    //If text was entered, remove any previous response, invoke loading circle, 
    //use text for GetCarbonData() function, and invoke JS animation of airplane takeoff.
    removeData()
    loadingCircle()
    getCarbonData(depCaps, arrCaps, rt)
    takeOff()
  }
})


//getCarbonData takes user text and attempts a get request to the API for carbon
//footprint data of flight path. 
async function getCarbonData(dep, dest, rt) {
  let oneWay = `&segments[0][origin]=${dep}&segments[0][destination]=${dest}`
  let roundTrip = ``
  //If roundtrip checked, add another segment
  if (rt) {
    roundTrip += `&segments[1][origin]=${dest}&segments[1][destination]=${dep}`
  }
  //Currently only showing results in USD, could add functionality to allow other currencies.
  let cabinCurrency = `&cabin_class=economy&currencies[]=USD`
  //Required get configuration to get data from API
  var config = {
    method: 'get',
    url: `https://cors-anywhere.herokuapp.com/https://api.goclimate.com/v1/flight_footprint?user=0a03f81a6b2ac87829e10c4a` + oneWay + roundTrip + cabinCurrency,
    headers: {
      'Authorization': 'Basic MGEwM2Y4MWE2YjJhYzg3ODI5ZTEwYzRhOg==',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    }
  }
  //Accessing API data
  try {
    let response = await axios(config)
    let footprint = response.data.footprint
    let cost = response.data.offset_prices[0].amount
    cost = (cost / 100).toFixed(2)//Gives price in cents, changing to dollars
    let buyOffset = response.data.offset_prices[0].offset_url
    removeLoadingCircle()//Once the API data is available, end loading circle.
    appendCarbonData(footprint, cost, buyOffset)//Function to put flight data on screen.
  } catch (error) {
    //Self explanatory error catch. Remove load, tell user to check IATA codes. Actual Error
    //message available in console. 
    removeLoadingCircle()
    appendErrorData()
    console.error(error);
  }
}
//appendCarbonData takes the API data and creates HTML content to render to screen. 
function appendCarbonData(weight, cost, url) {
  let pollutionInfo = `
  <h3>Carbon Footprint: ${weight}kg</h3>
  <h3>Offset Cost: $${cost}</h3>
  <a href="${url}" target="_blank">Buy Offset Now!</a>
  `
  let dataContainer = document.querySelector('#carbon-data')

  dataContainer.insertAdjacentHTML('beforeend', pollutionInfo)
}
//removeData clears old data from screen when user makes a new request. 
function removeData() {
  let parent = document.querySelector('#carbon-data')
  while (parent.firstElementChild) {
    parent.removeChild(parent.firstElementChild)

  }
  return
}
//appendErrorData simply puts HTML on page to let tell user to check IATA codes are correct.
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
//Remove loading circle
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
  let bound = window.innerWidth - domRect.left //This is the distance from where the plane starts to the right side of window. Used to change animation once plane exits screen to right. 
  let start = Date.now();//For intitial time
  let left = 0 //Since planes postion is relative, start at 
  let top = 0
  let resetLeft = -domRect.right //Where plane will start on return to screen.
  let resetTop = -50 //Where plane will start on return to screen.
  if (window.innerWidth < 500) { //For smaller screens, plane will land more smoothly.
    resetTop = -25;
  }
  let x = 0 //Counter and position incrementer. 
  let xReset = 0 //For return flight position incrementer. 
  //This causes the plane to change postion every 20 milliseconds to appear to make a smooth
  //flight takeoff and landing. 
  let timer = setInterval(() => {

    let timePassed = Date.now() - start; //Keep track of total time passed
    //If 8 seconds have passed or plane is back in postion, reset interval and restore
    //original position. 
    if (timePassed >= 8000 || resetLeft >= 0) {
      clearInterval(timer);
      plane.style.left = `0px`
      plane.style.top = `0px`
      return;
    } else if (left >= bound) { //If plane has exited the right of the screen-start descent from the left. 
      plane.style.left = `${resetLeft += 4}px`
      if (resetTop < 0) {
        plane.style.top = `${resetTop += 1.5 * x ** 2}px`
      } else {
        plane.style.top = `0px`
      }
      xReset++
    } else { //Original takeoff segment. 
      plane.style.left = `${left += 4}px` //Plane starts with just horizontal movement.
      if (left > (window.innerWidth / 4)) { //Once it moves 1/4 of the screen horizontally, start an upward path following an exponential curve.
        plane.style.top = `${top -= (3 / 4) * x ** 2}px` //Exponential curve flattened slightly to make it look more realistic. 

      }
    }

  }, 20)
  x++;
}



