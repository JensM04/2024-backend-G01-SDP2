const notificatieTekst = (type, bestellingId) =>{
    switch(type){
    case 'Betalingsherinnering':
        return `Gelieve de betaling voor bestelling ${bestellingId} zo snel mogelijk uit te voeren.`;
    }
};

module.exports = {
    notificatieTekst
};