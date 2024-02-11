const { Schema, model } = require('mongoose');

const daySchema = new Schema({
  hours_work: Number,
  hours_vacation: Number,
}, { _id: false });

const weeklyReportSchema = new Schema({
  userId: String,
  weekStartDate: String,
  days: [daySchema]
}); 

const WeeklyReport = model('WeeklyReport', weeklyReportSchema);

module.exports = WeeklyReport;