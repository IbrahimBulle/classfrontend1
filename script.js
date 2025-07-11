const connectionStatus = document.querySelector('.connection-status')
const statusDot = document.querySelector('.status-dot ')
const socket = io('https://classbackend-62k7.onrender.com/', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

// Once connected, listen for incoming data
socket.on("connect", () => {
    console.log("Connected to server");
     connectionStatus.textContent = 'Connected';  
    statusDot.classList.remove('disconnected');  
    statusDot.classList.add('connected'); 
});

// Handle incoming sensor data
socket.on("lastReading", (data) => {
    console.log("Received data: ", data);

    // Update sensor readings in the UI
    document.getElementById('temperature').textContent = `${data.temp} °C`;
    document.getElementById('humidity').textContent = `${data.humidity} %`;
    document.getElementById('moisture').textContent = `${data.soil_moisture} %`;
    document.getElementById('light').textContent = `${data.light_intensity} lux`;

    // Call to update actuator state based on received data
    handleActuators(data);
});

// DOM elements for actuators
const fanToggle = document.getElementById('fan-toggle');
const pumpToggle = document.getElementById('pump-toggle');
const lightToggle = document.getElementById('light-toggle');
const shadeToggle = document.getElementById('shade-toggle');

const fanStatus = document.getElementById('fan-status');
const pumpStatus = document.getElementById('pump-status');
const lightStatus = document.getElementById('light-status');
const shadeStatus = document.getElementById('shade-status');

// Flags to track manual override
let manualControl = {
    fan: false,
    pump: false,
    light: false,
    shade: false
};

// Handle actuator control based on sensor data
function handleActuators(data) {
    // Fan control (turn on if temperature > 28°C)
    if (!manualControl.fan) {
        if (parseFloat(data.temp) > 28 && !fanToggle.checked) {
            fanToggle.checked = true;
            fanStatus.textContent = 'ON';
            fanStatus.style.color = 'green';
        } else if (parseFloat(data.temp) <= 28 && fanToggle.checked) {
            fanToggle.checked = false;
            fanStatus.textContent = 'OFF';
            fanStatus.style.color = 'red';
        }
    }

    // Pump control (turn on if soil moisture < 35%)
    if (!manualControl.pump) {
        if (parseFloat(data.soil_moisture) < 35 && !pumpToggle.checked) {
            pumpToggle.checked = true;
            pumpStatus.textContent = 'ON';
            pumpStatus.style.color = 'green';
        } else if (parseFloat(data.soil_moisture) >= 35 && pumpToggle.checked) {
            pumpToggle.checked = false;
            pumpStatus.textContent = 'OFF';
            pumpStatus.style.color = 'red';
        }
    }

    // Grow Light control (turn on if light intensity < 300 lux)
    if (!manualControl.light) {
        if (parseFloat(data.light_intensity) < 300 && !lightToggle.checked) {
            lightToggle.checked = true;
            lightStatus.textContent = 'ON';
            lightStatus.style.color = 'green';
        } else if (parseFloat(data.light_intensity) >= 300 && lightToggle.checked) {
            lightToggle.checked = false;
            lightStatus.textContent = 'OFF';
            lightStatus.style.color = 'red';
        }
    }

    // Shade Net control (turn on if light intensity > 1800 lux)
    if (!manualControl.shade) {
        if (parseFloat(data.light_intensity) > 1800 && !shadeToggle.checked) {
            shadeToggle.checked = true;
            shadeStatus.textContent = 'ON';
            shadeStatus.style.color = 'green';
        } else if (parseFloat(data.light_intensity) <= 1800 && shadeToggle.checked) {
            shadeToggle.checked = false;
            shadeStatus.textContent = 'OFF';
            shadeStatus.style.color = 'red';
        }
    }
}

// Send actuator state changes to the backend when manually toggled
function sendActuatorCommand(actuator, state) {
    socket.emit('setActuatorState', { actuator, state });
}

// Event listeners for manual toggle switches
fanToggle.addEventListener('change', () => {
    const state = fanToggle.checked ? 'ON' : 'OFF';
    fanStatus.textContent = state;
    fanStatus.style.color = state === 'ON' ? 'green' : 'red';
    manualControl.fan = fanToggle.checked;
    sendActuatorCommand('fan', state);
});

pumpToggle.addEventListener('change', () => {
    const state = pumpToggle.checked ? 'ON' : 'OFF';
    pumpStatus.textContent = state;
    pumpStatus.style.color = state === 'ON' ? 'green' : 'red';
    manualControl.pump = pumpToggle.checked;
    sendActuatorCommand('pump', state);
});

lightToggle.addEventListener('change', () => {
    const state = lightToggle.checked ? 'ON' : 'OFF';
    lightStatus.textContent = state;
    lightStatus.style.color = state === 'ON' ? 'green' : 'red';
    manualControl.light = lightToggle.checked;
    sendActuatorCommand('light', state);
});

shadeToggle.addEventListener('change', () => {
    const state = shadeToggle.checked ? 'ON' : 'OFF';
    shadeStatus.textContent = state;
    shadeStatus.style.color = state === 'ON' ? 'green' : 'red';
    manualControl.shade = shadeToggle.checked;
    sendActuatorCommand('shade', state);
});

// Fetch sensor data from backend periodically (for initial state and periodic updates)
function updateAll() {
    fetch('https://classbackend-62k7.onrender.com/api/latest')
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').textContent = `${data.temp} °C`;
            document.getElementById('humidity').textContent = `${data.humidity} %`;
            document.getElementById('moisture').textContent = `${data.soil_moisture} %`;
            document.getElementById('light').textContent = `${data.light_intensity} lux`;

            // Update actuator control based on sensor readings
            // handleActuators(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Periodically fetch and update sensor data
setInterval(updateAll, 10000);  // Update every 10 seconds
document.addEventListener('DOMContentLoaded', updateAll);
