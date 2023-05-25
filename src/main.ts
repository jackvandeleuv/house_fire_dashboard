import * as L from 'leaflet';

// Initialize your map as before
const map = L.map('map', {preferCanvas: true, fadeAnimation: false}).setView([37.8, -96], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

const menu = document.getElementById('menu');
const menuTitle = document.getElementById('menu-title');
const menuCards = document.getElementById('menu-cards');

function generateCardHTML(title: string, value: string) {
    return `
        <div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white my-3">
            <div class="px-6 py-4">
                <div class="font-semibold text-lg mb-2 text-gray-700">${title}</div>
                <p class="text-gray-600 text-base">${value}</p>
            </div>
        </div>
    `;
}

const decimals = 5;

function handleValue(value: any) {
    if (typeof value === 'number') {
        // Round the number to two decimal places if it's a number
        return value.toFixed(decimals);
    } else {
        // If not a number, return the value as it is
        return value;
    }
}

// Fetch data and add it to the map
fetch('../dashboard/dashboard.json')
    .then(response => response.json())
    .then(data => {
        for (let item of data) {
            let avgScoreMultifamily: string = item.AVG_SCORE_MULTIFAMILY?.toFixed(1)?.toString() ?? 'N/A';
            let avgScorePublic: string = item.AVG_SCORE_PUBLIC?.toFixed(1)?.toString() ?? 'N/A';
            
            const marker = L.circleMarker([item.LATITUDE, item.LONGITUDE], {
                radius: Math.pow(item.POPULATION, 1/6),
                fillColor: "#FF2E00",
                color: "#000",
                weight: 1,
                opacity: .5,
                fillOpacity: .5,
            }).addTo(map);

            marker.bindPopup(`
                <b>${item.CITY}, ${item.STATE}</b>
                <br>
                Average Inspection Score (Multifamily): ${avgScoreMultifamily}
                <br>
                Average Inspection Score (Public): ${avgScorePublic}
                <br>
                Average Fatalities (per fire): ${handleValue(item.AVG_FATALITIES)}
                <br>
                Total Reported Fires (per capita): ${handleValue(item.TOTAL_INCIDENT_COUNT_ADJ)}
            `);

            marker.on('mouseover', function () {
                marker.openPopup();
            });
            marker.on('mouseout', function () {
                marker.closePopup();
            });

            const sidebarMenuTitle = `
                <span class="text-2xl font-extrabold">${item.CITY}, ${item.STATE}</span>
                <br>
                <span class="text-gray-500 text-lg">2013-2019</span>
            `;
        
            const dollar_formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              });
                      
            const sidebarMenuCards = [
                generateCardHTML("Average Multifamily Inspection Score", avgScoreMultifamily),
                generateCardHTML("Average Public Inspection Score", avgScorePublic),
                generateCardHTML("Average Additional Buildings Ignited (per fire)", item.AVG_SPREAD.toFixed(decimals)),
                generateCardHTML("Average Fatalities (per fire)", item.AVG_FATALITIES.toFixed(decimals)),
                generateCardHTML("Average Injuries (per fire)", item.AVG_INJURIES.toFixed(decimals)),
                generateCardHTML("Average Value of Property Lost (per fire)", dollar_formatter.format(item.AVG_MONEY_LOST)),
                generateCardHTML("Average Alarms Triggered (per fire)", item.AVG_ALARMS.toFixed(decimals)),
                generateCardHTML("Total Reported Fires (per capita)", handleValue(item.TOTAL_INCIDENT_COUNT_ADJ)),
                generateCardHTML("Reported Cooking Fires (per capita)", handleValue(item.COUNT_113_ADJ)),
                generateCardHTML("Reported Passenger Vehicle Fires (per capita)", handleValue(item.COUNT_131_ADJ)),
                generateCardHTML("Reported Outside Trash/Rubbish/Waste Fires (per capita)", handleValue(item.COUNT_151_ADJ)),
                generateCardHTML("Reported Brush/Grass Fires (per capita)", handleValue(item.COUNT_142_ADJ)),
                generateCardHTML("Population", item.POPULATION),
                generateCardHTML("Total Fires Reported to NFIRS", item.SUPPORT)
              ].join('');
              
            
            marker.on('click', function () {
                menu!.style.display = 'block';
                menuTitle!.innerHTML = sidebarMenuTitle
                menuCards!.innerHTML = sidebarMenuCards;
            });
        }
    });
