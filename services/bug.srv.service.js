import fs from 'fs'
import { utilService } from './utils.service.js'

export const bugSrvService = {
    query,
    save,
    getById,
    remove,
}

const bugs = utilService.readJsonFile('./data/bugs.json')

function query() {
    return Promise.resolve(bugs)
}

function save(bug) {
    console.log('save -> bug -> ', bug)

    if (bug._id) {
        console.log('SERVER service - Edit bug')
        const bugIdx = bugs.findIndex(bug => bug._id === bug._id)
        bugs[bugIdx] = bug
    } else {

        bug._id = utilService.makeId()
        bug.createdAt = new Date().getTime()
        bugs.unshift(bug)

        console.log('SERVER service - New bug ', bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dose not exist!')
    return Promise.resolve(bug)
}

function remove(bugId) {
    console.log(bugId)
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Bug dose not exist!')
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('./data/bugs.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}