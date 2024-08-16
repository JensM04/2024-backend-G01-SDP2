const bestellingEnum = {
    0: 'geplaatst',
    1: 'verwerkt',
    2: 'verzonden',
    3: 'uit voor levering',
    4: 'geleverd',
    5: 'voltooid'
};

const convertToValueBestelling = (enumValue) => {
    switch (enumValue) {
    case 0:
        return 'geplaatst';
    case 1:
        return 'verwerkt';
    case 2:
        return 'verzonden';
    case 3:
        return 'uit voor levering';    
    case 4:
        return 'geleverd';
    case 5:
        return 'voltooid';
    }
};

const convertToEnumBestelling = (stringValue) => {
    switch (stringValue.toLowerCase()) {
    case 'geplaatst':
        return 0;
    case 'verwerkt':
        return 1;
    case 'verzonden':
        return 2;
    case 'uit voor levering':
        return 3;
    case 'geleverd':
        return 4;
    case 'voltooid':
        return 5;
    }
};

const betalingEnum = {
    0: 'onverwerkt',
    1: 'factuur verzonden',
    2: 'betaald'
};

const convertToValueBetaling = (enumValue) => {
    switch (enumValue) {
    case 0:
        return 'onverwerkt';
    case 1:
        return 'factuur verzonden';
    case 2:
        return 'betaald';
    }
};

const convertToEnumBetaling = (stringValue) => {
    switch (stringValue) {
    case 'onverwerkt':
        return 0;
    case 'factuur verzonden':
        return 1;
    case 'betaald':
        return 2;
    }
};

const notifSoortEnum = {
    0: 'betalingsherinnering',
    1: 'Ontvangen betaling',
    2: 'Alle producten voorradig',
};

const convertToStringNotifSoort = (enumValue) => {
    switch (enumValue) {
    case 0:
        return 'betalingsherinnering';
    case 1:
        return 'Ontvangen betaling';
    case 2:
        return 'Alle producten voorradig';
    }
};

module.exports = {
    bestellingEnum,
    betalingEnum,
    notifSoortEnum,
    convertToValueBestelling,
    convertToEnumBestelling,
    convertToValueBetaling,
    convertToEnumBetaling,
    convertToStringNotifSoort,
};