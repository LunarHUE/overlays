# @lunarhue/overlays

Type-safe overlay management for React and Next.js with Zod schema validation.

## Features

- **Type-safe**: Full TypeScript support with Zod schema validation
- **Flexible**: Support for props, callbacks, and slots
- **Stacking**: FILO queue system for multiple overlays
- **Framework agnostic**: Works with React and Next.js
- **Portal support**: Render overlays in a portal or inline
- **Lightweight**: Minimal dependencies

## Installation

```bash
npm install @lunarhue/overlays zod
```

```bash
pnpm add @lunarhue/overlays zod
```

```bash
yarn add @lunarhue/overlays zod
```

## Quick Start

### 1. Set up the provider

Wrap your app with the `OverlayProvider`:

```tsx
import { OverlayProvider } from '@lunarhue/overlays';

function App() {
  return (
    <OverlayProvider>
      {/* Your app */}
    </OverlayProvider>
  );
}
```

### 2. Define an overlay

Create a type-safe overlay definition:

```tsx
import { defineOverlay } from '@lunarhue/overlays';
import { z } from 'zod';

const confirmDialog = defineOverlay({
  id: 'confirm-dialog',
  props: z.object({
    title: z.string(),
    message: z.string(),
  }),
  callbacks: {
    onConfirm: {},
    onCancel: {},
  },
  Component: ({ props, close, callbacks }) => (
    <div className="dialog">
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <button onClick={() => { callbacks.onConfirm(); close(); }}>
        Confirm
      </button>
      <button onClick={() => { callbacks.onCancel(); close(); }}>
        Cancel
      </button>
    </div>
  ),
});
```

### 3. Use the overlay

Use the `useOverlay` hook to open your overlay:

```tsx
import { useOverlay } from '@lunarhue/overlays';

function MyComponent() {
  const openDialog = useOverlay(confirmDialog);

  const handleDelete = () => {
    openDialog({
      props: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this item?',
      },
      callbacks: {
        onConfirm: () => console.log('Confirmed!'),
        onCancel: () => console.log('Cancelled'),
      },
    });
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## Advanced Usage

### Callbacks with Input/Output

Define callbacks with typed inputs and outputs:

```tsx
const formDialog = defineOverlay({
  id: 'form-dialog',
  props: z.object({
    title: z.string(),
  }),
  callbacks: {
    onSubmit: {
      input: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    },
  },
  Component: ({ props, callbacks, close }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      callbacks.onSubmit({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
      });
      close();
    };

    return (
      <form onSubmit={handleSubmit}>
        <h2>{props.title}</h2>
        <input name="name" required />
        <input name="email" type="email" required />
        <button type="submit">Submit</button>
      </form>
    );
  },
});
```

### Slots

Pass React components as slots:

```tsx
const modal = defineOverlay({
  id: 'modal',
  props: z.object({
    title: z.string(),
    content: z.string().optional(),
  }),
  slots: ['content'] as const,
  Component: ({ props, slots, close }) => (
    <div className="modal">
      <h2>{props.title}</h2>
      {slots.content || <p>{props.content}</p>}
      <button onClick={close}>Close</button>
    </div>
  ),
});

