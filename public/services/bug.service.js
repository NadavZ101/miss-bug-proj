
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
    getFilterDefault,
    getSortDefault
}

function query(filterBy = getFilterDefault(), sortBy = getSortDefault()) {
    console.log('sortBy: ', sortBy)
    const params = { ...filterBy, ...sortBy }
    return axios.get(BASE_URL, { params })
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


function getFilterDefault() {
    return ({ txt: '', severity: 0 })
}

function getSortDefault() {
    return ({ title: '', severity: 0, createdAt: 0, sortDir: -1 })
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
