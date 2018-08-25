var $$ = Dom7;

var f7app;
var mainView;
var aboutView;
var db

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        f7app = new Framework7({
            // App root element
            root: '#app',
            // App Name
            name: 'CSMM',
            // App id
            id: 'net.catalysm.csmm',
            // Enable swipe panel
            panel: {
                swipe: 'left',
            },
            // Add default routes
            routes: [{
                path: '/about/',
                url: 'about.html',
            }, {
                path: '/details/',
                url: 'details.html',
            }, ],
            // ... other parameters
        });
        mainView = f7app.views.create('.view-main');
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');

        $$(document).on("page:init", '.page[data-name="details"]', e => {
            let storage = window.localStorage;

            $$("#total-datapoints").text(storage.length);

            let data = getDataFromLocalStorage('amountOfTimesTeleported');

            drawChart({
                label: 'Amount of times teleported',
                data: data
            });
        })

        Framework7.request.get("https://csmm.catalysm.net/api/stats", data => {
            let stats = JSON.parse(data);
            console.log(stats)
            $$('#total-servers').text(stats.servers);
            $$('#total-players').text(stats.players);
            $$('#total-users').text(stats.users);
            $$('#uptime').text(stats.uptime);

            $$("#total-custom-commands").text(stats.amountOfCustomCommands);
            $$("#custom-commands-executed").text(stats.amountOfCustomCommandsExecuted);

            $$('#total-teleport-locations').text(stats.amountOfTeleports);
            $$("#total-teleported").text(stats.amountOfTimesTeleported);

            $$("#total-country-ban").text(stats.countryBans);
            $$("#total-command-handlers").text(stats.sdtdCommands);
            $$("#total-motd-modules").text(stats.sdtdMotds);

            $$("#avg-currency").text(Math.round(stats.currencyAvg));
            $$("#total-currency").text(Math.round(stats.currencyTotal));

            $$("#total-guilds").text(stats.guilds);

            storeInLocalStorage(stats)
        })

    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function getDataFromLocalStorage(dataKey) {
    let dataToReturn = new Array();
    let storageIdx = window.localStorage.getItem('index');

    for (let index = 0; index < storageIdx; index++) {
        let dataPoint = window.localStorage.getItem(index);

        if (dataPoint !== null) {
            parsedData = JSON.parse(dataPoint);
            dataToReturn.push({
                data: parsedData[dataKey],
                date: parsedData.date
            })
        }
    }

    return dataToReturn
}

function drawChart(options) {
    var chart = $$("#csmm-chart");
    chart.empty();

    var myChart = new Chart(chart, {
        type: 'line',
        data: {
            labels: options.data.map(data => {
                let date = new Date(data.date);
                return date.toLocaleDateString();
            }),
            datasets: [{
                label: options.label,
                data: options.data.map(data => data.data),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{}]
            }
        }
    });
}

function storeInLocalStorage(stats) {
    let storage = window.localStorage;

    let currentIdx = storage.getItem('index');
    let idxToSet

    if (currentIdx === null) {
        idxToSet = 1;
    } else {
        idxToSet = parseInt(currentIdx) + 1;
    }

    stats.date = Date.now();

    try {
        storage.setItem(idxToSet, JSON.stringify(stats));
        storage.setItem('index', idxToSet);
    } catch (error) {
        console.error(error);
        alert(`Error while setting an item in localStorage: ${error}`);
    }
}