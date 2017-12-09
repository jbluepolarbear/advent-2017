function puzzleFunction(input) {
    var number = parseInt(input);
    return spiral(number);
}

function findAdjacent(spatialInfo) {
    let position;
    //layer, direction, count
    spatialInfo.count += 1;
    if (spatialInfo.direction === 2) {
        position = 4;
        if (spatialInfo.layer === spatialInfo.count) {
            spatialInfo.direction = 1;
            spatialInfo.count = 0;
        }
    } else if (spatialInfo.direction === 1) {
        position = 2;
        if (spatialInfo.layer === spatialInfo.count) {
            spatialInfo.direction = 4;
            spatialInfo.layer += 1;
            spatialInfo.count = 0;
        }
    } else if (spatialInfo.direction === 3) {
        position = 6;
        if (spatialInfo.layer === spatialInfo.count) {
            spatialInfo.direction = 2;
            spatialInfo.layer += 1;
            spatialInfo.count = 0;
        }
    } else if (spatialInfo.direction === 4) {
        position = 8;
        if (spatialInfo.layer === spatialInfo.count) {
            spatialInfo.direction = 3;
            spatialInfo.count = 0;
        }
    }

    return position;
}

function spiral(number) {
    let spiralList = [{
        value: 1
    }];

    let currentValue = 1;
    let spatialInfo = {
        layer: 1,
        direction: 2,
        count: 0
    };
    while (currentValue <= number) {
        let position = findAdjacent(spatialInfo);
        let index = spiralList.length - 1;
        let node = spiralList[index];
        let newNode = {
            value: node.value
        };
        spiralList.push(newNode);
        if (position === 4) {
            node._4 = spiralList.length - 1;
            newNode._8 = index;
            if (node._2 !== undefined) {
                let iNode = spiralList[node._2];
                newNode.value += iNode.value;
                newNode._1 = node._2;
            }
            if (node._3 !== undefined) {
                let iNode = spiralList[node._3];
                newNode.value += iNode.value;
                newNode._2 = node._3;
                if (iNode._4 !== undefined) {
                    let iNode2 = spiralList[iNode._4];
                    newNode.value += iNode2.value;
                    newNode._3 = iNode._4;
                    iNode2._7 = spiralList.length - 1;
                }
            }
        } else if (position === 2) {
            node._2 = spiralList.length - 1;
            newNode._6 = index;
            if (node._8 !== undefined) {
                let iNode = spiralList[node._8];
                newNode.value += iNode.value;
                newNode._7 = node._8;
            }
            if (node._1 !== undefined) {
                let iNode = spiralList[node._1];
                newNode.value += iNode.value;
                newNode._8 = node._1;
                if (iNode._2) {
                    let iNode2 = spiralList[iNode._2];
                    newNode.value += iNode2.value;
                    newNode._1 = iNode._2;
                    iNode2._4 = spiralList.length - 1;
                }
            }
        } else if (position === 8) {
            node._8 = spiralList.length - 1;
            newNode._4 = index;
            if (node._6 !== undefined) {
                let iNode = spiralList[node._6];
                newNode.value += iNode.value;
                newNode._5 = node._6;
            }
            if (node._7 !== undefined) {
                let iNode = spiralList[node._7];
                newNode.value += iNode.value;
                newNode._6 = node._7;
                if (iNode._8) {
                    let iNode2 = spiralList[iNode._8];
                    newNode.value += iNode2.value;
                    newNode._7 = iNode._8;
                    iNode2._3 = spiralList.length - 1;
                }
            }
        } else if (position === 6) {
            node._6 = spiralList.length - 1;
            newNode._2 = index;
            if (node._4 !== undefined) {
                let iNode = spiralList[node._4];
                newNode.value += iNode.value;
                newNode._3 = node._4;
            }
            if (node._5 !== undefined) {
                let iNode = spiralList[node._5];
                newNode.value += iNode.value;
                newNode._4 = node._5;
                if (iNode._6) {
                    let iNode2 = spiralList[iNode._6];
                    newNode.value += iNode2.value;
                    newNode._5 = iNode._6;
                    iNode2._1 = spiralList.length - 1;
                }
            }
        }
        currentValue = newNode.value;
    }

    return currentValue;
}