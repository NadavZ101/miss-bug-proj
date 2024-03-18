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
    if (bug._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.title = utilService.makeLorem(5)
        bug.description = utilService.makeLorem(8)
        bug.severity = utilService.getRandomIntInclusive(1, 5)
        bug.createdAt = new Date().getTime()

        bugs.unshift(bug)
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
    if (!bugIdx) return Promise.reject('Bug dose not exist!')
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