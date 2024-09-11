import React from 'react';

const ColorPicker = ({ name, value, onChange }) => {
    return (
        <input
            type="color"
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default ColorPicker;
