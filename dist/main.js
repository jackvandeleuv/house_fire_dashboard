"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const L = __importStar(require("leaflet"));
// Initialize your map as before
const map = L.map('map', { preferCanvas: true, fadeAnimation: false }).setView([37.8, -96], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);
const menu = document.getElementById('menu');
const menuTitle = document.getElementById('menu-title');
const menuCards = document.getElementById('menu-cards');
function generateCardHTML(title, value) {
    return `
        <div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white my-3">
            <div class="px-6 py-4">
                <div class="font-semibold text-lg mb-2 text-gray-700">${title}</div>
                <p class="text-gray-600 text-base">${value}</p>
            </div>
        </div>
    `;
}
// Fetch data and add it to the map
fetch('../dashboard/dashboard.json')
    .then(response => response.json())
    .then(data => {
    for (let item of data) {
        const marker = L.circleMarker([item.LATITUDE, item.LONGITUDE], {
            radius: Math.pow(item.POPULATION, 1 / 6),
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5,
        }).addTo(map);
        marker.bindPopup(`<b>${item.CITY}, ${item.STATE}</b><br>Average score: ${item.AVG_SCORE}<br>Fires per capita: ${item.TOTAL_INCIDENT_COUNT_ADJ}`);
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
        const decimals = 5;
        function handleValue(value) {
            if (typeof value === 'number') {
                // Round the number to two decimal places if it's a number
                return value.toFixed(decimals);
            }
            else {
                // If not a number, return the value as it is
                return value;
            }
        }
        const sidebarMenuCards = [
            generateCardHTML("Average REAC Score", item.AVG_SCORE.toFixed(1)),
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
            menu.style.display = 'block';
            menuTitle.innerHTML = sidebarMenuTitle;
            menuCards.innerHTML = sidebarMenuCards;
        });
    }
});
//# sourceMappingURL=main.js.map