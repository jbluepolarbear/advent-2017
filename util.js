function cycle(list, count) {
    var result = [];
    for (var i = 0; i < count; ++i) {
        result.push(list[i % list.length]);
    }
    return result;
}