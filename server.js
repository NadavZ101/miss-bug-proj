import express from 'express'
import { bugSrvService } from './services/bug.srv.service.js'

const app = express()

app.use(express.static('public')) //bring the index.html of the React App

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    console.log('Query');
    bugSrvService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            console.log('Cannot load bugs', err)
            res.status(400).send('Cannot load bugs')
        })
})

// Add/Edit Bugs (SAVE)
app.get('/api/bug/save', (req, res) => {
    console.log('SAVE')
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
        createdAt: +req.query.createdAt
    }
    //edit not working -> id of bug wont come...
    console.log(bugToSave)
    bugSrvService.save(bugToSave)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            res.status(400).sendStatus('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    console.log('GetById')
    const bugId = req.params.bugId
    console.log(bugId)
    bugSrvService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(400).sendStatus('Cannot get the bug')
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    console.log('Remove')

    const bugId = req.params.bugId
    bugSrvService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            res.status(400).send('Cannot remove bug')
        })

})


const port = 3031
app.listen(port, () => console.log(`Server ready on port http://127.0.0.1:${port}`))