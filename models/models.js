const fs = require("fs/promises")

exports.fetchEndpoints = () => {
    return fs.readFile(`./endpoints.json`).then((data) => {
        return JSON.parse(data);
    })
}