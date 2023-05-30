import * as L from 'leaflet';

// Short and long decimals to round numbers to.
const S_DECIMALS = 1
const L_DECIMALS = 4

interface City {
    CITYSTATE: string;
    LATITUDE: number;
    LONGITUDE: number;
    AVG_SCORE_MULTIFAMILY: number;
    AVG_SCORE_PUBLIC: number;
    AVG_SPREAD: number;
    AVG_MONEY_LOST: number;
    AVG_FATALITIES: number;
    AVG_INJURIES: number;
    AVG_ALARMS: number;
    SUPPORT: number;
    SUMLEV: number;
    STATE: string;
    COUNTY: number;
    PLACE: number;
    COUSUB: number;
    CONCIT: number;
    PRIMGEO_FLAG: number;
    FUNCSTAT: string;
    NAME: string;
    STNAME: string;
    POPULATION: number;
    POPESTIMATE2020: number;
    POPESTIMATE2021: number;
    TYPE: string;
    COUNT_111_ADJ: number;
    COUNT_113_ADJ: number;
    COUNT_131_ADJ: number;
    COUNT_151_ADJ: number;
    COUNT_142_ADJ: number;
    TOTAL_INCIDENT_COUNT_ADJ: number;
    CITY: string;
  }

function renderMap(): L.Map {
    // Initialize the map
    const map = L
        .map('map', {preferCanvas: true, fadeAnimation: false})
        .setView([37.8, -96], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);
    return map;
}

function generateCardHTML(title: string, value: string) {
    return `
        <div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white my-3">
            <div class="px-6 py-4">
                <div class="font-semibold text-lg mb-2 text-gray-700">${title}</div>
                <p class="text-gray-600 text-base">${value}</p>
            </div>
        </div>`;
}

function generateCitySummary(city: City): string {
    return [
        generateCardHTML("Average Multifamily Inspection Score", formatNumbers(city.AVG_SCORE_MULTIFAMILY, S_DECIMALS)),
        generateCardHTML("Average Public Inspection Score", formatNumbers(city.AVG_SCORE_PUBLIC, S_DECIMALS)),
        generateCardHTML("Average Buildings/Vehicles/Entities Ignited (per fire)", formatNumbers(city.AVG_SPREAD, L_DECIMALS)),
        generateCardHTML("Average Fatalities (per fire)", formatNumbers(city.AVG_FATALITIES, L_DECIMALS)),
        generateCardHTML("Average Injuries (per fire)", formatNumbers(city.AVG_INJURIES, L_DECIMALS)),
        generateCardHTML("Average Value of Property Lost (per fire)", dollar_formatter.format(city.AVG_MONEY_LOST)),
        generateCardHTML("Average Alarms Triggered (per fire)", formatNumbers(city.AVG_ALARMS, L_DECIMALS)),
        generateCardHTML("Total Reported Fires (per capita)", formatNumbers(city.TOTAL_INCIDENT_COUNT_ADJ, L_DECIMALS)),
        generateCardHTML("Reported Cooking Fires (per capita)", formatNumbers(city.COUNT_113_ADJ, L_DECIMALS)),
        generateCardHTML("Reported Passenger Vehicle Fires (per capita)", formatNumbers(city.COUNT_131_ADJ, L_DECIMALS)),
        generateCardHTML("Reported Outside Trash/Rubbish/Waste Fires (per capita)", formatNumbers(city.COUNT_151_ADJ, L_DECIMALS)),
        generateCardHTML("Reported Brush/Grass Fires (per capita)", formatNumbers(city.COUNT_142_ADJ, L_DECIMALS)),
        generateCardHTML("Population", city.POPULATION.toString()),
        generateCardHTML("Total Fires Reported to NFIRS", city.SUPPORT.toString())
    ].join('');
}

function formatNumbers(value: string | number, round_to: number): string {
    if (value == null) return 'N/A';
    if (typeof value === 'number') return value.toFixed(round_to).toString();
    return value;
}

const dollar_formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

function renderPage(): void {
    const map: L.Map = renderMap();

    fetch('./dashboard/dashboard.json')
    .then(response => response.json())
    .then((data: City[]) => {
        for (let city of data) {           
            const marker = L.circleMarker([city.LATITUDE, city.LONGITUDE], {
                radius: Math.pow(city.POPULATION, 1/(3.5)) / 4,
                fillColor: "#FF2E00",
                color: "#000",
                weight: 1,
                opacity: .35,
                fillOpacity: .35,
            }).addTo(map);

            const sidebarMenuTitle = `
                <span class="text-2xl font-extrabold">${city.CITY}, ${city.STATE}</span>
                <br>
                <span class="text-gray-500 text-lg">2013-2019</span>
            `;
                      
            const sidebarMenuCards = generateCitySummary(city);
            const menu = document.getElementById('menu');
            const menuTitle = document.getElementById('menu-title');
            const menuCards = document.getElementById('menu-cards');

            marker.on('click', function () {
                menu!.style.display = 'block';
                menuTitle!.innerHTML = sidebarMenuTitle
                menuCards!.innerHTML = sidebarMenuCards;
            });

            marker.bindPopup(`
                <b>${city.CITY}, ${city.STATE}</b>
                <br>
                Average Inspection Score (Multifamily): ${formatNumbers(city.AVG_SCORE_MULTIFAMILY, S_DECIMALS)}
                <br>
                Average Inspection Score (Public): ${formatNumbers(city.AVG_SCORE_PUBLIC, S_DECIMALS)}
                <br>
                Average Fatalities (per fire): ${formatNumbers(city.AVG_FATALITIES, L_DECIMALS)}
                <br>
                Total Reported Fires (per capita): ${formatNumbers(city.TOTAL_INCIDENT_COUNT_ADJ, L_DECIMALS)}
            `);

            marker.on('mouseover', function () {
                marker.openPopup();
            });
            marker.on('mouseout', function () {
                marker.closePopup();
            });
        }
    });
}

renderPage();
