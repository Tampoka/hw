import {app} from './settings'

const port = process.env.PORT || 3015

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})