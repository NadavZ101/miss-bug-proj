
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
    getFilterDefault
}


function query(filterBy = getFilterDefault()) {
    console.log(filterBy)
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .catch(err => console.log('Cannot get the bugs ', err))
}
function getById(bugId) {
    console.log('front service  - getById', bugId)
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => console.log('err:', err))
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => console.log('err: ', err))
}

function save(bug) {
    console.log(bug)
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

// function save(bug) {
//     console.log(bug)
//     const url = BASE_URL + 'save'

//     const { title, description, severity } = bug
//     const queryParams = { title, description, severity }

//     if (bug._id) {
//         queryParams._id = bug._id
//         console.log('EDIT BUG')
//         console.log(queryParams)
//     }
//     //params: queryParams -> the data in the server will be in req.query
//     return axios.get(url, { params: queryParams })
//         .then(res => res.data)
// }

// function save(bug) {
//     console.log('save', bug)
//     const url = BASE_URL + 'save'

//     let queryParams = `?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`

//     if (bug._id) {
//         queryParams += `&id=${bug._id}&createdAt=${bug.createdAt}`
//         console.log('EDIT BUG')
//         console.log(queryParams)
//     }
//     return axios.get(url + queryParams)
//         .then(res => res.data)
// }


function getFilterDefault() {
    return ({ txt: '', severity: 0 })
}


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
