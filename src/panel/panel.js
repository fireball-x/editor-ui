(function () {
    Polymer({
        publish: {
            'width': 200,
            'height': 200,
            'min-width': 200,
            'min-height': 200,
        },

        ready: function () {
            this.super();

            var tabs = this.$.tabs;
            for ( var i = 0; i < this.children.length; ++i ) {
                var el = this.children[i];

                if ( el instanceof FireDockResizer )
                    continue;

                var name = el.getAttribute("name");
                var tabEL = tabs.add(name);
                tabEL.setAttribute("draggable", "true");

                el.style.display = "none";
                tabEL.content = el;
                tabEL.panel = this;

                tabEL.setIcon( el.icon ); // TEMP HACK
            }

            tabs.select(0);
        },

        _reflow: function () {
        },

        select: function ( tab ) {
            var tabs = this.$.tabs;
            tabs.select(tab);
        },

        add: function ( contentEL ) {
            var tabs = this.$.tabs;

            var name = contentEL.getAttribute("name");
            var tabEL = tabs.add(name);
            tabEL.setAttribute("draggable", "true");

            contentEL.style.display = "none";
            tabEL.content = contentEL;
            tabEL.panel = this;

            this.appendChild(contentEL);
        },

        close: function ( tabEL ) {
            var tabs = this.$.tabs;

            //
            tabs.remove(tabEL);
            if ( tabEL.content ) {
                tabEL.content.parentElement.removeChild(tabEL.content);
            }
            tabEL.panel = null;

            //
            if ( tabs.children.length > 0 ) {
                tabs.select(0);
            }
            else {
                // TODO: dock.remove(this);
                // this.parentElement.removeChild(this);
            }
        },

        tabsChangedAction: function ( event ) {
            var detail = event.detail;
            if ( detail.old !== null ) {
                detail.old.content.style.display = "none";
                detail.new.fire('hide');
            }
            if ( detail.new !== null ) {
                detail.new.content.style.display = "";
                detail.new.fire('show');
            }

            event.stopPropagation();
        },
    });
})();