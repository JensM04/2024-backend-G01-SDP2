const { v5: uuidv5 } = require('uuid');

let seed = 0;

function seededUUIDv5() {
    return uuidv5(`${seed++}`, Array.from({length: 16}, (_, i) => i.toString(16)));
}

module.exports = seededUUIDv5;