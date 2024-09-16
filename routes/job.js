const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Set filename
    }
});

// Initialize the multer middleware
const upload = multer({ storage: storage });


// Route to fetch all job postings
// router.get('/jobs', async (req, res) => {
//     try {
//         const jobs = await Job.find();
//         res.json(jobs);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// Route to fetch a single job posting by ID
router.get('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to add a new job posting
router.get('/jobs', async (req, res) => {
    // const { title, description, location, experience } = req.body;
    console.log("aa gye");
    try {
        console.log("aa gye")
    const job = await new Job({ 
        title:"software engineer", 
        description:"abcdefghijkllmnopqrstuvwxyz",
        location:"asdfghjkkl", 
        experience:"6" 
        });
        console.log(job);

   
        const newJob = await job.save();
        console.log(newJob);
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to update a job posting by ID
router.put('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const { title, description, location, experience } = req.body;
        job.title = title || job.title;
        job.description = description || job.description;
        job.location = location || job.location;
        job.experience = experience || job.experience;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to delete a job posting by ID
router.delete('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        await job.remove();
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
