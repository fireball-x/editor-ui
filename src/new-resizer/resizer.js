(function () {
    Polymer({
        publish: {
            BrotherElments: null,
            inverse: {
                value: false,
                reflect: true
            },
            vertical: {
                value: false,
                reflect: true
            }
        },

        created: function () {
            this.target = null;
            this.previous = null;
            this.next = null;
        },

        ready: function () {
            if ( this.vertical ) {
                this.classList.toggle('vertical', true);
                this.classList.toggle('horizontal', false);
            }
            else {
                this.classList.toggle('vertical', false);
                this.classList.toggle('horizontal', true);
            }
            this.inverse = false;
            this.previous = this.previousElementSibling;
        },

        domReady: function () {
            this.previous = this.previousElementSibling;
            this.next = this.nextElementSibling;
        },

        // 该方法用于获取当前元素的所有同级元素 排除掉resizer自身
        GetBrotherChild: function (elem) {
            var r = [];
            var n = elem.parentNode.firstChild;
            for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1) {
                r.push( n );
               }
           }
           var ElmList = [];
           this.BrotherElments = [];
           for (var i = 0; i < r.length; i++ ) {
               if(r[i].tagName != "FIRE-UI-NEWRESIZER") {
                   ElmList.push(r[i]);
               }
           }
           this.BrotherElments = ElmList;
           return ElmList;
        },

        //该函数用于返回当前操作的resizer的前一个元素在BrotherElments中的下标
        GetSubscript: function (elem) {
            this.GetBrotherChild(elem.nextElementSibling);
            for ( var i = 0; i < this.BrotherElments.length; i++) {
                if(this.previous == this.BrotherElments[i]){
                     return i;
                }
            }
        },

        mousedownAction: function ( event ) {
            if ( this.previous ) {
                // add drag-ghost
                EditorUI.addDragGhost( this.vertical ? 'col-resize' : 'row-resize' );
                var lastRect = this.previous.getBoundingClientRect();
                var nextRect = this.next.getBoundingClientRect();
                var lastMinheight = this.previous.minHeight;
                var nextMinheight = this.next.minHeight;
                var lastMinWidth = this.previous.minHeight;
                var nextMinWidth = this.next.minWidth;
                var mouseDownX = event.clientX;
                var mouseDownY = event.clientY;
                var updateMouseMove = function (event) {
                    var offset = -1;
                    if ( this.vertical ) {
                        offset = event.clientX - mouseDownX;
                        offset = this.inverse ? -offset : offset;
                        if ( (lastRect.width + offset) <= (lastMinWidth) || (nextRect.width - offset) <= (nextMinWidth)) {
                            return;
                        }
                        else {
                            this.previous.Width = (lastRect.width + offset) + "px";
                            this.next.Width = (nextRect.width - offset) + "px";
                        }

                    }
                    else {
                        offset = event.clientY - mouseDownY;
                        offset = this.inverse ? -offset : offset;
                        if ( (lastRect.height + offset) <= (lastMinheight) || (nextRect.height - offset) <= (nextMinheight)) {
                            return;
                        }
                        else {
                            this.previous.Height = (lastRect.height + offset) + "px";
                            this.next.Height = (nextRect.height - offset) + "px";
                        }
                    }

                    // 事件完毕后触发 mouseup触发resized结束事件 mousemove触发resize事件
                    this.fire( "resized", { target: this.previous } );

                    event.stopPropagation();
                };
                updateMouseMove.call(this,event);

                var mouseMoveHandle = updateMouseMove.bind(this);
                var mouseUpHandle = (function(event) {
                    document.removeEventListener('mousemove', mouseMoveHandle);
                    document.removeEventListener('mouseup', mouseUpHandle);
                    console.log('结束事件');
                    EditorUI.removeDragGhost();
                    event.stopPropagation();
                }).bind(this);
                document.addEventListener ( 'mousemove', mouseMoveHandle );
                document.addEventListener ( 'mouseup', mouseUpHandle );
            }

            event.stopPropagation();
        },
    });
})();
