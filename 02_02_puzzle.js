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
        var result = 0;
        for (var i = 0; i < row.length; ++i) {
            for (var j = 0; j < row.length; ++j) {
                if (i === j) {
                    continue;
                }
                var upper = row[i];
                var lower = row[j];
                if (upper < lower) {
                    var c = upper;
                    upper = lower;
                    lower = c;
                }

                if (upper % lower === 0) {
                    result = upper / lower;
                    break;
                }
            }
        }
        return a + result;
    }, 0);
}