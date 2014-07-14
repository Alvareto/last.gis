function Artist(_artistName) {
    this.name = _artistName;
    this.events = [];

    this.getEvents = function () {
        $.getJSON("http://ws.audioscrobbler.com/2.0/?method=artist.getevents&artist="
                    + this.name + "&api_key=c7e2dc95d8a8f162ab42118cfb0f30db&format=json",
            function (data) {
                $.each(data.events.event, function (i, item) {
                    this.events.push(new Event(item.title, item.venue.location.city, item.venue.location.country, item.venue.location["get:point"]["geo:lat"], item.venue.location["geo:point"]["geo:long"]));
                });
            }
        );
        return this.events;
    };
}

function Event(_title, _city, _country, _lat, _long) {
    this.title = _title;
    this.city = _city;
    this.country = _country;
    this.latitude = _lat;
    this.longitude = _long;

    this.getCoordinates = function () {
        return new giscloud.LonLat(this.longitude, this.latitude);
    };

    this.getEventMarker = function () {
        return new giscloud.FlagMarker(
            this.getCoordinates().toBounds().center(),
            this.title, // title
            this.city + this.country, // content
            giscloud.Color.randomHue(70, 50)
        );
    };

    this.toString = function () {
        return "<br/>Event: " + this.title + " | Coo. [lat]" + this.lat + ": [long] " + this.long;
    };
}

function Map(_viewer) {
    this.mapId = 744548;
    this.layerId = 745171;
    this.markers = [];
    this.viewer = _viewer;

    this.createMarkersFromEvents = function (_events) {
        $.each(_events, function (i, event) {
            this.markers.push(event.getEventMarker());
        });
        return this.markers;
    };

    this.addMarkersToMap = function (_markers) {
        $.each(markers, function (i, marker) {
            marker.visible(true);
            this.viewer.addMarker(marker);
        });
    };
}
