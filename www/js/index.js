var $$ = Dom7;

var f7app;
var mainView;
var aboutView;

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
            }, ],
            // ... other parameters
        });
        mainView = f7app.views.create('.view-main');
        aboutView = f7app.views.create('.view-about');
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');

        Framework7.request.get("https://csmm.catalysm.net/api/stats", data => {
            let stats = JSON.parse(data);
            console.log(stats);

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
        })

    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();