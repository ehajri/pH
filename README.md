# pH

pH mithriljs wrapper to create sections and modules, to automatically render routes and navigation menu.

Usage:
```javascript
pH.AddSection({
  header: 'Home',
  route: '/',
  controller: function() { },  
  view: function() {
    return m('h1', 'Hello World!');  
  }
});
```
Section Object:
```javascript
Section: {
  id: string*,
  header: string*,
  route: string|optional,
  controller: function|optional,
  view: function|optional
}
*id: will be used as object key. if not provided, then id = header.
```

Adding a new section:
```javascript
pH.AddSection(string:header);
```

Getting a section:
```javascript
pH.From(string:id|Section:section|Object:{id: string});
```

Example:
```javascript
//storing reference for `Section` object
var admin = pH.AddSection('Admin');

//adding a new module, controller and view functions omitted for simplicity
admin.AddModule({
  header: 'Dashboard',
  route: '/admin/index',
  controller: function() {},
  view: function() {}
});

//chaining
admin.AddModule({
  header: 'Grant Access',
  route: '/admin/grant',
  controller: function() {},
  view: function() {}
}).AddModule({
  header: 'Revoke Access',
  route: '/admin/revoke',
  controller: function() {},
  view: function() {}
});

//using From #1
pH.From(admin).AddModule({
  header: 'System Stats',
  route: '/admin/stats',
  controller: function() {},
  view: function() {}
});

//using From #2 (string must match the name during instantiation)
pH.From('Admin').AddModule({
  header: 'All users',
  route: '/admin/allusers',
  controller: function() {},
  view: function() {}
});

//using From #3
pH.From({id: 'Admin'}).AddModule({
  header: 'Reset user password',
  route: '/admin/resetpassword',
  controller: function() {},
  view: function() {}
});
