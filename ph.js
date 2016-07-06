/**
 * Created by Ebrahem on 7/7/2016.
 */

var pH = (function() {

    var routes = m.prop({});
    var sections = Object.create(null);


    var Section = function(section) {
        var array  = [];

        if (!R.has(section)(sections)) {
            sections[section] = this;
        } else {
            throw new Error({name: 'Section Error', message: 'Section "' + section + '" does exist!'});
        }

        this.section = section;
        this.array = array;
    };

    Section.prototype.AddModule = function (module) {
        this.array.push(module.route);
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