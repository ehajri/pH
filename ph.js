/**
 * Created by Ebrahem on 7/7/2016.
 */

var pH = (function() {

    var routes = m.prop({});

    var sections = Object.create(null);

    var nav = {
        view: function() {
            //return m('ul', R.keys(pH.Routes).map(function(a) { return m(Menu, {"href": a}) ; }, pH.Routes));

            return m('ul', R.keys(sections).map(function(section) {
                return m('li', [
                            section,
                            m('ul', sections[section].links.map(function(link) {
                                return m('li', m('a', {href: link, config: m.route.mode}, link));
                            }))
                        ]);
            }));
        }
    };


    var Section = function(section) {
        var links  = [];

        if (!R.has(section)(sections)) {
            sections[section] = this;
        } else {
            throw new Error({name: 'Section Error', message: 'Section "' + section + '" does exist!'});
        }

        this.section = section;
        this.links = links;
    };

    Section.prototype.AddModule = function (module) {
        this.links.push(module.route);
        routes()[module.route] = module;
        return this;
    };

    document.addEventListener('DOMContentLoaded', function(e) {
        //m.mount(document.getElementById('main'), AccModule1);
        m.mount(document.getElementById('nav'), nav);
        m.route(document.getElementById('main'), '/', pH.Routes);
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
                header = section.section;
            } else if(R.equals(R.type(section), 'String')) {
                header = section;
            } else if(R.equals(R.type(section), 'Object')) {
                header = section.header;
            }

            if (R.has(header)(sections)) {
                return sections[header];
            }

            throw ({name: 'From Error', message: 'Unknown section, args: ' + JSON.stringify(section)});
        }
    };
})();