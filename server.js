import express from 'express'
import cookieParser from 'cookie-parser'
import { bugSrvService } from './services/bug.srv.service.js'

const app = express()

// App Configuration:
app.use(express.static('public')) //bring the index.html of the React App
app.use(cookieParser()) // for using cookies
app.use(express.json()) // for req.body (from public server (axios))


// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    console.log('server ---> req.query ', req.query)

    const { txt, severity, title, createdAt, pageIdx } = req.query
    const filterBy = { txt, severity, pageIdx }
    const sortBy = { title, severity, createdAt }
    // const filterBy = req.query
    // console.log(filterBy)

    console.log(filterBy)
    console.log(sortBy)

    bugSrvService.query(filterBy, sortBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            console.log('Cannot load bugs', err)
            res.status(400).send('Cannot load bugs')
        })
})

// Get Bug (READ - Details)
app.get('/api/bug/:bugId', (req, res) => {
    console.log('get bug -> req.params ', req.params)
    const { bugId } = req.params

    console.log('req.cookies ', req.cookies)
    const visitedBugs = req.cookies.visitedBugs || [] // use the default if undefined
    console.log('visitedBugs - before', visitedBugs)

    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) return res.status(401).sendStatus('Wait for a bit')
        else visitedBugs.push(bugId)
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 70 * 1000 })
    console.log('visitedBugs - after', visitedBugs)

    bugSrvService.getById(bugId)
        .then(bug => {
            res.send(bug)

        })
        .catch(err => {
            res.status(400).sendStatus('Cannot get the bug')
        })

})

// Create Bug
app.post('/api/bug', (req, res) => {
    console.log('post -> req.body ', req.body)

    const bugsToCreate = req.body
    bugSrvService.save(bugsToCreate)
        .then(bug => res.send(bug))
        .catch((err) => {
            res.status(400).send('Cannot save bug')
        })

})

//Update Bug
app.put('/api/bug', (req, res) => {
    const bug = req.body
    bugSrvService.save(bug)
        .then(bug => res.send(bug))
        .catch((err) => {
            res.status(400).send('Cannot save bug')

        })
})

// Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    console.log('Remove')
    console.log('req.params ', bugId)

    bugSrvService.remove(bugId)
        .then(() => {
            res.send(bugId)
        })
        .catch((err) => {
            res.status(401).send('Cannot remove bug')
        })

})



const port = 3031
app.listen(port, () => console.log(`Server ready on port http://127.0.0.1:${port}`))