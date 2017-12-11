function puzzleFunction(input) {
    let buffer = _.map(input.split(/[ ]+/), (e) => { return parseInt(e); });
    return escapeBufferEntry(buffer);
}

function escapeBufferEntry(buffer) {
    let index = 0;
    let count = 0;

    while (index >= 0 && index < buffer.length) {
        let jump = buffer[index];
        let nextIndex = index + jump;
        buffer[index] += jump >= 3 ? -1 : 1;
        count += 1;
        index = nextIndex;
    }
    return count;
}