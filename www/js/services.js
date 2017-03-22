angular.module('starter.services', [])

.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})

.service('Math', function() {
    this.multiply = function(x, y) {
        return x * y;
    };
})

.factory('Server', ['$http', function($http) {
    return {
        get: function(url) {
            return $http.get(url);
        },
        post: function(url) {
            return $http.post(url);
        },
    };
}])

.filter('reverse', function() {
    return function(input, uppercase) {
        var out = '';
        for (var i = 0; i < input.length; i++) {
            out = input.charAt(i) + out;
        }
        if (uppercase) {
            out = out.toUpperCase();
        }
        return out;
    }
})

.factory('Framework', function($q) {
    var _navigator = $q.defer();
    var _cordova = $q.defer();
    console.log('I am in');

    if (window.cordova === undefined) {
        _navigator.resolve(window.navigator);
        _cordova.resolve(false);
    } else {
        document.addEventListener('deviceready', function(evt) {
            _navigator.resolve(navigator);
            _cordova.resolve(true);
        });
    }

    console.log('I amasdaldja in');

    return {
        navigator: function() { return _navigator.promise; },
        cordova: function() { return _cordova.promise; }
    };
})

.service('PusherService', function($rootScope) {
    // var pusher = new Pusher('d32f341194c38a2de8ed');
    // var channel = pusher.subscribe('bookings');
    var pusher;
    var channel;

    return {

        instantiatePusher: function(userId) {
            pusher = new Pusher('d32f341194c38a2de8ed');
            channel = pusher.subscribe('drivers_' + userId + '_new');
            console.log('pusher channel: ' + 'drivers_' + userId + '_new');
        },

        onMessage: function(callback) {
            channel.bind('async_notification', function(data) {
                $rootScope.$apply(function() {
                    callback(data);
                });
            });
        }
    };

});