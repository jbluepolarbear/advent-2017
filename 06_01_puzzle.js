function puzzleFunction(input) {
    let buffer = _.map(input.split('\t'), (e) => { return parseInt(e); });
    return findCycle(buffer);
}

function findCycle(buffer) {
    let bufferStates = [];
    while (_.findIndex(bufferStates, (buff) => {
        return _.isEqual(buff, buffer);
    }) == -1) {
        bufferStates.push(_.clone(buffer));
        let largestIndex = _.reduce(buffer, (a, n, index) => {
            if (n > buffer[a]) {
                a = index;
            }
            return a;
        }, 0);
        let blockToDistribute = buffer[largestIndex];
        buffer[largestIndex] = 0;

        for (let i = 0; i < blockToDistribute; ++i) {
            buffer[(largestIndex + 1 + i) % buffer.length] += 1;
        }
    }
    return bufferStates.length;
}