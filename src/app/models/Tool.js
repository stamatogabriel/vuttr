const mongoose = require('../../database/index');

const ToolSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Tool = mongoose.model('Tool', ToolSchema);

module.exports = Tool;