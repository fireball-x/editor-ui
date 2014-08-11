(function () {
    Polymer('fire-ui-li', {
        publish: {
            value: null,
            index: -1,
        },

        created: function () {
            this.selected = false;
        },

        ready: function () {
            var fieldEL = new FireField();
            fieldEL.setAttribute('flex-2','');
            fieldEL.type = 'int';
            fieldEL.bind( 'value', new PathObserver(this,'value') );
            fieldEL.id = "field";
            this.$.field = fieldEL;

            var delBtnEL = this.$['btn-del']; 
            this.$.focus.insertBefore( fieldEL, delBtnEL );
        },

        delClickAction: function ( event ) {
            this.fire("delete");
            event.stopPropagation();
        },

        toggle: function () {
            if ( this.selected ) {
                this.unselect();
            }
            else {
                this.select();
            }
        },

        select: function () {
            if ( this.selected )
                return;

            this.selected = true;
            this.classList.toggle('selected', this.selected);
        },

        unselect: function () {
            if ( this.selected === false )
                return;

            this.selected = false;
            this.classList.toggle('selected', this.selected);
        },
    });
})();
