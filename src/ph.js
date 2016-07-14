/**
 * Created by Ebrahem on 7/7/2016.
 */

(function() {
    var _sections = [];
    var _menuIndex = [];

    // Ramda predicates!
    var isRoot         = R.complement(R.has('parent'));
    var isChildOf      = R.propEq('parent');
    var children       = R.compose(R.filter, isChildOf);
    var renderable     = R.complement(R.propEq('toRender', false));
    //as per MOA' suggestion, sorting using a mapper is more scalable.
    //var sorted         = R.compose(R.reverse, R.sortBy(R.prop('index')));
    var sort           = items => {
        "use strict";
        // console.log('items', items.map(x => x.header));
        // console.log('menuIndex', _menuIndex);

        var filtered = R.filter(x => R.indexOf(x.header, _menuIndex) >= 0, items);
        // console.log('filtered', filtered.map(x => x.header));

        var sorted = R.sort((a,b) => R.indexOf(a.header, _menuIndex) > R.indexOf(b.header, _menuIndex));
        var sortedd = sorted(filtered)
        // console.log('sorted', sortedd.map(x => x.header));

        var union = R.union(sortedd, R.difference(items, filtered));
        // console.log('final', union.map(x => x.header));

        return union;
    };
    var roots          = R.filter(x => isRoot(x) && renderable(x));
    var findIdByHeader = R.compose(R.find(R.__, _sections), R.propEq('header'));

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
                        sort(R.filter(x => renderable(x), subs)).map(function(sub) {
                            return (
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
                sort(roots(_sections)).map(function(section) {
                    var sec = section;
                    if (!authorized(_claims, sec)) { return; }
                    return (
                        children(sec.id)(_sections).length == 0 ?
                            //lone
                            m.component(lonemenu, {header: sec.header, route: sec.route || ''})
                            :
                            //got children!
                            m.component(dropdownmenu, {header: sec.header, sub: children(sec.id)(_sections)})

                        //version 2 with arrow function!
                        /*(x=children(sec.id)(_sections)) => x.length == 0 ?
                            //lone
                            m.component(lonemenu, {header: sec.header, route: sec.route || ''})
                            :
                            //got children!
                            m.component(dropdownmenu, {header: sec.header, sub: x})*/
                    );
                }));
        }
    };

    var Section = function(section) {
        "use strict";
        this.id = guid();
        Object.assign(this, section);
        _sections.push(this);
    }

	Section.prototype.AddModule = function (module) {
        module.parent = this.id;
        _sections.push(module);
        return this;
    };

    var guid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };

    var filter = function(claims) {
        return R.flatten(
            R.keys(sections).map(
                function(t) {
                    var s = sections[t];
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
        var bool = (R.contains({type: 'Type', value: 'SystemAdministrator'}, claims) ||
        (R.has('claims')(component) && (
            R.equals({type: 'Type', value: 'any'}, required) ||

            R.intersection(claims, requiredaslist).length > 0
        )));
        return bool;
    };

    var GetRoutes = function() {
        "use strict";
        return R.fromPairs(R.filter(x => R.has('route')(x), _sections).map(x => [x.route, x]));
    }

    var _claims = [];

    var pHObj = {
        SetClaims: function(claims) {
            _claims = claims;
        },
        Sort: sort,
        filter: filter,
        sections: _sections,
        Routes: () => GetRoutes(),
        AddSection: function(section) {
            return new Section(section);
        },
        InitMenu: function(node) {
            m.mount(document.getElementById(node), nav);
        },
        InitRoute: function(node) {
            var rr = GetRoutes();
            m.route(document.getElementById(node), '/', rr);
        },
        SetMenuIndex: (index) => _menuIndex = index,
        From: function(section) {
            /*
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
            */
            if (section instanceof Section) {
                return section;
            }

            var found;

            if(R.equals(R.type(section), 'String')) {
                found = findIdByHeader(section);
            } else if(R.equals(R.type(section), 'Object')) {
                found = findIdByHeader(section.header);
            }

            if (found) {
                return found;
            }

            console.log('Throwing error', JSON.stringify(section));
            throw new Error({name: 'From Error', message: 'Unknown section, args:'});

        }
    };
    window.pH = pHObj;
})();
