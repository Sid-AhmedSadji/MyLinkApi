 import appStyle from "./CSS/FilterDiv.module.css";
function FilterDiv({ showFilter, likedOnly, deadOnly, aliveOnly, setLikedOnly, setDeadOnly, setAliveOnly }) {
  return (
    <div
      className={`${appStyle.filterDiv} ${showFilter ? appStyle.visible : ""}`}
    >
      <div className={appStyle.filterRow}>
        <p className={appStyle.texteFilter}>Show only liked</p>
        <button
          className={`${appStyle.button} ${likedOnly ? appStyle.selected : ""}`}
          onClick={() => setLikedOnly(true)}
        >
          Yes
        </button>
        <button
          className={`${appStyle.button} ${likedOnly ? "" : appStyle.selected}`}
          onClick={() => setLikedOnly(false)}
        >
          No
        </button>
      </div>

      <div className={appStyle.filterRow}>
        <p className={appStyle.texteFilter}>Show only dead link</p>
        <button
          className={`${appStyle.button} ${deadOnly ? appStyle.selected : ""}`}
          onClick={() => {setDeadOnly(true); setAliveOnly(false) }}
        >
          Yes
        </button>
        <button
          className={`${appStyle.button} ${deadOnly ? "" : appStyle.selected}`}
          onClick={() => setDeadOnly(false) }
        >
          No
        </button>
      </div>

      <div className={appStyle.filterRow}>
        <p className={appStyle.texteFilter}>Show only alive link</p>
        <button
          className={`${appStyle.button} ${aliveOnly ? appStyle.selected : ""}`}
          onClick={() => {setAliveOnly(true); setDeadOnly(false) }}
        >
          Yes
        </button>
        <button
          className={`${appStyle.button} ${aliveOnly ? "" : appStyle.selected}`}
          onClick={() => setAliveOnly(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default FilterDiv;

