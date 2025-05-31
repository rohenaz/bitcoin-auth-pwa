# CreateListingButton

Create marketplace listings on the Bitcoin blockchain with customizable forms and metadata.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add create-listing-button
```

## Usage

```tsx
import { CreateListingButton } from 'bigblocks';

export default function Marketplace() {
  return (
    <CreateListingButton
      onCreateListing={(listing) => {
        console.log('Created listing:', listing);
        // Refresh marketplace
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onCreateListing | `(listing: Listing) => void` | - | Success callback |
| onError | `(error: Error) => void` | - | Error callback |
| categories | `string[]` | Default categories | Available categories |
| maxImages | `number` | `5` | Maximum image uploads |
| requiresApproval | `boolean` | `false` | Require approval |
| feeAmount | `number` | `0.001` | Listing fee in BSV |
| variant | `'button' \| 'card' \| 'inline'` | `'button'` | Display variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| className | `string` | - | Additional CSS classes |

## Listing Interface

```typescript
interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'BSV' | 'USD';
  category: string;
  images: string[];
  seller: {
    address: string;
    name?: string;
  };
  metadata?: {
    condition?: 'new' | 'used' | 'refurbished';
    location?: string;
    shipping?: boolean;
  };
  txid: string;
  timestamp: number;
}
```

## Features

- **On-chain Listings**: Permanent marketplace
- **Image Upload**: Multiple images support
- **Category System**: Organized listings
- **Price Options**: BSV or USD pricing
- **Rich Metadata**: Detailed item info
- **Preview Mode**: Review before posting

## Examples

### Basic Button

```tsx
<CreateListingButton
  onCreateListing={(listing) => {
    toast.success('Listing created!');
    refreshMarketplace();
  }}
/>
```

### Card Variant

```tsx
<CreateListingButton
  variant="card"
  onCreateListing={handleCreateListing}
/>
```

### Custom Categories

```tsx
<CreateListingButton
  categories={[
    'Electronics',
    'Books',
    'Collectibles',
    'Services',
    'Other'
  ]}
  onCreateListing={handleCreateListing}
/>
```

### With Custom Fee

```tsx
<CreateListingButton
  feeAmount={0.005} // 0.005 BSV listing fee
  onCreateListing={handleCreateListing}
/>
```

### Inline Form

```tsx
<CreateListingButton
  variant="inline"
  onCreateListing={handleCreateListing}
  className="w-full"
/>
```

### With Error Handling

```tsx
<CreateListingButton
  onCreateListing={handleSuccess}
  onError={(error) => {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      toast.error('Not enough BSV for listing fee');
    } else if (error.code === 'UPLOAD_FAILED') {
      toast.error('Failed to upload images');
    } else {
      toast.error(error.message);
    }
  }}
/>
```

### In Marketplace Page

```tsx
function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Marketplace</h1>
        <CreateListingButton
          onCreateListing={async (listing) => {
            // Add optimistically
            setListings([listing, ...listings]);
            
            // Track analytics
            analytics.track('listing_created', {
              category: listing.category,
              price: listing.price
            });
          }}
        />
      </div>
      
      <MarketTable listings={listings} />
    </div>
  );
}
```

### Form Fields

Default form includes:
1. Title (required)
2. Description (required)
3. Price (required)
4. Currency selector
5. Category dropdown
6. Images upload
7. Condition selector
8. Location (optional)
9. Shipping toggle

### Custom Validation

```tsx
<CreateListingButton
  onCreateListing={handleCreateListing}
  validateListing={(listing) => {
    if (listing.price < 0.001) {
      throw new Error('Minimum price is 0.001 BSV');
    }
    if (listing.images.length === 0) {
      throw new Error('At least one image required');
    }
    return true;
  }}
/>
```

## Image Handling

- Formats: JPEG, PNG, WebP
- Max size: 5MB per image
- Auto-compression
- IPFS upload integration
- Thumbnail generation

## Listing Fee

- Default: 0.001 BSV
- Covers blockchain storage
- Non-refundable
- Shown before confirmation

## Preview Mode

Before submitting:
1. Review all details
2. Check images
3. Verify pricing
4. Confirm fee
5. Submit to blockchain

## Styling

```tsx
<CreateListingButton
  className="bg-green-600 hover:bg-green-700"
  onCreateListing={handleCreateListing}
/>
```

## Market Categories

Default categories:
- Electronics
- Fashion
- Home & Garden
- Sports & Outdoors
- Books & Media
- Collectibles
- Services
- Other

## Related Components

- [BuyListingButton](/components/buy-listing-button) - Purchase items
- [MarketTable](/components/market-table) - Display listings
- [QuickListButton](/components/quick-list-button) - Quick listing