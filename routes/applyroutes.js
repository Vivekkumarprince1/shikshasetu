const express = require('express');
const Job = require('../models/job');
const Application = require('../models/application');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Setup Multer for file uploads (resume)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET: Show all job listings
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.render('jobs', { jobs });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// GET: Job Application Form
router.get('/apply/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).send('Job not found');
        }

        console.log(job); // Debugging - check if the job is being fetched correctly

        res.render('apply', { job });
    } catch (err) {
        console.error('Error fetching job:', err); // Log the error for debugging
        res.status(500).send('Error fetching job details');
    }
});


// POST: Submit a Job Application
router.post('/apply/:id', upload.single('resume'), async (req, res) => {
    try {
        const { name, email } = req.body;
        const jobId = req.params.id;

        // Create new job application
        const newApplication = new Application({
            name,
            email,
            resume: req.file.filename, // Resume file path
            jobId
        });

        await newApplication.save();
        res.redirect('/apply/success');
    } catch (err) {
        res.status(500).send('Error submitting application');
    }
});

// GET: Application Success Page
router.get('/apply/success', (req, res) => {
    res.render('success');
});

module.exports = router;
