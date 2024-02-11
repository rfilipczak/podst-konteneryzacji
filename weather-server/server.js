const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;

const app = express();

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/api/weather', async (req, res) => {
    try {
        const lat = 51.77058;
        const lon = 19.47395;
        const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
        console.log(response.data.current);
        res.status(200).json({ current: response.data.current });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch weather' });
    }
});

app.listen(3002);