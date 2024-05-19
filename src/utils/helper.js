
function formatField(value) {
    return `${(value < 16 ? '0' : '')}${value.toString(16).toUpperCase()}`;
}

function formatTwoByteValue(byte1, byte2) {
    const decimalValue = (byte1 << 8) | byte2;
    return `${formatField(byte1)} ${formatField(byte2)} (${decimalValue})`;
}

function formatAddress(byte1, byte2) {
    return formatTwoByteValue(byte1, byte2);
}

function formatData(dataArray) {
    return `${dataArray.map(byte => formatField(byte)).join(' ')} (${dataArray.join(' ')})`;
}
