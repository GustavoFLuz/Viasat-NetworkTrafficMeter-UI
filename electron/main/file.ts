import * as fs from 'fs';

export const read_settings = function () {
    try {
        const settings = fs.readFileSync("settings.json", 'utf8')
        return JSON.parse(settings);
    } catch (err) {
        return null;
    }
}

export const write_settings = function (output: any) {
    return fs.writeFileSync("settings.json", JSON.stringify(output));
}