
// DOM Elements
const temperature = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const moistureEl = document.getElementById('moisture');
const lightEl = document.getElementById('light');
const connectionStatusEl = document.getElementById('connection-status');
const statusDotEl = document.getElementById('status-dot');




const fanToggle = document.getElementById('fan-toggle');
const pumpToggle = document.getElementById('pump-toggle');
const lightToggle = document.getElementById('light-toggle');
const shadeToggle = document.getElementById('shade-toggle');



const getdata= fetch('http://localhost:8000/api/latest')
.then(response => response.json())
.then(data => {
  console.log(data)
    // Update the UI with the fetched data
    temperature.textContent = `${data.temp} °C`;
    humidityEl.textContent = `${data.humidity} %`;
    moistureEl.textContent = `${data.soil_moisture} %`;
    lightEl.textContent = `${data.light_intensity} lux`;

    // Update connection status
    connectionStatusEl.textContent = 'Connected';
    statusDotEl.style.backgroundColor = 'green';
})


const updateTemp=()=>{
  if(temperature>29.9){

  }
}