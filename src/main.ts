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
    CITY: string;
    STATE: string;
    POPULATION: number;
    TYPE: string;
    COUNT_111_ADJ: number;
    COUNT_113_ADJ: number;
    COUNT_131_ADJ: number;
    COUNT_151_ADJ: number;
    COUNT_142_ADJ: number;
    TOTAL_INCIDENT_COUNT_ADJ: number;
    AVG_SCORE_MULTIFAMILY_PERCENTILE: number;
    AVG_SCORE_PUBLIC_PERCENTILE: number;
    AVG_SPREAD_PERCENTILE: number;
    AVG_MONEY_LOST_PERCENTILE: number;
    AVG_FATALITIES_PERCENTILE: number;
    AVG_INJURIES_PERCENTILE: number;
    AVG_ALARMS_PERCENTILE: number;
    POPULATION_PERCENTILE: number;
    SUPPORT_PERCENTILE: number,
    COUNT_111_ADJ_PERCENTILE: number;
    COUNT_113_ADJ_PERCENTILE: number;
    COUNT_131_ADJ_PERCENTILE: number;
    COUNT_151_ADJ_PERCENTILE: number;
    COUNT_142_ADJ_PERCENTILE: number;
    TOTAL_INCIDENT_COUNT_ADJ_PERCENTILE: number;
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

function generateCardHTML(title: string, value: string, percentile: string) {
    return `
    <div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white my-3">
    <div class="px-6 py-4">
        <div class="font-semibold text-lg mb-2 text-gray-700">${title}</div>
    </div>
    <div class="bg-gray-200 py-4 px-6">
        <p class="text-gray-700 font-semibold text-base">
            <span class="text-xl">${value}</span>
        </p>
        <p class="text-gray-500 text-sm">Higher than ${percentile}</p>
    </div>
</div>



    `;
}

function generateCitySummary(city: City): string {
    return [
        generateCardHTML("Average Multifamily Inspection Score", 
            formatNumbers(city.AVG_SCORE_MULTIFAMILY, S_DECIMALS),
            formatPercentile(city.AVG_SCORE_MULTIFAMILY_PERCENTILE)
        ),
        generateCardHTML("Average Public Inspection Score",
            formatNumbers(city.AVG_SCORE_PUBLIC, S_DECIMALS),
            formatPercentile(city.AVG_SCORE_PUBLIC_PERCENTILE)
        ),
        generateCardHTML("Average Buildings/Vehicles/Etc. Ignited (per fire)",
            formatNumbers(city.AVG_SPREAD, L_DECIMALS),
            formatPercentile(city.AVG_SPREAD_PERCENTILE)
        ),
        generateCardHTML("Average Fatalities (per fire)",
            formatNumbers(city.AVG_FATALITIES, L_DECIMALS),
            formatPercentile(city.AVG_FATALITIES_PERCENTILE)
        ),
        generateCardHTML("Average Injuries (per fire)",
            formatNumbers(city.AVG_INJURIES, L_DECIMALS),
            formatPercentile(city.AVG_INJURIES_PERCENTILE)
        ),
        generateCardHTML("Average Value of Property Lost (per fire)",
            dollar_formatter.format(city.AVG_MONEY_LOST),
            formatPercentile(city.AVG_MONEY_LOST_PERCENTILE)
        ),
        generateCardHTML("Average Alarms Triggered (per fire)",
            formatNumbers(city.AVG_ALARMS, L_DECIMALS),
            formatPercentile(city.AVG_ALARMS_PERCENTILE)
        ),
        generateCardHTML("Total Reported Fires (per capita)",
            formatNumbers(city.TOTAL_INCIDENT_COUNT_ADJ, L_DECIMALS),
            formatPercentile(city.TOTAL_INCIDENT_COUNT_ADJ_PERCENTILE)
        ),
        generateCardHTML("Reported Cooking Fires (per capita)",
            formatNumbers(city.COUNT_113_ADJ, L_DECIMALS),
            formatPercentile(city.COUNT_113_ADJ_PERCENTILE)
        ),
        generateCardHTML("Reported Passenger Vehicle Fires (per capita)",
            formatNumbers(city.COUNT_131_ADJ, L_DECIMALS),
            formatPercentile(city.COUNT_131_ADJ_PERCENTILE)
        ),
        generateCardHTML("Reported Outside Trash/Rubbish/Waste Fires (per capita)",
            formatNumbers(city.COUNT_151_ADJ, L_DECIMALS),
            formatPercentile(city.COUNT_151_ADJ_PERCENTILE)
        ),
        generateCardHTML("Reported Brush/Grass Fires (per capita)",
            formatNumbers(city.COUNT_142_ADJ, L_DECIMALS),
            formatPercentile(city.COUNT_142_ADJ_PERCENTILE)
        ),
        generateCardHTML("Population",
            city.POPULATION.toLocaleString(),
            formatPercentile(city.POPULATION_PERCENTILE)
        ),
        generateCardHTML("Total Fires Reported to NFIRS",
            city.SUPPORT.toLocaleString(),
            formatPercentile(city.SUPPORT_PERCENTILE)
        )
    ].join('');
}

function formatNumbers(value: string | number, round_to: number): string {
    if (value == null) return 'N/A';
    if (typeof value === 'number') return value.toFixed(round_to).toString();
    return value;
}

function formatPercentile(val: number | null): string {
    if (val == null) return 'N/A';
    return (val * 100).toFixed(0).toString() + '%';
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
            `, { autoPan: false });

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
