const Workout = require("../models/Workout");
const mongoose = require("mongoose");

// GET all workouts (for logged-in user)
const getAllWorkouts = async (req, res) => {
    const user_id = req.user._id;

    try {
        const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
        res.status(200).json({
            message: `${workouts.length} workouts found`,
            data: workouts
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// GET a single workout by ID
const getWorkoutById = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid workout ID" });
    }

    const workout = await Workout.findOne({ _id: id, user_id });

    if (workout) {
        res.status(200).json(workout);
    } else {
        res.status(404).json({ message: "Workout not found" });
    }
};

// POST a new workout
const createWorkout = async (req, res) => {
    const { title, reps, load } = req.body;
    const user_id = req.user._id;

    let emptyFields = [];
    if (!title) emptyFields.push("title");
    if (!reps) emptyFields.push("reps");
    if (!load) emptyFields.push("load");

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the required fields!', emptyFields });
    }

    try {
        const workout = await Workout.create({ title, reps, load, user_id });
        res.status(201).json(workout);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// PUT an updated workout
const updateWorkout = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid workout ID" });
    }

    const workout = await Workout.findOneAndUpdate(
        { _id: id, user_id },
        req.body,
        { new: true }
    );

    if (workout) {
        res.status(200).json(workout);
    } else {
        res.status(404).json({ message: "Workout not found" });
    }
};

// DELETE a workout
const deleteWorkout = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid workout ID" });
    }

    const workout = await Workout.findOneAndDelete({ _id: id, user_id });

    if (workout) {
        res.status(200).json({ message: "Workout deleted successfully", workout });
    } else {
        res.status(404).json({ message: "Workout not found" });
    }
};

// Search workouts by title
const searchWorkouts = async (req, res) => {
    const query = req.query.q;
    const user_id = req.user._id;

    try {
        const workouts = await Workout.find({
            user_id,
            title: { $regex: query, $options: "i" }
        }).select("title");

        if (workouts.length > 0) {
            res.status(200).json(workouts);
        } else {
            res.status(404).json({ message: "No workouts found" });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllWorkouts,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    searchWorkouts
};
