import { Button } from "react-bootstrap";

export default function TripFilters({
  sortFilter,
  maxExpense,
  onSortChange,
  onMaxExpenseChange,
  stateFilter,
  states,
  onStateFilterChange,
  onReset,
}) {
  return (
    <div className="card p-3 mb-4">
      <h5>Filter Trips</h5>

      <div className="row">
        {/* Sort Dropdown */}
        <div className="col-md-4 mb-2">
          <label>Sort By</label>
          <select
            className="form-select"
            value={sortFilter}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="none">None</option>
            <option value="latest">Latest Trip</option>
            <option value="earliest">Earliest Trip</option>
            <option value="highestExpense">Highest Expense</option>
            <option value="lowestExpense">Lowest Expense</option>
          </select>
        </div>

        {/* Max Expense Filter */}
        <div className="col-md-4 mb-2">
          <label>Max Total Expense ($)</label>
          <input
            type="number"
            className="form-control"
            value={maxExpense}
            onChange={(e) => onMaxExpenseChange(e.target.value)}
            placeholder="e.g., 1000"
          />
        </div>
        
        {/* State Filter */}
        <div className="col-md-4 mb-2">
          <label>Filter by State</label>
          <select
            className="form-select"
            value={stateFilter}
            onChange={(e) => onStateFilterChange(e.target.value)}
          >
            <option value="">All States</option>

            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="col-md-4 mb-2 d-flex align-items-end">
          <Button variant="secondary" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
