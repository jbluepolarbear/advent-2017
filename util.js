function cycle(list, count) {
    var result = [];
    for (var i = 0; i < count; ++i) {
        result.push(list[i % list.length]);
    }
    return result;
}

function rotate(list, offset) {
    let rotated = [];
    for (let i = 0, j = list.length - offset; i < list.length; ++i) {
        rotated.push(list[(j + i) % list.length]);
    }
    return rotated;
}