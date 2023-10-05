import React, { useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date_time_selector.css";
import ThemeContext from "../ThemeContext";

function DateTimeSelector({ onDateChange }) {
  const { theme } = useContext(ThemeContext); // Use the ThemeContext to get the current theme

  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);

  // Initially set the startDate and endDate to null for "All Time"
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(today);
  const [showDatePickers, setShowDatePickers] = useState(false);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date <= endDate) {
      onDateChange(date, endDate);
    } else {
      setEndDate(date);
      onDateChange(date, date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (date >= startDate) {
      onDateChange(startDate, date);
    } else {
      setStartDate(date);
      onDateChange(date, date);
    }
  };

  const selectRange = (days) => {
    const end = new Date(today);
    const start = new Date(today);
    start.setDate(today.getDate() - days);
    setStartDate(start);
    setEndDate(end);
    onDateChange(start, end);
  };

  const selectAllTime = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange(null, null);
  };

  const toggleDatePickers = (show) => {
    setShowDatePickers(show);
  };

  return (
    <div className={`date-time-selector-container ${theme}`}>
      {" "}
      <div className="date-time-selector-buttons">
        <button onClick={() => selectAllTime()}>All Time</button>
        <button onClick={() => selectRange(365)}>1Y</button>
        <button onClick={() => selectRange(30)}>1M</button>
        <button onClick={() => selectRange(7)}>1W</button>
        <button onClick={() => selectRange(1)}>1D</button>
        <button
          onMouseEnter={() => toggleDatePickers(true)}
          onMouseLeave={() => toggleDatePickers(false)}
        >
          <i className="material-icons">edit_calendar</i>
        </button>
      </div>
      <div
        className={`date-time-selector-datepickers ${
          showDatePickers ? "show" : ""
        }`}
        onMouseEnter={() => toggleDatePickers(true)}
        onMouseLeave={() => toggleDatePickers(false)}
      >
        <div>
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            scrollableYearDropdown
          />
        </div>
        <div>
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            scrollableYearDropdown
          />
        </div>
      </div>
    </div>
  );
}

export default DateTimeSelector;
