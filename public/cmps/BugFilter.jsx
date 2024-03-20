
const { useState, useEffect } = React

export function BugFilter({ onSetFilter, filterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    const labels = [
        'critical', 'need-CR', 'dev-branch', 'easy', 'dev-main',
        'medium', 'dev-master', 'hard-rest', 'need-coffee', 'dev-tool',
        'need-tea', 'light', 'need-pizza', 'need-VC'
    ]

    function handleInput({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value : target.value
        setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { txt, severity } = filterByToEdit
    return <section className="bug-filter full main-layout">
        <h2>Filter Bugs</h2>

        <form onSubmit={onSubmitFilter}>
            <label htmlFor='txt'>Title</label>
            <input
                value={txt}
                onChange={handleInput}
                name='txt'
                id='txt'
                type='text'
                placeholder="By Title"
            />

            <label htmlFor='severity'>Severity</label>
            <input
                value={severity}
                onChange={handleInput}
                name='severity'
                id='severity'
                type='number'
                placeholder="By Severity"
            />

            {/* <div>
                <label>Labels:</label>
                {labels.map(label => (
                    <div key={label}>
                        <input
                            type="checkbox"
                            id={label}
                            name={label}
                            checked={filterByToEdit.labels?.includes(label)}
                            onChange={handleInput}
                        />
                        <label htmlFor={label}>{label}</label>
                    </div>
                ))}
            </div> */}

            <button>Filter</button>
        </form>
    </section>
}