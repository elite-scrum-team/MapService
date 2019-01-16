module.exports = {
    geodata: {
        async retrieve(location) {
            return await new Promise(resolve => {
                const loc = `${location.lat},${location.lng}`;
                resolve(loc);
            });
        },
    },
    convert: {
        async toLocationData() {
            const municipality = 'Ørland kommune';
            const city = 'Opphaug';
            const route = 'Fru Ingesvei';
            const streetNumber = '12';

            return await {
                municipality: municipality
                    ? municipality.replace('Municipality', 'Kommune')
                    : 'Ukjent',
                city: city,
                route: route + (streetNumber ? ' ' + streetNumber : ''),
            };
        },
    },
};
