```env
{
  "rules": {
    ".read": true,
    ".write": false,

    "cursors": {
      "$room": {
        "$userId": {
          ".write": true,
          ".validate": "newData.hasChildren(['lastSeen']) &&
            (!newData.child('name').exists() || newData.child('name').isString()) &&
            (!newData.child('color').exists() || newData.child('color').isString()) &&
            (!newData.child('x').exists() || newData.child('x').isNumber()) &&
            (!newData.child('y').exists() || newData.child('y').isNumber()) &&
            (!newData.child('state').exists() || newData.child('state').val() === 'active' || newData.child('state').val() === 'idle')"
        }
      }
    },
      
    "signatures": {
      ".read": true,
      "$sigId": {
        ".write": "
          auth != null && (
            (!data.exists() && newData.exists() &&
              newData.child('uid').val() === auth.uid) ||
            (data.exists() && !newData.exists() &&
              data.child('uid').val() === auth.uid)
          )
        ",
        ".validate": "
          !newData.exists() || (
            newData.hasChildren(['name','signature','timestamp','uid']) &&
            newData.child('name').isString() &&
            newData.child('name').val().length > 0 &&
            newData.child('signature').isString() &&
            newData.child('signature').val().length > 0 &&
            newData.child('timestamp').isString() &&
            newData.child('uid').isString()
          )
        "
      },
      ".indexOn": ["name", "timestamp", "uid"]
    },

    "uses_reactions": {
      "$section": {
        "$index": {
          ".read": true,
          ".write": "newData.exists()",
          ".validate": "newData.isNumber() && newData.val() >= 0"
        }
      }
    },

    "blog": {
      "$slug": {
        ".read": true,
        ".write": "newData.exists()",
        ".validate": "newData.isNumber() && newData.val() >= 0"
      }
    },

    "analytics": {
      "total_visitors": {
        ".read": true,
        ".write": "newData.exists()",
        ".validate": "newData.isNumber() && newData.val() >= 0"
      }
    }
  }
}
```
