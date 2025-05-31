# LoadingButton

Button component with built-in loading states and animations.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add loading-button
```

## Usage

```tsx
import { LoadingButton } from 'bigblocks';

export default function Form() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await submitForm();
    setLoading(false);
  };

  return (
    <LoadingButton
      loading={loading}
      onClick={handleSubmit}
    >
      Submit
    </LoadingButton>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| loading | `boolean` | `false` | Loading state |
| children | `ReactNode` | - | Button content |
| onClick | `() => void` | - | Click handler |
| variant | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Button variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| loadingText | `string` | - | Text during loading |
| spinnerPosition | `'left' \| 'right'` | `'left'` | Spinner position |
| disabled | `boolean` | `false` | Disable button |
| fullWidth | `boolean` | `false` | Full width button |
| type | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |
| className | `string` | - | Additional CSS classes |

## Features

- **Loading Animation**: Built-in spinner
- **Loading Text**: Optional loading message
- **Auto Disable**: Disabled during loading
- **Multiple Variants**: Primary, secondary, etc.
- **Flexible Sizing**: Small to large options
- **Accessibility**: ARIA states included

## Examples

### Basic Loading

```tsx
<LoadingButton
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Save Changes
</LoadingButton>
```

### With Loading Text

```tsx
<LoadingButton
  loading={loading}
  loadingText="Saving..."
  onClick={handleSave}
>
  Save
</LoadingButton>
```

### Different Variants

```tsx
// Primary (default)
<LoadingButton variant="primary" loading={loading}>Submit</LoadingButton>

// Secondary
<LoadingButton variant="secondary" loading={loading}>Cancel</LoadingButton>

// Outline
<LoadingButton variant="outline" loading={loading}>Learn More</LoadingButton>

// Ghost
<LoadingButton variant="ghost" loading={loading}>Delete</LoadingButton>
```

### Different Sizes

```tsx
// Small
<LoadingButton size="sm" loading={loading}>Small</LoadingButton>

// Medium (default)
<LoadingButton size="md" loading={loading}>Medium</LoadingButton>

// Large
<LoadingButton size="lg" loading={loading}>Large</LoadingButton>
```

### Spinner Position

```tsx
// Left (default)
<LoadingButton
  loading={loading}
  spinnerPosition="left"
>
  Processing
</LoadingButton>

// Right
<LoadingButton
  loading={loading}
  spinnerPosition="right"
>
  Next
</LoadingButton>
```

### Full Width

```tsx
<LoadingButton
  loading={loading}
  fullWidth
  onClick={handleSubmit}
>
  Submit Form
</LoadingButton>
```

### In Forms

```tsx
function LoginForm() {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" />
      <input type="password" />
      
      <LoadingButton
        type="submit"
        loading={loading}
        loadingText="Signing in..."
        fullWidth
      >
        Sign In
      </LoadingButton>
    </form>
  );
}
```

### With Icon

```tsx
<LoadingButton
  loading={loading}
  onClick={handleDownload}
>
  <DownloadIcon className="mr-2" />
  Download
</LoadingButton>
```

### Async Handler

```tsx
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  try {
    await someAsyncOperation();
    toast.success('Success!');
  } catch (error) {
    toast.error('Failed');
  } finally {
    setLoading(false);
  }
};

<LoadingButton
  loading={loading}
  onClick={handleClick}
>
  Perform Action
</LoadingButton>
```

## Styling

Customize appearance:

```tsx
<LoadingButton
  loading={loading}
  className="bg-gradient-to-r from-blue-500 to-purple-500"
  onClick={handleClick}
>
  Gradient Button
</LoadingButton>
```

## Accessibility

- `aria-busy` during loading
- `aria-disabled` when disabled
- Keyboard navigation support
- Screen reader announcements

## Best Practices

1. Always show loading state for async operations
2. Provide loading text for clarity
3. Disable form during submission
4. Handle errors appropriately
5. Reset loading state in finally block

## Related Components

- [AuthButton](/components/auth-button) - Authentication button
- [SendBSVButton](/components/send-bsv-button) - Send with loading
- [Modal](/components/modal) - Loading in modals