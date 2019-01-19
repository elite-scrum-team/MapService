const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = {
    geodata: {
        async retrieve(location) {
            // Initialize query
            const query = {
                latlng: ''.concat(location.lat, ', ', location.lng),
            };

            // Initialize URL to Google Geocoding API
            let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${
                process.env.GOOGLE_GEOCODING_API_KEY
            }&language=nb`;
            url += `&${querystring.stringify(query)}`;

            // Fetch
            return (await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })).json();
        },
    },

    convert: {
        // Gets the muncipality of a given geoData from the Google Geocoding API
        async toLocationData(geoData) {
            const wantedData = [
                'administrative_area_level_2',
                'postal_town',
                'route',
                'street_number',
            ];

            // Filter those with municipality
            const locationData = geoData.results.filter(r =>
                r.address_components
                    ? r.address_components.filter(
                          d =>
                              d.types.filter(e => wantedData[0] === e).length >
                              0
                      ).length > 0
                    : false
            );

            if (locationData.length === 0) {
                return null;
            }

            // Same procedure, needs to filter those with municipality ,route ,street number and town
            let locationObject = locationData[0].address_components;
            locationObject = locationObject.filter(
                r =>
                    r.types.filter(
                        e => wantedData.filter(d => d === e).length > 0
                    ).length > 0
            );

            // Return if nothing was found
            if (locationObject.length === 0) {
                return null;
            }

            // Get the wanted data
            const municipalityData = locationObject.filter(
                e => e.types.filter(t => wantedData[0] === t).length > 0
            );
            const cityData = locationObject.filter(
                e => e.types.filter(t => wantedData[1] === t).length > 0
            );
            const routeData = locationObject.filter(
                e => e.types.filter(t => wantedData[2] === t).length > 0
            );
            const streetNumberData = locationObject.filter(
                e => e.types.filter(t => wantedData[3] === t).length > 0
            );

            // Extract data
            const municipality =
                municipalityData.length > 0
                    ? municipalityData[0].short_name
                    : null;
            const city = cityData.length > 0 ? cityData[0].long_name : null;
            const route = routeData.length > 0 ? routeData[0].long_name : null;
            const streetNumber =
                streetNumberData.length > 0
                    ? streetNumberData[0].long_name
                    : null;

            return {
                municipality: municipality
                    ? municipality.replace('Municipality', 'Kommune')
                    : 'Ukjent',
                city: city,
                route: route + (streetNumber ? ' ' + streetNumber : ''),
            };
        },
    },
};
