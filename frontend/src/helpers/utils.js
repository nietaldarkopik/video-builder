import xml2json from "xml-js";

export const secondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const parseXML = (xmlData) => {
    let output = xml2json.xml2json(xmlData, { compact: true, spaces: 0 });

    return output;
}


export const parseParams = (params = "") => {
    const rawParams = params.replace("?", "").split("&");
    const extractedParams = {};
    rawParams.forEach((item) => {
        item = item.split("=");
        extractedParams[item[0]] = item[1];
    });
    return extractedParams;
};

export const decode64 = (str) => {
    let decodedString = str;
    if (str && /^[A-Za-z0-9+/=]+$/.test(str)) {
        decodedString = (!atob(str)) ? str : atob(str);
    }
    return decodedString;
}

export const encode64 = (str) => {
    let decodedString = str;
    if (/^[A-Za-z0-9+/=]+$/.test(str)) { } else {
        decodedString = btoa(str);
    }
    return decodedString;
}