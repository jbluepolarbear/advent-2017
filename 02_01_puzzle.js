function puzzleFunction(input) {
    var rows = input.split(/[ ]+/);
    var spreadsheet = _.map(rows, function(row) {
        return _.map(row.split('\t'), function(column) {
            return parseInt(column);
        });
    });
    return checksum(spreadsheet);
}

function checksum(spreadsheet) {
    return _.reduce(spreadsheet, function(a, row) {
        var min = row[0], max = row[0];
        return a + _.reduce(row, function(b, n) {
            if (n < min) {
                min = n;
            }
            if (n > max) {
                max = n;
            }
            return max - min > b ? max - min : b;
        }, 0);
    }, 0);
}