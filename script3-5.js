// Sample driver data for demonstration
const drivers = [
    { id: 1, name: 'Driver 1', truck: 'Truck A', location: 'City A' },
    { id: 2, name: 'Driver 2', truck: 'Truck B', location: 'City B' },
    { id: 3, name: 'Driver 3', truck: 'Truck C', location: 'City C' },
];

// Function to display driver information
function displayDrivers() {
    const driversList = document.getElementById('drivers');
    driversList.innerHTML = '';

    drivers.forEach(driver => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Name:</strong> ${driver.name}<br>
            <strong>Truck:</strong> ${driver.truck}<br>
            <strong>Location:</strong> ${driver.location}
        `;
        driversList.appendChild(listItem);
    });
}

// Initialize the driver list
displayDrivers();
