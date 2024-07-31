import React from 'react';
import appStyle from './CSS/sortDiv.module.css';

function SortDiv({ sortedByLabel, sortedByIcon, changeSort, filteredLinks }) {
  return (
    <div className={appStyle.textDiv}>
      <p className={appStyle.comments}>{filteredLinks} résultats</p>
      <div className={appStyle.Icon}>
        <button className={appStyle.filterButton} onClick={changeSort}>
          sorted by: {sortedByLabel}
        </button>
        {sortedByIcon}

      </div>
    </div>
  );
}

export default SortDiv;
