
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .catch(err => console.log('Cannot get the bugs ', err))

    // return storageService.query(STORAGE_KEY)
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => console.log('err:', err))
    // return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
        .then(res => res.data)
        .catch(err => console.log('err: ', err))
    // return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    console.log(bug)
    const url = BASE_URL + 'save'
    let queryParams =
        `?&title=${bug.title}&severity=${bug.severity}&description=${bug.description}`

    if (bug._id) {
        queryParams += `&id=${bug._id}&createdAt=${bug.createdAt}`
        console.log('EDIT BUG')
        console.log(queryParams)
    }
    return axios.get(url + queryParams)
        .then(res => res.data)
}
// function onAddBug() {
//     const bug = {
//         title: prompt('Bug title?'),
//         severity: +prompt('Bug severity?'),
//         description: prompt('Bug description?'),
//     }




function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }



}
