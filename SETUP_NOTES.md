# Setup Notes

## Firebase Database Structure

### Realtime Database
Make sure your Firebase Realtime Database has the following structure initialized:

```json
{
  "restaurant": {
    "seatingAvailable": true,
    "waitingListEnabled": true,
    "availableSeats": 20,
    "ticketCounter": 0,
    "info": {
      "name": "Restaurant Name",
      "lastUpdated": 1234567890
    }
  },
  "statistics": {
    "averageWaitTime": 18
  }
}
```

### Firestore Collections
- `waitingList` - Stores customer waiting list entries
- `menu` - Stores menu items (if applicable)
- `announcements` - Stores announcements (if applicable)

## New Feature: Waiting List Toggle

The "候位管理" (Waiting Management) page now includes a toggle button that enables/disables the waiting list functionality:

- **When Enabled (Green)**: Customers can join the waiting list via the customer app
- **When Disabled (Red)**: The waiting list feature is turned off and customers cannot add themselves to the queue
- **Alert Message**: Shows when the feature is disabled to inform staff

The status is stored in Firebase at `restaurant/waitingListEnabled` and syncs in real-time across all connected clients.

## Initial Setup

If you're setting up for the first time, you can manually set the initial value in Firebase Console:
1. Go to Firebase Console > Realtime Database
2. Navigate to `/restaurant/`
3. Add a new field: `waitingListEnabled` with value `true`

Or it will be automatically created when you first click the toggle button.
