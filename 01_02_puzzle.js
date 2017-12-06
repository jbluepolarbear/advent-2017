function puzzleFunction(input) {
    var numbers = _.map(input, function(c) { return parseInt(c); });
    var offset = numbers.length / 2;
    return captcha(numbers, offset);
}

function captcha(numbers, offset) {
    var numCycle = cycle(numbers, numbers.length + offset);
    return _.reduce(numbers, function(a, n, index) {
        return a + (n === numCycle[index + offset]? n : 0);
    }, 0);
}