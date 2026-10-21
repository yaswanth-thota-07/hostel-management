import { useState } from "react";

const STATUS_OPTIONS = ["All statuses", "Open", "In Progress", "Resolved", "Reopened"];

export default function ComplaintFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);

  return (
    <div className="complaint-filters">
      <div className="complaint-search">
        <label htmlFor="complaint-search-input" className="sr-only">
          Search complaints
        </label>
        <input
          id="complaint-search-input"
          type="search"
          className="field-input complaint-search-input"
          placeholder="Search complaints..."
        />
      </div>

      <div className="complaint-status-filter">
        <button
          type="button"
          className="complaint-status-trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {selectedStatus}
          <span className="complaint-status-caret" aria-hidden="true" />
        </button>

        {isOpen && (
          <ul className="complaint-status-menu" role="listbox">
            {STATUS_OPTIONS.map((option) => (
              <li key={option} role="option" aria-selected={option === selectedStatus}>
                <button
                  type="button"
                  className="complaint-status-option"
                  onClick={() => {
                    setSelectedStatus(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
