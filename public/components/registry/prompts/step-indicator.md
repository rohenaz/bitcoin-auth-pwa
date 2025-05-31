# StepIndicator

Visual progress indicator for multi-step processes with customizable styling.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add step-indicator
```

## Usage

```tsx
import { StepIndicator } from 'bigblocks';

export default function SignupProcess() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['Account', 'Profile', 'Verify', 'Complete'];

  return (
    <StepIndicator
      steps={steps}
      currentStep={currentStep}
      onStepClick={(step) => {
        if (step <= currentStep) {
          setCurrentStep(step);
        }
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| steps | `string[]` | - | Step labels |
| currentStep | `number` | `1` | Current step (1-indexed) |
| onStepClick | `(step: number) => void` | - | Step click handler |
| completedSteps | `number[]` | - | Manually set completed steps |
| variant | `'linear' \| 'circular' \| 'minimal'` | `'linear'` | Visual variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| showLabels | `boolean` | `true` | Show step labels |
| allowClickBack | `boolean` | `true` | Allow clicking previous steps |
| className | `string` | - | Additional CSS classes |

## Features

- **Progress Tracking**: Visual step completion
- **Interactive Steps**: Click to navigate
- **Multiple Variants**: Linear, circular, minimal
- **Responsive Design**: Mobile optimized
- **Customizable**: Colors and styling
- **Accessibility**: ARIA compliant

## Examples

### Basic Steps

```tsx
<StepIndicator
  steps={['Step 1', 'Step 2', 'Step 3']}
  currentStep={2}
/>
```

### With Navigation

```tsx
const [step, setStep] = useState(1);

<StepIndicator
  steps={['Account', 'Details', 'Confirm']}
  currentStep={step}
  onStepClick={(clickedStep) => {
    // Only allow going back
    if (clickedStep < step) {
      setStep(clickedStep);
    }
  }}
/>
```

### Circular Variant

```tsx
<StepIndicator
  steps={['1', '2', '3', '4']}
  currentStep={3}
  variant="circular"
/>
```

### Minimal Variant

```tsx
<StepIndicator
  steps={steps}
  currentStep={currentStep}
  variant="minimal"
  showLabels={false}
/>
```

### Custom Completed Steps

```tsx
<StepIndicator
  steps={['Start', 'Middle', 'End']}
  currentStep={2}
  completedSteps={[1, 3]} // Mark specific steps as complete
/>
```

### Different Sizes

```tsx
// Small
<StepIndicator size="sm" steps={steps} currentStep={1} />

// Medium (default)
<StepIndicator size="md" steps={steps} currentStep={2} />

// Large
<StepIndicator size="lg" steps={steps} currentStep={3} />
```

### Without Labels

```tsx
<StepIndicator
  steps={['', '', '', '']}
  currentStep={2}
  showLabels={false}
/>
```

### Disabled Navigation

```tsx
<StepIndicator
  steps={steps}
  currentStep={currentStep}
  allowClickBack={false}
/>
```

### In Form Wizard

```tsx
function FormWizard() {
  const [step, setStep] = useState(1);
  const steps = ['Basic Info', 'Address', 'Payment', 'Review'];
  
  const nextStep = () => setStep(s => Math.min(s + 1, steps.length));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  return (
    <div>
      <StepIndicator
        steps={steps}
        currentStep={step}
        onStepClick={(s) => {
          if (s < step) setStep(s); // Only allow going back
        }}
      />
      
      <div className="mt-8">
        {step === 1 && <BasicInfoForm />}
        {step === 2 && <AddressForm />}
        {step === 3 && <PaymentForm />}
        {step === 4 && <ReviewForm />}
      </div>
      
      <div className="flex justify-between mt-8">
        <button onClick={prevStep} disabled={step === 1}>
          Previous
        </button>
        <button onClick={nextStep} disabled={step === steps.length}>
          {step === steps.length ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
```

## Visual States

1. **Completed**: Green checkmark
2. **Current**: Blue/highlighted
3. **Upcoming**: Gray/muted
4. **Error**: Red (with error prop)

## Styling

```tsx
<StepIndicator
  steps={steps}
  currentStep={currentStep}
  className="bg-gray-100 p-4 rounded-lg"
/>
```

## Accessibility

- `role="navigation"` on container
- `aria-current="step"` on current
- `aria-label` for step numbers
- Keyboard navigation support

## Animation

- Progress bar animation
- Step transition effects
- Smooth color changes
- Optional pulse on current

## Mobile Behavior

- Responsive sizing
- Touch-friendly tap targets
- Horizontal scroll if needed
- Compact labels on small screens

## Related Components

- [SignupFlow](/components/signup-flow) - Uses StepIndicator
- [LoadingButton](/components/loading-button) - For step actions
- [Modal](/components/modal) - Multi-step modals