import {app} from './settings'
import {runDb} from './db/db';

const port = process.env.PORT || 3015

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()

module.exports = app