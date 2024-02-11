const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authCheck = require('./middleware/auth-check');
const WeeklyReport = require('./models/weekly-report.model');

const app = express();

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}

const empty_report = [
    { hours_work: 0, hours_vacation: 0 },
    { hours_work: 0, hours_vacation: 0 },
    { hours_work: 0, hours_vacation: 0 },
    { hours_work: 0, hours_vacation: 0 },
    { hours_work: 0, hours_vacation: 0 },
    { hours_work: 0, hours_vacation: 0 },
    { hours_work: 0, hours_vacation: 0 }
];

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/api/report', authCheck, async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.userData.userId)

        const filter = { userId: req.userData.userId, weekStartDate: req.body.weekStartDate };
        const update = { days: req.body.days };
        const opts = { new: true, upsert: true };
        
        await WeeklyReport.findOneAndUpdate(filter, update, opts);

        res.status(200).json({ message: 'Successfuly reported time' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to report time' });
    }
})

app.get('/api/report', authCheck, async (req, res) => {
    try {
        console.log(req.query.weekStartDate);
        console.log(req.userData.userId)

        const weeklyReport = await WeeklyReport.findOne({ userId: req.userData.userId, weekStartDate: req.query.weekStartDate });

        if (!weeklyReport) {
            console.log("No such report in the db");
            return res.status(200).json({ days: empty_report });
        }

        res.status(200).json({
            days: weeklyReport.days
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch report' });
    }
})

async function connectToDatabase() {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@reporting-db:27017/reports-db?authSource=admin`, { useNewUrlParser: true });
        console.log('Connected to MongoDB successfully');
        app.listen(3001);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
  
connectToDatabase();