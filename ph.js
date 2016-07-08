/**
 * Created by Ebrahem on 7/7/2016.
 */

var pH = (function() {

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
                                config: m.route.mode
                            }, sub.header)
                        ));})
            ])
            );
        }
    };
    var lonemenu = {
        view: function(ctrl, header) {
            return m('li', m('a', header));
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
                return (
                    R.has('sub')(sec) && sec.sub.length > 0 ?
                    m(dropdownmenu, {header: sec.header, sub: sec.sub})
                    :
                    m(lonemenu, sec.header)
                );
            }));
        }
    };

    var Section = function(section) {
        if (R.equals(R.type(section), 'Object')) {
            var id = this.id = section.id || section.header;
            if (!R.has(id)(sections)) {
                sections[id] = R.merge(this, section);
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

        routes()[module.route] = module;
        return this;
    };

    document.addEventListener('DOMContentLoaded', function(e) {
        //m.mount(document.getElementById('main'), AccModule1);
        m.mount(document.getElementById('nav'), nav);
        m.route(document.getElementById('main'), '/', routes);
    });

    return {
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
})();