# Social Login Integration

This document explains how social login (Google, Microsoft) is integrated into the TitanEd authentication system.

## Overview

The social login feature automatically displays social authentication providers (Google, Microsoft) based on the configuration received from the `/api/mfe_context` API endpoint. The system uses the existing `ThirdPartyAuth` component infrastructure to handle social login providers.

## How It Works

### 1. API Integration

The system fetches social login providers from the backend API:

**API Endpoint**: `/api/mfe_context`

**Response Structure**:
```json
{
  "contextData": {
    "providers": [
      {
        "id": "oa2-google-oauth2",
        "name": "Google",
        "iconClass": "fa-google-plus",
        "iconImage": null,
        "skipHintedLogin": false,
        "skipRegistrationForm": true,
        "loginUrl": "/auth/login/google-oauth2/?auth_entry=login&next=%2Fdashboard",
        "registerUrl": "/auth/login/google-oauth2/?auth_entry=register&next=%2Fdashboard"
      },
      {
        "id": "oa2-azuread-oauth2",
        "name": "Microsoft",
        "iconClass": "fa-microsoft",
        "iconImage": null,
        "skipHintedLogin": false,
        "skipRegistrationForm": true,
        "loginUrl": "/auth/login/azuread-oauth2/?auth_entry=login&next=%2Fdashboard",
        "registerUrl": "/auth/login/azuread-oauth2/?auth_entry=register&next=%2Fdashboard"
      }
    ]
  }
}
```

### 2. Component Integration

The system uses the existing `ThirdPartyAuth` component which:
- Automatically displays social login buttons based on the `providers` array
- Handles both login and registration flows
- Manages loading states and error handling
- Integrates with the existing authentication infrastructure

### 3. Layout Behavior

**When providers are available**:
- **Login Page**: Split layout with social login buttons on the left and traditional login form on the right
- **Registration Page**: Split layout with social signup buttons on the left and registration form on the right
- **Divider**: "Or" separator between social and traditional authentication

**When no providers are available**:
- Only the traditional forms are displayed
- No divider is shown
- Clean, focused user experience

## Implementation Details

### Component Structure

```javascript
// In CustomLogistration.jsx
{providers && providers.length > 0 && (
  <div className="social-buttons">
    <ThirdPartyAuth
      currentProvider={currentProvider}
      providers={providers}
      secondaryProviders={secondaryProviders}
      handleInstitutionLogin={handleInstitutionLogin}
      thirdPartyAuthApiStatus={thirdPartyAuthApiStatus}
      isLoginPage={true} // or false for registration
    />
  </div>
)}

{providers && providers.length > 0 && (
  <div className="divider">
    <span className="divider-text">Or</span>
  </div>
)}
```

### Conditional Rendering

The system conditionally renders:
1. **Social login section** - only when providers exist
2. **Divider** - only when providers exist
3. **Traditional forms** - always displayed

### Styling

The social login buttons are styled using the existing `.btn-social` classes:

```scss
.social-buttons {
  .btn-social {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    color: #495057;
    background: #fff;
    transition: all 0.3s ease;
    margin-bottom: 0.75rem;
    width: 100%;
    
    &:hover {
      border-color: #007bff;
      color: #007bff;
      background: #f8f9fa;
    }
  }
}
```

## Configuration

### Backend Configuration

To enable/disable social login providers, modify the backend API response:

- **Enable Google**: Include the Google provider object in the `providers` array
- **Enable Microsoft**: Include the Microsoft provider object in the `providers` array
- **Disable All**: Return an empty `providers` array or omit the field

### Frontend Configuration

No frontend configuration is required. The system automatically:
- Fetches provider configuration from the API
- Displays available providers
- Hides the social login section when no providers are available

## Testing

### Test Social Login with Providers

1. Ensure the backend API returns providers in the response
2. Verify social login buttons are displayed
3. Check that the divider "Or" is shown
4. Test both login and registration flows

### Test Without Social Login

1. Modify the backend API to return an empty providers array
2. Verify social login buttons are hidden
3. Check that no divider is displayed
4. Ensure traditional forms are properly centered

## Troubleshooting

### Social Buttons Not Showing

1. Check the `/api/mfe_context` API response
2. Verify the `providers` array exists and contains provider objects
3. Check browser console for API errors
4. Verify the `ThirdPartyAuth` component is receiving the correct props

### Layout Issues

1. Check CSS classes are properly applied
2. Verify responsive breakpoints
3. Test on different screen sizes
4. Ensure the grid layout is working correctly

## Benefits of This Approach

1. **Automatic Integration**: Uses existing, tested social login infrastructure
2. **Dynamic Configuration**: No code changes needed to enable/disable providers
3. **Consistent UX**: Maintains the same look and feel across the application
4. **Maintainable**: Leverages existing components and reduces code duplication
5. **Scalable**: Easy to add new social providers through backend configuration

## Future Enhancements

- Support for additional social providers through backend configuration
- Custom styling options for different providers
- A/B testing support for different social login layouts
- Analytics tracking for social login usage
- Enhanced error handling and user feedback
