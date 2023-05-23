import * as L from 'leaflet';
// Initialize your map as before
var map = L.map('map', { preferCanvas: true, fadeAnimation: false }).setView([37.8, -96], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);
var menu = document.getElementById('menu');
var menuTitle = document.getElementById('menu-title');
var menuCards = document.getElementById('menu-cards');
function generateCardHTML(title, value) {
    return "\n        <div class=\"max-w-sm rounded-lg overflow-hidden shadow-lg bg-white my-3\">\n            <div class=\"px-6 py-4\">\n                <div class=\"font-semibold text-lg mb-2 text-gray-700\">".concat(title, "</div>\n                <p class=\"text-gray-600 text-base\">").concat(value, "</p>\n            </div>\n        </div>\n    ");
}
// Fetch data and add it to the map
fetch('../dashboard/dashboard.json')
    .then(function (response) { return response.json(); })
    .then(function (data) {
    var _loop_1 = function (item) {
        var marker = L.circleMarker([item.LATITUDE, item.LONGITUDE], {
            radius: Math.pow(item.POPULATION, 1 / 6),
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5,
        }).addTo(map);
        marker.bindPopup("<b>".concat(item.CITY, ", ").concat(item.STATE, "</b><br>Average score: ").concat(item.AVG_SCORE, "<br>Fires per capita: ").concat(item.TOTAL_INCIDENT_COUNT_ADJ));
        marker.on('mouseover', function () {
            marker.openPopup();
        });
        marker.on('mouseout', function () {
            marker.closePopup();
        });
        var sidebarMenuTitle = "\n                <span class=\"text-2xl font-extrabold\">".concat(item.CITY, ", ").concat(item.STATE, "</span>\n                <br>\n                <span class=\"text-gray-500 text-lg\">2013-2019</span>\n            ");
        var dollar_formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        var decimals = 5;
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
        var sidebarMenuCards = [
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
    };
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        _loop_1(item);
    }
});
//# sourceMappingURL=main.js.map