function puzzleFunction(input) {
    let rows = input.split(/[ ]+/);
    let passphrases = _.map(rows, function(row) {
        return _.map(row.split(/\t/), function(column) {
            return column;
        });
    });
    return validatePassphrase(passphrases);
}

function validatePassphrase(passphrases) {
    let totalPasses = 0;
    totalPasses = _.reduce(passphrases, (a, passphrase) => {
        return a + (passphrase.filter((passPart, index) => {
            return passphrase.indexOf(passPart) === index;
        }).length === passphrase.length ? 1 : 0);
    }, 0);

    return totalPasses;
}