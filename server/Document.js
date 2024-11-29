const { schema, model } = require('mongoose');

const Document = new Schema({
    id: String,
    data: Object
})

module.exports = model("Document" , Document);