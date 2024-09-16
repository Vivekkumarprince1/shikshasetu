const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    resume: { type: String, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
