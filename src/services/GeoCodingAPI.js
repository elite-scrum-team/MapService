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
            }`;
            url += `&${querystring.stringify(query)}`;

            // Fetch
            return await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
        },
    },

    convert: {
        // Gets the muncipality of a given geoData from the Google Geocoding API
        async toMuncipality(geoData) {
            const muncipalityData = geoData.results.filter(
                r =>
                    r.types.filter(e => e === 'administrative_area_level_2')
                        .length > 0
            );

            if (muncipalityData.length === 0) {
                return null;
            }

            let muncipalityObject = muncipalityData[0].address_components;
            muncipalityObject = muncipalityObject.filter(
                r =>
                    r.types.filter(e => e === 'administrative_area_level_2')
                        .length > 0
            );

            if (muncipalityObject.length === 0) {
                return null;
            }

            const name = muncipalityObject[0].long_name;
            return name;
        },
    },
};
