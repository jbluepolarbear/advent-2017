function puzzleFunction(input) {
    var number = parseInt(input);
    return spiral(number);
}

function spiral(number) {
    let nearestPower = Math.floor(Math.sqrt(number));
    nearestPower -= nearestPower % 2 ? 0 : 1;

    let lowerPower = Math.pow(nearestPower, 2);
    let higherPower = Math.pow(nearestPower + 2, 2);
    let currentPowerRange = higherPower - lowerPower;
    let sideSize = currentPowerRange / 4;
    let difference = number - lowerPower;
    let side = Math.floor(difference / sideSize);
    let distanceFromMiddle = Math.abs(number - (side * sideSize + sideSize / 2 + lowerPower));

    return distanceFromMiddle + sideSize / 2;
}