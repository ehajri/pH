/**
 * Created by Ebrahem on 7/7/2016.
 */

(function() {

    var routes = m.prop({});

    var sections = Object.create(null);

    var parentmenu = {
        view: function(ctrl, args) {
            return (
            m('a', {class: '', 'data-toggle': 'dropdown', 'data-hover': 'megamenu-dropdown', 'data-close-others': 'true' },
                [
                    args,
                    m('i.fa.fa-angle-down')
                ])
            );
        }
    };
    var submenu = {
        view: function(ctrl, subs) {
            return (
            m('ul', {class: 'dropdown-menu pull-left'},
                [
                    subs.map(function(sub) {return sub.renderAsMenu === false ? null : (
                        m('li',
                            m('a', {
                                href: sub.route,
                                config: m.route
                            }
                            , m('i.fa.fa-cubes')
                            , ' ' + sub.header)
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
              m('li', {class: 'menu-dropdown classic-menu-dropdown'},
              [
                  m.component(parentmenu, args.header),
                  m.component(submenu, args.sub)
              ])
          );
      }
    };

    var nav = {
        view: function() {
            return (
            R.keys(sections).map(function(section) {
                var sec = sections[section];
                if (!authorized(_claims, sec)) { return; }
                return (
                    R.has('sub')(sec) && sec.sub.length > 0 ?
                    m.component(dropdownmenu, {header: sec.header, sub: sec.sub})
                    :
                    m.component(lonemenu, {header: sec.header, route: sec.route || ''})
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
                //copy properties over to this
                Object.assign(this, section);
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
        var required = component.claims,
            requiredaslist = R.equals(R.type(required), 'Object') ? [required] : required;
        return R.contains({type: 'Type', value: 'Administrator'}, claims) ||
            (R.has('claims')(component) && (
                R.equals({type: 'Type', value: 'any'}, required) ||

                R.intersection(claims, requiredaslist).length > 0
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
            pH.filter(_claims)
        );
    };

    var _claims = [];


    document.addEventListener('DOMContentLoaded', function(e) {
        //m.mount(document.getElementById'main'), AccModule1);
        //m.mount(document.getElementById('nav'), nav);
        //m.route(document.getElementById('main'), '/', GetRoutes());
    });

    var pHObj = {
        SetClaims: function(claims) {
            _claims = claims;
        },
        filter: filter,
        sections: sections,
        Routes: routes(),
        AddSection: function(section) {
            return new Section(section);
        },
        InitMenu: function(node) {
            m.mount(document.getElementById(node), nav);
        },
        InitRoute: function(node) {
            m.route(document.getElementById(node), '/', GetRoutes());
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

            console.log('Throwing error', JSON.stringify(section));
            throw new Error({name: 'From Error', message: 'Unknown section, args:'});
        }
    };
    window.pH = pHObj;
})();



