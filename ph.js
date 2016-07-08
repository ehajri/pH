/**
 * Created by Ebrahem on 7/7/2016.
 */

(function() {

    var routes = m.prop({});

    var sections = Object.create(null);

    var parentmenu = {
        view: function(ctrl, args) {
            return (
            m('a', {class: 'dropdown-toggle', 'data-toggle': 'dropdown', 'role': 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false'},
                [
                    args,
                    m('span', {class: 'caret'})
                ])
            );
        }
    };
    var submenu = {
        view: function(ctrl, subs) {
            return (
            m('ul', {class: 'dropdown-menu'},
                [
                    subs.map(function(sub) {return (
                        m('li',
                            m('a', {
                                href: sub.route,
                                config: m.route
                            }, sub.header)
                        ));})
            ])
            );
        }
    };
    var lonemenu = {
        view: function(ctrl, args) {
            return (
                m('li',
                    m('a', {
                        href: args.route,
                        config: m.route
                    }, args.header)
                )
            );
        }
    };
    var dropdownmenu = {
      view: function(ctrl, args) {
          return (
              m('li', {class: 'dropdown'},
              [
                  m(parentmenu, args.header),
                  m(submenu, args.sub)
              ])
          );
      }
    };
    var nav = {
        view: function() {
            return (
            R.keys(sections).map(function(section) {
                var sec = sections[section];
                if (!authorized(claims, sec)) { return; }
                return (
                    R.has('sub')(sec) && sec.sub.length > 0 ?
                    m(dropdownmenu, {header: sec.header, sub: sec.sub})
                    :
                    m(lonemenu, {header: sec.header, route: sec.route || ''})
                );
            }));
        }
    };

    var AddRoute = function(route, component) {
        routes()[route] = component;
    };

    var Section = function(section) {
        if (R.equals(R.type(section), 'Object')) {
            var id = this.id = section.id || section.header;
            if (!R.has(id)(sections)) {
                this.header = section.header;
                this.route = section.route;
                this.claims = section.claims;
                this.view = section.view;
                this.controller = section.controller;
                sections[id] = this;
                AddRoute(section.route, section);
            } else {
                throw new Error({name: 'Section Error', message: 'Section "' + id + '" does exist!'});
            }
        } else {
            if (!R.has(section)(sections)) {
                sections[section] = this;
            } else {
                throw new Error({name: 'Section Error', message: 'Section "' + section + '" does exist!'});
            }
            this.id = this.header = section;
        }
    };

    Section.prototype.AddModule = function (module) {
        if (!R.has('sub')(this)) {
            this['sub'] = [];
        }

        this['sub'].push(module);

        AddRoute(module.route, module);
        return this;
    };

    var filter = function(claims) {
        return R.flatten(
            R.keys(sections).map(
                function(t) {
                    var s = pH.sections[t];
                    return s.sub ? [].concat(s, s.sub) : s;
                }
            )
        ).filter(
            function(r) {
                return authorized(claims, r);
            }
        );
    };

    var authorized = function(claims, component) {
        return R.contains('Administrator', claims) ||
            (R.has('claims')(component) && (
                R.equals('any', component.claims) ||
                R.intersection(claims, component.claims.split(',')).length > 0
            ));
    };

    var GetRoutes = function() {
        return R.reduce(
            function(o, v) {
                var a = {};
                a[v.route] = v;
                return R.merge(o, a);
            },
            {},
            pH.filter(claims)
        );
    };

    var claims;


    document.addEventListener('DOMContentLoaded', function(e) {
        //m.mount(document.getElementById'main'), AccModule1);
        m.mount(document.getElementById('nav'), nav);
        m.route(document.getElementById('main'), '/', GetRoutes());
    });

    var pHObj = {
        SetClaims: function(claims) {
            this.claims = claims;
        },
        filter: filter,
        sections: sections,
        Routes: routes(),
        AddSection: function(section) {
            return new Section(section);
        },
        From: function(section) {
            var header;
            if (section instanceof Section) {
                header = section.id;
            } else if(R.equals(R.type(section), 'String')) {
                header = section;
            } else if(R.equals(R.type(section), 'Object')) {
                header = section.id;
            }

            if (R.has(header)(sections)) {
                return sections[header];
            }

            throw ({name: 'From Error', message: 'Unknown section, args: ' + JSON.stringify(section)});
        }
    };
    window.pH = pHObj;
})();