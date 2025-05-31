# Modal

Reusable modal dialog component with animations, accessibility features, and flexible content.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add modal
```

## Usage

```tsx
import { Modal } from 'bigblocks';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
      >
        <p>Are you sure you want to continue?</p>
        <div className="flex gap-4 mt-6">
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={handleConfirm}>Confirm</button>
        </div>
      </Modal>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | `boolean` | - | Modal visibility |
| onClose | `() => void` | - | Close callback |
| children | `ReactNode` | - | Modal content |
| title | `string` | - | Modal title |
| description | `string` | - | Modal description |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| closeOnOverlayClick | `boolean` | `true` | Close on backdrop click |
| closeOnEscape | `boolean` | `true` | Close on Escape key |
| showCloseButton | `boolean` | `true` | Show X button |
| className | `string` | - | Additional CSS classes |
| overlayClassName | `string` | - | Overlay CSS classes |

## Features

- **Smooth Animations**: Fade and scale transitions
- **Accessibility**: Focus trap, ARIA labels
- **Keyboard Support**: Escape to close
- **Flexible Sizing**: Multiple size presets
- **Portal Rendering**: Renders at body root
- **Scroll Lock**: Prevents body scroll
- **Customizable**: Styling and behavior

## Examples

### Basic Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
>
  <p>Modal content goes here</p>
</Modal>
```

### With Title and Description

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Delete Item"
  description="This action cannot be undone."
>
  <div className="flex gap-4 mt-6">
    <button onClick={handleClose}>Cancel</button>
    <button onClick={handleDelete} className="text-red-600">
      Delete
    </button>
  </div>
</Modal>
```

### Different Sizes

```tsx
// Small
<Modal size="sm" isOpen={isOpen} onClose={handleClose}>
  <p>Small modal</p>
</Modal>

// Medium (default)
<Modal size="md" isOpen={isOpen} onClose={handleClose}>
  <p>Medium modal</p>
</Modal>

// Large
<Modal size="lg" isOpen={isOpen} onClose={handleClose}>
  <p>Large modal</p>
</Modal>

// Extra Large
<Modal size="xl" isOpen={isOpen} onClose={handleClose}>
  <p>Extra large modal</p>
</Modal>

// Full Screen
<Modal size="full" isOpen={isOpen} onClose={handleClose}>
  <p>Full screen modal</p>
</Modal>
```

### Prevent Close

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  closeOnOverlayClick={false}
  closeOnEscape={false}
  showCloseButton={false}
>
  <p>This modal must be closed programmatically</p>
  <button onClick={handleClose}>Close</button>
</Modal>
```

### Form Modal

```tsx
function EditProfileModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name });
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
    >
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full p-2 border rounded"
        />
        
        <div className="flex gap-4 mt-6">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
```

### Confirmation Modal

```tsx
function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm"
      size="sm"
    >
      <p>{message}</p>
      
      <div className="flex gap-4 mt-6 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
```

### Custom Styling

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  className="bg-gradient-to-b from-purple-50 to-white"
  overlayClassName="bg-purple-900/50"
>
  <p>Custom styled modal</p>
</Modal>
```

## Accessibility

- Focus trapped within modal
- First focusable element auto-focused
- Escape key support
- ARIA attributes for screen readers
- Semantic HTML structure

## Animation States

1. **Opening**: Fade in overlay, scale up modal
2. **Open**: Full opacity and scale
3. **Closing**: Fade out and scale down
4. **Closed**: Removed from DOM

## Best Practices

1. Always provide onClose handler
2. Include title for context
3. Make actions clear (Cancel/Confirm)
4. Use appropriate size for content
5. Consider mobile viewports

## Related Components

- [LoadingButton](/components/loading-button) - For modal actions
- [OAuthConflictModal](/components/oauth-conflict-modal) - Specialized modal
- [ProfileEditor](/components/profile-editor) - Often used in modals