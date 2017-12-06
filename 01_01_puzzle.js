function puzzleFunction(input) {
    return captcha(_.map(input, function(c) { return parseInt(c); }));
}

function captcha(numbers) {
    var numCycle = cycle(numbers, numbers.length + 1);
    return _.reduce(numCycle, function(a, n, index) {
        return a + (n === numCycle[index - 1] ? n : 0);
    }, 0);
}