import fs from 'fs'
import Cryptr from 'cryptr'

import { utilService } from './utils.service.js'


const users = utilService.readJsonFile('data/users.json') || []
const cryptr = new Cryptr(process.env.BIG_SECRET || 'secret-boon-nz1984')

export const userSrvService = {
    query,
    save,
    getLoginToken,
    checkLogin,
}

function query() {
    return Promise.resolve(users)
}

function save(newUser) {
    const user = {}
    user._id = utilService.makeId()
    user.username = newUser.username
    user.fullname = newUser.fullname
    user.password = newUser.password
    user.isAdmin = false

    users.push(user)
    return _saveUsersToFile().then(() => user)
}

function getLoginToken(user) {
    const userStr = JSON.stringify(user)
    const encryptedUserStr = cryptr.encrypt(userStr)
    return encryptedUserStr
}

function checkLogin({ username, password }) {
    var user = users.find(user =>
        user.username === username && user.password === password)

    if (user) {
        user = {
            _id: user._id,
            fullname: user.fullname,
            isAdmin: user.isAdmin
        }
    }
    return Promise.resolve(user)
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const userStr = JSON.stringify(users, null, 4)
        fs.writeFile('data/users.json', userStr, (err) => {
            if (err) {
                return console.log(err)
            }
            resolve()
        })
    })
}