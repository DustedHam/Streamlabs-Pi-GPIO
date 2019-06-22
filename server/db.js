const DataStore = require('nedb')

const db = new DataStore({
    filename: './config.db',
    autoload: true
});

function update(query, updateQuery, options = {}) {

    return new Promise(function (resolve, reject) {

        db.update(query, updateQuery, options, function (err, count) {

            if (err) {
                reject(err);
                return;
            }
            resolve(count);
        });
    })
}

function find(query) {

    return new Promise(function (resolve, reject) {

        db.find(query, function (err, docs) {

            if (err) {
                reject(err);
                return;
            }
            resolve(docs);
        });
    })
}

module.exports = {
    update,
    find
}