import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarPicker = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div>
            <h2>Select a Date</h2>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select a date"
            />
        </div>
    );
};

export default CalendarPicker;
