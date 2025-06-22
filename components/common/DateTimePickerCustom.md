# DateTimePickerCustom Usage Guide

## Overview

`DateTimePickerCustom` is a unified date-time picker component that works consistently across iOS and Android platforms. It handles all the platform-specific differences and provides a clean, easy-to-use interface.

## Import

```javascript
import DateTimePickerCustom from "../common/DateTimePickerCustom";
```

## Basic Usage

### DateTime Picker (Date + Time)

```javascript
const [selectedDateTime, setSelectedDateTime] = useState(new Date());

<DateTimePickerCustom
  value={selectedDateTime}
  onChange={setSelectedDateTime}
  mode="datetime"
  label="Select Date and Time"
  required={true}
  minimumDate={new Date()}
/>;
```

### Date Only Picker

```javascript
const [selectedDate, setSelectedDate] = useState(new Date());

<DateTimePickerCustom
  value={selectedDate}
  onChange={setSelectedDate}
  mode="date"
  label="Select Date"
  placeholder="Choose a date"
/>;
```

### Time Only Picker

```javascript
const [selectedTime, setSelectedTime] = useState(new Date());

<DateTimePickerCustom
  value={selectedTime}
  onChange={setSelectedTime}
  mode="time"
  label="Select Time"
  placeholder="Choose time"
/>;
```

## Props

| Prop             | Type     | Default            | Description                                |
| ---------------- | -------- | ------------------ | ------------------------------------------ |
| `value`          | Date     | null               | The selected date/time value               |
| `onChange`       | function | required           | Callback when date/time changes            |
| `mode`           | string   | 'datetime'         | Picker mode: 'date', 'time', or 'datetime' |
| `label`          | string   | null               | Label text displayed above the picker      |
| `placeholder`    | string   | 'Chọn ngày và giờ' | Placeholder text when no value             |
| `required`       | boolean  | false              | Shows \* indicator if true                 |
| `disabled`       | boolean  | false              | Disables the picker                        |
| `minimumDate`    | Date     | null               | Minimum selectable date                    |
| `maximumDate`    | Date     | null               | Maximum selectable date                    |
| `containerStyle` | object   | null               | Custom container styling                   |
| `buttonStyle`    | object   | null               | Custom button styling                      |

## Platform Behavior

### iOS

- Shows a modal with native spinner picker
- Supports datetime mode directly
- Provides cancel/confirm buttons
- Shows preview of selected value

### Android

- For datetime mode: shows date picker first, then time picker
- For date/time only: shows respective picker directly
- Uses native Android picker dialogs
- Handles user cancellation properly

## Integration Examples

### In a Form Component

```javascript
const [formData, setFormData] = useState({
  appointmentTime: new Date(),
  // other fields...
});

<DateTimePickerCustom
  value={formData.appointmentTime}
  onChange={(date) =>
    setFormData((prev) => ({ ...prev, appointmentTime: date }))
  }
  mode="datetime"
  label="Appointment Time"
  required={true}
  minimumDate={new Date()}
  maximumDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days
/>;
```

### With Validation

```javascript
const [eventDate, setEventDate] = useState(null);
const [error, setError] = useState("");

const handleDateChange = (date) => {
  setEventDate(date);
  setError(""); // Clear error when user selects a date
};

const validateDate = () => {
  if (!eventDate) {
    setError("Please select a date");
    return false;
  }
  return true;
};

<DateTimePickerCustom
  value={eventDate}
  onChange={handleDateChange}
  mode="date"
  label="Event Date"
  required={true}
/>;
{
  error && <Text className="text-red-500 text-sm mt-1">{error}</Text>;
}
```

## Features

### ✅ Cross-Platform Compatibility

- Consistent behavior on iOS and Android
- Platform-appropriate UI elements
- Proper handling of user interactions

### ✅ Flexible Modes

- Date only selection
- Time only selection
- Combined date-time selection

### ✅ User Experience

- Clear visual feedback
- Helpful placeholder text
- Platform-specific instructions
- Proper error handling

### ✅ Accessibility

- Proper labels and descriptions
- Touch-friendly interface
- Screen reader compatible

### ✅ Validation Support

- Min/max date constraints
- Required field indication
- Easy integration with form validation

## Troubleshooting

### Common Issues

1. **Date not updating on Android**

   - Ensure you're handling the onChange callback properly
   - Check that the value prop is being updated

2. **iOS picker not showing**

   - Verify that the component is not wrapped in a ScrollView that might interfere
   - Check for conflicting modal components

3. **Date format issues**
   - The component expects and returns JavaScript Date objects
   - Convert strings to Date objects before passing to value prop

### Best Practices

1. **Always provide onChange handler**

   ```javascript
   // ✅ Good
   <DateTimePickerCustom onChange={handleDateChange} />

   // ❌ Bad - missing onChange
   <DateTimePickerCustom />
   ```

2. **Set appropriate min/max dates**

   ```javascript
   // ✅ Good - prevent past dates for appointments
   <DateTimePickerCustom
     minimumDate={new Date()}
     maximumDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
   />
   ```

3. **Use meaningful labels**

   ```javascript
   // ✅ Good
   <DateTimePickerCustom label="Appointment Date" />

   // ❌ Bad - generic label
   <DateTimePickerCustom label="Date" />
   ```

## Dependencies

- `@react-native-community/datetimepicker`
- `lucide-react-native` (for icons)

## License

This component is part of the WDP301-native project.
