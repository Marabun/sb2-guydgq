# Logging Guide

## When to Log

Always log the following events:

1. **Component State Changes**
   - Duration changes
   - Rate additions/removals
   - Position updates
   - Price scenario changes

2. **User Interactions**
   - Form submissions
   - Validation failures
   - UI state changes

3. **Error Conditions**
   - API failures
   - Validation errors
   - Runtime errors
   - Component errors

4. **Performance Metrics**
   - Render times
   - Calculation durations
   - Animation performance

## Log Levels

- `debug`: Development-only details
- `info`: Normal operations
- `warn`: Potential issues
- `error`: Critical problems

## Example Usage

```typescript
// State changes
logger.info('Loan duration changed', { 
  old: oldDuration, 
  new: newDuration 
});

// User interactions
logger.debug('Form submitted', { 
  formData,
  isValid 
});

// Errors
logger.error('Calculation failed', { 
  error: e.message,
  input: data 
});
```