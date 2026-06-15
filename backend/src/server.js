require('dotenv').config();

const { sql, config } = require('./config/db.config');

const app = require('./app');

const PORT = process.env.PORT || 5000;

sql.connect(config)
    .then(() => {

        console.log('Connected SQL Server');

        app.listen(PORT, () => {
            console.log(`Server running at: http://localhost:${PORT}`);
        });

    })
    .catch(err => {
        console.log(err);
    });