// Usage
function MyComponent() {
  const openModal = useOverlay(modal);

  return (
    <button
      onClick={() =>
        openModal({
          props: { title: 'Custom Modal' },
          slots: {
            content: <CustomComponent />,
          },
        })
      }
    >
      Open Modal
    </button>
  );
}
```

### Default Props

Provide default values for props:

```tsx
const notification = defineOverlay({
  id: 'notification',
  props: z.object({
    message: z.string(),
    type: z.enum(['info', 'success', 'error']),
  }),
  defaultProps: {
    type: 'info',
  },
  Component: ({ props, close }) => (
    <div className={`notification notification-${props.type}`}>
      {props.message}
      <button onClick={close}>×</button>
    </div>
  ),
});
```

### Stacking Overlays (FILO Queue)

Overlays automatically stack on top of each other. This is especially powerful when you need to open a new overlay from within an existing overlay - a common pattern for workflows like "add new item" from a form.

```tsx
// Quick add company overlay
const quickAddCompany = defineOverlay({
  id: 'quick-add-company',
  props: z.object({
    name: z.string().optional(),
  }),
  callbacks: {
    onSave: {
      input: z.object({
        companyId: z.string(),
        companyName: z.string(),
      }),
    },
  },
  Component: ({ props, callbacks, close }) => {
    const [name, setName] = useState(props.name || '');

    const handleSave = () => {
      const companyId = crypto.randomUUID();
      callbacks.onSave({ companyId, companyName: name });
      close();
    };

    return (
      <Dialog open onOpenChange={open => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add Company</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Company Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <DialogFooter>
            <Button onClick={close} variant="outline">Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
});

// Contact form that can open the company overlay
const contactForm = defineOverlay({
  id: 'contact-form',
  props: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
  }),
  callbacks: {
    onSubmit: {
      input: z.object({
        name: z.string(),
        email: z.string(),
        companyId: z.string().optional(),
      }),
    },
  },
  Component: ({ props, callbacks, close }) => {
    const [name, setName] = useState(props.name || '');
    const [email, setEmail] = useState(props.email || '');
    const [companyId, setCompanyId] = useState<string>();

    // Open another overlay from within this overlay!
    const openQuickAdd = useOverlay(quickAddCompany);

    const handleQuickAddCompany = () => {
      openQuickAdd({
        props: {},
        callbacks: {
          onSave: ({ companyId, companyName }) => {
            setCompanyId(companyId);
            console.log('Added company:', companyName);
            // The quick add overlay closes, revealing this form again
          },
        },
      });
    };

    return (
      <Dialog open onOpenChange={open => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Select value={companyId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
              </Select>
              {/* Opens a new overlay on top of this one */}
              <Button onClick={handleQuickAddCompany} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={close} variant="outline">Cancel</Button>
            <Button onClick={() => {
              callbacks.onSubmit({ name, email, companyId });
              close();
            }}>
              Save Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
});
```

**Key behaviors:**
- `useOverlay` can be called from within an overlay component
- New overlays stack on top with automatic z-index management
- Closing the top overlay reveals the one underneath
- Perfect for "quick add" or "select or create" workflows
- Each overlay instance gets a unique ID (e.g., `contact-form-1`, `quick-add-company-2`)

### Portal Configuration

Control where overlays are rendered:

```tsx
<OverlayProvider
  portal={{
    enabled: true,
    container: document.getElementById('overlay-root'),
    className: 'overlay-container',
  }}
>
  {/* Your app */}
</OverlayProvider>
```

## API Reference

### `defineOverlay(definition)`

Creates a type-safe overlay definition.

**Parameters:**
- `id` - Unique identifier for the overlay
- `props` - Zod schema for overlay props
- `callbacks` - Optional callback definitions with input/output schemas
- `slots` - Optional array of prop keys that can be passed as React nodes
- `defaultProps` - Optional default values for props
- `Component` - React component that renders the overlay

### `useOverlay(overlayDefinition)`

Hook that returns a function to open the overlay.

**Returns:** A function that accepts:
- `props` - Props matching the overlay's schema (slot props are optional)
- `callbacks` - Optional callback implementations
- `slots` - Optional React nodes for slots

### `OverlayProvider`

Provider component that manages overlay state.

**Props:**
- `children` - React children
- `portal` - Portal configuration (boolean or object)

### `useOverlayContext()`

Access the overlay context directly for advanced use cases.

**Returns:**
- `open` - Function to open an overlay
- `close` - Function to close the active overlay
- `closeAll` - Function to close all overlays

## License

MIT

## Contributing

Issues and pull requests are welcome at [github.com/LunarHUE/overlays](https://github.com/LunarHUE/overlays)
