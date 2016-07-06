# pH

pH mithriljs wrapper to create sections and modules, to automatically render routes and navigation menu.

Usage:
```javascript
pH.AddSection('Home').AddModule({ 
    route: '/',
    controller: function() { },  
    view: function() {
      return m('h1', 'Hello World!');  
   }
});
```

Adding a new section:
```javascript
pH.AddSection(string:name);
```

Getting a section:
```javascript
pH.From(string:name|Section:section|Object:{header: string});
```

Example:
```javascript
//storing reference for `Section` object
var admin = pH.AddSection('Admin');

//adding a new module, controller and view functions omitted for simplicity
admin.AddModule({
  route: '/admin/index',
  controller: function() {},
  view: function() {}
});

//chaining
admin.AddModule({
  route: '/admin/grant',
  controller: function() {},
  view: function() {}
}).AddModule({
  route: '/admin/revoke',
  controller: function() {},
  view: function() {}
});

//using From #1
pH.From(admin).AddModule({
  route: '/admin/stats',
  controller: function() {},
  view: function() {}
});

//using From #2 (string must match the name during instantiation)
pH.From('Admin').AddModule({
  route: '/admin/allusers',
  controller: function() {},
  view: function() {}
});
//using From #3
pH.From({header: 'Admin'}).AddModule({
  route: '/admin/resetpassword',
  controller: function() {},
  view: function() {}
});
