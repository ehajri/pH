'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Ebrahem on 7/7/2016.
 */

(function () {

    var routes = m.prop({});

    var sections = (0, _create2.default)(null);

    var parentmenu = {
        view: function view(ctrl, args) {
            return m('a', { class: '', 'data-toggle': 'dropdown', 'data-hover': 'megamenu-dropdown', 'data-close-others': 'true' }, [args, m('i.fa.fa-angle-down')]);
        }
    };
    var submenu = {
        view: function view(ctrl, subs) {
            return m('ul', { class: 'dropdown-menu pull-left' }, [subs.map(function (sub) {
                return sub.renderAsMenu === false ? null : m('li', m('a', {
                    href: sub.route,
                    config: m.route
                }, m('i.fa.fa-cubes'), ' ' + sub.header));
            })]);
        }
    };
    var lonemenu = {
        view: function view(ctrl, args) {
            return m('li', m('a', {
                href: args.route,
                config: m.route
            }, args.header));
        }
    };
    var dropdownmenu = {
        view: function view(ctrl, args) {
            return m('li', { class: 'menu-dropdown classic-menu-dropdown' }, [m.component(parentmenu, args.header), m.component(submenu, args.sub)]);
        }
    };

    var nav = {
        view: function view() {
            return R.keys(sections).map(function (section) {
                var sec = sections[section];
                if (!authorized(_claims, sec)) {
                    return;
                }
                return R.has('sub')(sec) && sec.sub.length > 0 ? m.component(dropdownmenu, { header: sec.header, sub: sec.sub }) : m.component(lonemenu, { header: sec.header, route: sec.route || '' });
            });
        }
    };

    var AddRoute = function AddRoute(route, component) {
        routes()[route] = component;
    };

    var Section = function Section(section) {
        if (R.equals(R.type(section), 'Object')) {
            var id = this.id = section.id || section.header;
            if (!R.has(id)(sections)) {
                //copy properties over to this
                (0, _assign2.default)(this, section);
                sections[id] = this;
                AddRoute(section.route, section);
            } else {
                throw new Error({ name: 'Section Error', message: 'Section "' + id + '" does exist!' });
            }
        } else {
            if (!R.has(section)(sections)) {
                sections[section] = this;
            } else {
                throw new Error({ name: 'Section Error', message: 'Section "' + section + '" does exist!' });
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

    var filter = function filter(claims) {
        return R.flatten(R.keys(sections).map(function (t) {
            var s = pH.sections[t];
            return s.sub ? [].concat(s, s.sub) : s;
        })).filter(function (r) {
            return authorized(claims, r);
        });
    };

    var authorized = function authorized(claims, component) {
        var required = component.claims,
            requiredaslist = R.equals(R.type(required), 'Object') ? [required] : required;
        return R.contains({ type: 'Type', value: 'Administrator' }, claims) || R.has('claims')(component) && (R.equals({ type: 'Type', value: 'any' }, required) || R.intersection(claims, requiredaslist).length > 0);
    };

    var GetRoutes = function GetRoutes() {
        return R.reduce(function (o, v) {
            var a = {};
            a[v.route] = v;
            return R.merge(o, a);
        }, {}, pH.filter(_claims));
    };

    var _claims = [];

    document.addEventListener('DOMContentLoaded', function (e) {
        //m.mount(document.getElementById'main'), AccModule1);
        //m.mount(document.getElementById('nav'), nav);
        //m.route(document.getElementById('main'), '/', GetRoutes());
    });

    var pHObj = {
        SetClaims: function SetClaims(claims) {
            _claims = claims;
        },
        filter: filter,
        sections: sections,
        Routes: routes(),
        AddSection: function AddSection(section) {
            return new Section(section);
        },
        InitMenu: function InitMenu(node) {
            m.mount(document.getElementById(node), nav);
        },
        InitRoute: function InitRoute(node) {
            m.route(document.getElementById(node), '/', GetRoutes());
        },
        From: function From(section) {
            var header;
            if (section instanceof Section) {
                header = section.id;
            } else if (R.equals(R.type(section), 'String')) {
                header = section;
            } else if (R.equals(R.type(section), 'Object')) {
                header = section.id;
            }

            if (R.has(header)(sections)) {
                return sections[header];
            }

            console.log('Throwing error', (0, _stringify2.default)(section));
            throw new Error({ name: 'From Error', message: 'Unknown section, args:' });
        }
    };
    window.pH = pHObj;
})();