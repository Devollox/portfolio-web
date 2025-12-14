```env
{
  "rules": {
    ".read": true,
    ".write": false,

    "cursors": {
      "$room": {
        "$userId": {
          ".write": true,
          ".validate": "newData.hasChildren(['name', 'color', 'x', 'y', 'lastSeen'])"
        }
      }
    },

    "signatures": {
      ".read": true,
      "$sigId": {
        ".write": true,
        ".validate": "
          newData.hasChildren(['name', 'signature', 'timestamp']) &&
          newData.child('name').isString() &&
          newData.child('name').val().length > 0 &&
          newData.child('signature').isString() &&
          newData.child('signature').val().length > 0 &&
          newData.child('timestamp').isString()
        "
      },
      ".indexOn": ["name"]
    },

    "uses_reactions": {
      "$section": {
        "$index": {
          ".read": true,
          ".write": true,
          ".validate": "newData.isNumber() && newData.val() >= 0"
        }
      }
    },

    "blog": {
      "$slug": {
        ".read": true,
        ".write": true,
        ".validate": "newData.isNumber() && newData.val() >= 0"
      }
    },

    "analytics": {
      "total_visitors": {
        ".read": true,
        ".write": true,
        ".validate": "newData.isNumber() && newData.val() >= 0"
      }
    }
  }
}

```
