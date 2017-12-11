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
    totalPasses = _.reduce(_.map(passphrases, (passphrase) => {
            return _.map(passphrase, (part) => {
                return _.reduce(part, (a, n) => {
                    a.push(n);
                    a.sort();
                    return a;
                }, []);
            });
        }), (a, passphrase) => {
        return a + (passphrase.filter((passPart, index) => {
            return _.findIndex(passphrase, function(o) { return _.isEqual(o, passPart); }) === index;
        }).length === passphrase.length ? 1 : 0);
    }, 0);

    return totalPasses;
}