# Project Overview

## The Carbon Neutral Traveler

https://arbayer4.github.io/Carbon-Neutral-Flights/

## Project Description
This application will be a flight travel companion for environmentally concious travelers. The user will be 
able to enter their trip details (departure, arrival airports, roundtrip, etc) and the app will display the
carbon footprint implications of this flight and a cost to buy offsets for the pollution - with a link that 
the user can immediately take to buy the carbon offsets.

## API and Data Sample

```json
{
    "footprint": 600,
    "offset_prices": [
        {
            "amount": 2400,
            "currency": "SEK",
            "offset_url": "https://www.goclimate.com/se/flight_offsets/new?offset_params=economy%2CIND%2CSFO",
            "locale": "sv-SE"
        },
        {
            "amount": 290,
            "currency": "USD",
            "offset_url": "https://www.goclimate.com/us/flight_offsets/new?offset_params=economy%2CIND%2CSFO",
            "locale": "en-US"
        }
    ],
    "details_url": "https://www.goclimate.com/se/flight_offsets/new?offset_params=economy%2CIND%2CSFO"
}
```

## Wireframes

View [Wireframe Mock-Up](https://wireframe.cc/IM9yaq).

### MVP/PostMVP

#### MVP 
- Departure and arrival search box for User.
- Checkbox if flight is roundtrip
- Utilize third-party API to pull carbon footprint data from flight.
- Render carbon footprint data to page, including price of the carbon offset, and link to purchase offsets
- Include graphic of air-travel environmental impacts.

#### PostMVP  
- Add second API that could add useful travel information about the destination city. 
- CSS/Javascript Animation-maybe showing airplane taking off and landing when user submits. Another
  animation could be a random number generator for bringing up the price of the offset.

## Project Schedule

|  Day | Deliverable | Status
|---|---| ---|
|Jan 25-26| Prompt / Wireframes / Priority Matrix / Timeframes | Complete
|Jan 26| Project Approval | Complete
|Jan 27| Core Application Structure (HTML, CSS, etc.) | Complete
|Jan 28| Initial Clickable Model  | Complete
|Jan 29| MVP | Complete
|Feb 1| Presentations/Project Submission | Incomplete

## Priority Matrix
![priority_matrix](./priority_matrix.png)



## Timeframes


| Component | Priority | Estimated Time | Time Invested | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| Basic HTML Setup | H | 2hr| 1hr |1hr |
| API Endpoint exploration | H |3hrs |3.5hrs|3.5hrs  |
|PseudoCode Javascript Functions|M|1.5hrs|30min|30min|
|Initial CSS Styling|H|2hrs|1hr|1hr|
|JS Code to Access API and Add Dynamic Results|H|3hrs|2hrs|2hrs|
|Flexbox|H|3hrs|3hrs|3hrs|
|CSS Polishing-Fonts, Colors, Etc|M|4hrs|12hrs|12hrs|
|Media Query Dynamic Content|M|3hrs|2hrs|2hrs|
|JS/CSS Animation|L|4hrs|3hrs|3hrs|
|Testing, Bug Fixing Etc|M|2hrs|2hrs|2hrs|
|Second API Call|L|4hrs|3hrs|3hrs|
| Total | H | 31.5hrs| 33hrs | 33hrs |

## Code Snippet

I was pround of this JS Animation function. I use getBoundingCLientRect() to get the
plane image coordinates in relation to the page so that I could write my movement 
function to be dynamic based on size of the screen. 
```
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


```

## Change Log
  
