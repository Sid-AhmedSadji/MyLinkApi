import appStyle from "./CSS/sortDiv.module.css"
function sortDiv({ sortedBy, changeSort, filteredLinks }) {
    return (
        <div className={appStyle.textDiv}>
        <p className={appStyle.comments}> {filteredLinks} resultats </p>
        <button className={appStyle.filterButton} onClick={changeSort}>
          sorted by: {sortedBy}
        </button>
      </div>
    )
}

export default sortDiv
