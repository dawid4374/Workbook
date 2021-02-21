const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    country: {
        type: String,
        enum: ['Poland', 'England', 'Germany'],
    },
    school: {
        type: String,
    },
    educationLevel: {
        type: String,
        enum: ['Associate Degree', 'Bechelor Degree', 'Doctorate', 'High School', 'Master Degree'],
    },
    studyArea: {
        type: String,
        enum: ['Medicine', 'Agricultural Sciences', 'Biochemistry', 'Cell Biology', 'Environment & Ecology', 'Neuroscience', 'Pharmacology & Toxicology', 'Zoology & Plant Biology', 'Veterinary Medicine', 'Communication', 'Education', 'Arts & Humanities', 'Public Policy', 'Economics', 'Politics', 'Information Management', 'Social & Behavioral Sciences', 'Business', 'Law', 'Chemistry', 'Physics', 'Space Science', 'Earth Science', 'Paleontology', 'Engineering', 'Materials Science', 'IT', 'Mathematics', 'Statistics', 'Logistics', 'Robotics'],
    },
    language: {
        type: String,
        enum: ['Polish', 'English', 'German'],
    },
    proficiency: {
        type: String,
        enum: ['A1', 'A2', 'B1/B2', 'C1', 'C2', 'Conversational'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
    },
})

const User = mongoose.model('User', UserSchema)

module.exports = User;