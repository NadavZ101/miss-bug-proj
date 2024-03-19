import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { utilService } from '../services/util.service.js'

const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getFilterDefault())
    const [sortBy, setSortBy] = useState(bugService.getSortDefault())
    const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy).then((bugs) => setBugs(bugs))
    }

    function onSetFilter(fieldsToUpdate) {
        setFilterBy((prevFilter) => {
            if (prevFilter.pageIdx !== undefined) prevFilter.pageIdx = 0
            return ({ ...prevFilter, ...fieldsToUpdate })
        })
    }

    function onTogglePagination() {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            pageIdx: filterBy.pageIdx === undefined ? 0 : undefined
        }))
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        let nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx < 0) nextPageIdx = 0
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: nextPageIdx }))
    }


    function onSetSortBy(newSort) {
        console.log('newSort = ', newSort)
        const dir = sortBy[newSort] === 1 ? - 1 : 1
        const newSortBy = { [newSort]: dir }
        setSortBy(newSortBy)
        console.log('newSort after set = ', newSortBy)
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?'),
            labels: utilService.getLabels(3)
        }
        console.log(bug)
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([savedBug, ...bugs])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const description = prompt('New description?')
        const bugToSave = { ...bug, severity, description }
        console.log(bugToSave)
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }



    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <section className="pagination">
                    <button className="btn" onClick={() => onChangePage(-1)}>◀︎</button>
                    <span>{filterBy.pageIdx + 1 || 'no pagination'}</span>
                    <button className="btn" onClick={() => onChangePage(1)}>▶︎</button>
                    <button className="btn" onClick={onTogglePagination}>Toggle Pagination</button>

                </section>
                <BugFilter onSetFilter={debounceOnSetFilter.current} filterBy={filterBy} />
                <BugSort onSetSortBy={onSetSortBy} sortBy={sortBy} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
