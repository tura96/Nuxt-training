const fixedMapping = {
    '0': 'x',
    '1': 'y',
    '2': 'z',
    '3': 'w',
    '4': 'v',
    '5': 'u',
    '6': 't',
    '7': 's',
    '8': 'r',
    '9': 'q',
    '.': 'p'
};

function createReverseMapping(mapping) {
    const reverseMapping = {};
    for (const key in mapping) {
        reverseMapping[mapping[key]] = key;
    }
    return reverseMapping;
}

export const convertNumberToString = (numberString) => {
    const mapping = fixedMapping;
    let result = '';
    for (let i = 0; i < numberString.length; i++) {
        let char = numberString[i];
        if (mapping[char] !== undefined) {
            result += mapping[char];
        } else {
            result += char;
        }
    }
    return result;
}

export const convertStringToNumber = (encodedString: string) => {
    const reverseMapping = createReverseMapping(fixedMapping);

    let result = '';
    for (let i = 0; i < encodedString.length; i++) {
        let char = encodedString[i];
        if (reverseMapping[char] !== undefined) {
            result += reverseMapping[char];
        } else {
            result += char;
        }
    }

    return result;
}

export const getCookieCustom = (cookies:any, name:any) => {
    const match = cookies.match(new RegExp('(^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
};