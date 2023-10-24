const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');
const Auth = require('../middleware/auth');

/**
 * Get all jobs created by the authenticated user
 */
router.get('/jobs', Auth, async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user._id });
        res.render('jobs', {
            title: 'Jobs',
            isAuthenticated: req.user,
            Name: req.user.name,
            jobs: jobs
        });
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Add a new job
 */
router.post('/addJob', Auth, async (req, res) => {
    try {
        const { company, position, status } = req.body;
        const createdBy = req.user._id;
        const newJob = new Job({ company, position, status, createdBy });
        await newJob.save();
        res.redirect('/jobs');
    } catch (error) {
        console.log(error.message);
        res.redirect('/addJob');
    }
});

/**
 * Render the page to add a new job
 */
router.get('/addJob', Auth, (req, res) => {
    res.render('addJob', {
        title: 'Add Job',
        isAuthenticated: req.user,
        Name: req.user.name
    });
});

/**
 * Render the page to edit a job
 */
router.get('/editJob/:id', Auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        res.render('editJob', {
            title: 'Edit Job',
            isAuthenticated: req.user,
            Name: req.user.name,
            job: job
        });
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Update a job
 */
router.post('/editJob/:id', Auth, async (req, res) => {
    try {
        const { company, position, status } = req.body;
        await Job.findByIdAndUpdate(req.params.id, { company, position, status });
        res.redirect('/jobs');
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Delete a job
 */
router.get('/deleteJob/:id', Auth, async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        res.redirect('/jobs');
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;