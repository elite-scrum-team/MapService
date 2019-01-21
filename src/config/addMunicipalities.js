const db = require('../models');

const municipalities = require('./municipalities');

municipalities.containeditems.forEach(async municipality => {
    if (municipality.status === 'Gyldig') {
        await db.municipality
            .findOrCreate({
                where: { name: municipality.description },
            })
            .spread((municity, created) => {
                console.log(
                    municity.get({
                        plain: true,
                    })
                );
                console.log(created);
            });
    }
});
