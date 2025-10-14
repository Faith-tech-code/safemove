# File Upload Feature - SafeMove

## Overview
File upload functionality for SafeMove platform supporting driver document verification, profile pictures, and other media uploads.

## API Endpoints

### POST /v1/upload
Upload a file via multipart form data

**Authentication**: Required

**Request**:
```bash
curl -X POST http://localhost:8000/v1/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.jpg"
```

**Response**:
```json
{
  "url": "/uploads/user-id-123456.jpg",
  "mimeType": "image/jpeg",
  "filename": "license.jpg",
  "size": 245678
}
```

### POST /v1/upload/url
Upload a file from a URL

**Authentication**: Required

**Request**:
```json
{
  "url": "https://example.com/image.jpg"
}
```

**Response**:
```json
{
  "url": "/uploads/user-id-123456.jpg",
  "mimeType": "image/jpeg",
  "size": 245678
}
```

### POST /v1/upload/base64
Upload a file from base64 encoded data

**Authentication**: Required

**Request**:
```json
{
  "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "mimeType": "image/png"
}
```

**Response**:
```json
{
  "url": "/uploads/user-id-123456.png",
  "mimeType": "image/png",
  "size": 123456
}
```

### GET /v1/upload/:filename
Retrieve an uploaded file

**Authentication**: Not required

**Example**:
```
GET http://localhost:8000/v1/upload/user-id-123456.jpg
```

## Supported File Types

- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF
- **Max Size**: 5MB per file

## Use Cases

### 1. Driver License Verification
```typescript
const [upload] = useUpload();

const handleLicenseUpload = async (file: File) => {
  const result = await upload({ file });
  if (result.url) {
    // Save license URL to driver profile
    await updateDriver({ license_url: result.url });
  }
};
```

### 2. Vehicle Registration
```typescript
const handleRegistrationUpload = async (file: File) => {
  const result = await upload({ file });
  if (result.url) {
    await updateDriver({ vehicle_registration_url: result.url });
  }
};
```

### 3. Profile Picture
```typescript
const handleProfilePicture = async (file: File) => {
  const result = await upload({ file });
  if (result.url) {
    await updateUser({ profile_picture_url: result.url });
  }
};
```

### 4. Base64 Upload (Camera/Canvas)
```typescript
// From camera or canvas
const handleCameraUpload = async (base64: string) => {
  const result = await upload({ 
    base64,
    mimeType: 'image/jpeg'
  });
  if (result.url) {
    // Use uploaded image
  }
};
```

## Mobile Integration

### React Native Example
```typescript
import { useUpload } from '@/utils/hooks/useUpload';
import * as ImagePicker from 'expo-image-picker';

function DocumentUpload() {
  const [upload, { loading }] = useUpload();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const file = {
        uri: result.assets[0].uri,
        name: 'document.jpg',
        type: 'image/jpeg',
      };

      const uploadResult = await upload({ file });
      if (uploadResult.url) {
        console.log('Uploaded:', uploadResult.url);
      }
    }
  };

  return (
    <Button onPress={pickImage} disabled={loading}>
      {loading ? 'Uploading...' : 'Upload Document'}
    </Button>
  );
}
```

## Web Integration

### JavaScript/Fetch Example
```html
<input type="file" id="fileInput" accept="image/*,.pdf">
<button onclick="uploadFile()">Upload</button>

<script>
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/v1/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const result = await response.json();
  console.log('Uploaded:', result.url);
}
</script>
```

## Security Considerations

1. **File Type Validation**: Only allowed MIME types are accepted
2. **File Size Limit**: 5MB maximum to prevent abuse
3. **Authentication Required**: All uploads require valid JWT token
4. **Filename Sanitization**: Files are renamed with user ID + timestamp
5. **Storage Isolation**: Files stored in dedicated uploads directory

## Storage

### Development
Files are stored in `./uploads/` directory

### Production Recommendations
- Use cloud storage (AWS S3, Google Cloud Storage, Azure Blob)
- Configure CDN for faster delivery
- Implement automatic backups
- Set up lifecycle policies for old files

## Error Handling

### File Too Large (413)
```json
{
  "error": "Upload failed: File too large."
}
```

### Invalid File Type (400)
```json
{
  "error": "Invalid file type. Only images and PDFs are allowed."
}
```

### No File Provided (400)
```json
{
  "error": "No file provided"
}
```

### Upload Failed (500)
```json
{
  "error": "Upload failed"
}
```

## Future Enhancements

1. **Image Optimization**: Automatic compression and resizing
2. **Multiple File Upload**: Batch upload support
3. **Progress Tracking**: Upload progress callbacks
4. **Cloud Storage**: S3/GCS integration
5. **Virus Scanning**: Malware detection
6. **Thumbnail Generation**: Auto-generate previews
7. **File Management**: List/delete uploaded files API

## Dependencies

```json
{
  "@fastify/multipart": "^8.1.0",
  "@fastify/static": "^6.12.0",
  "multer": "^1.4.5-lts.1"
}
```

## Installation

```bash
npm install @fastify/multipart @fastify/static multer
```

## Testing

### Upload via cURL
```bash
# File upload
curl -X POST http://localhost:8000/v1/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@license.jpg"

# URL upload
curl -X POST http://localhost:8000/v1/upload/url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/image.jpg"}'

# Base64 upload
curl -X POST http://localhost:8000/v1/upload/base64 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"base64": "data:image/png;base64,...", "mimeType": "image/png"}'
```

## Usage in Driver Verification Flow

1. Driver registers and logs in
2. Driver uploads license photo: `POST /v1/upload`
3. Driver uploads vehicle registration: `POST /v1/upload`
4. System stores URLs in driver profile
5. Admin reviews documents
6. Admin approves/rejects driver
7. Approved drivers can start accepting trips
