
export function BugSort({ onSetSortBy }) {
    // console.log(sortBy)

    return <section className="sort-bugs main-layout">
        Sort By:
        <button onClick={() => onSetSortBy('title')}>Title</button>
        <button onClick={() => onSetSortBy('severity')}>Severity</button>
        <button onClick={() => onSetSortBy('createdAt')}>Date Created</button>
    </section>
}