import { GameTheme } from "../../constants.js";

const NAV_BUTTON_SIZE = vec2(100, 30);

const SAVED_RENDER_FUNCTION = '_pagedLayout_render';

export class UIPagedLayout extends UIObject {

    constructor(pos, size, rows = 1, columns = 1, gap = 10, padding = 10, transparent = false) {

        super(pos, size);

        /**
         * @type {UIObject[]}
         */
        this._items = [];
        
        /**
         * @type {number}
         */
        this._pageIndex = 0;

        /**
         * @type {number}
         */
        this._pageSize = rows * columns;

        this._layoutItems = new UILayout(vec2(0), columns, gap, padding, true);
        this._layoutItems.canBeHover = false;

        this._buttonPrev = new UIButton(vec2(0), NAV_BUTTON_SIZE, 'Previous');
        this._buttonPrev.disabled = true;
        this._buttonPrev.onClick = () => this._previousPage();

        this._buttonNext = new UIButton(vec2(0), NAV_BUTTON_SIZE, 'Next');
        this._buttonNext.disabled = true;
        this._buttonNext.onClick = () => this._nextPage();

        this._navButtonSpacer = new UIObject(vec2(0), NAV_BUTTON_SIZE);
        this._navButtonSpacer.canBeHover = false;
        this._navButtonSpacer.color = CLEAR_BLACK;
        this._navButtonSpacer.gradientColor = undefined;
        this._navButtonSpacer.lineWidth = 0;
        this._navButtonSpacer.shadowColor = CLEAR_BLACK;        

        this._layoutNavButtons = new UILayout(vec2(0), 3, 0, 0, true);
        this._layoutNavButtons.canBeHover = false;
        this._layoutNavButtons.addChild(this._buttonPrev);
        this._layoutNavButtons.addChild(this._navButtonSpacer);
        this._layoutNavButtons.addChild(this._buttonNext);        

        this._layout = new UILayout(vec2(0, 0), 1, 5, 0, transparent);        
        this._layout.canBeHover = false;
        this._layout.addChild(this._layoutItems);
        this._layout.addChild(this._layoutNavButtons);

        this.canBeHover = false;

        // We have to call through super to bypass the internal 
        // add child interception we perform.
        super.addChild(this._layout);

        if (transparent) {
            this.color = CLEAR_BLACK;
            this.gradientColor = undefined;
            this.lineWidth = 0;
            this.shadowColor = CLEAR_BLACK;
        }
    }

    /**
     * @param {UIObject} item 
     */
    addChild(item) {

        // Not calling super - we are intercepting to add to the
        // item layout instead of the page layout.

        this._items.push(item);
        
        item.visible = false;

        this._refreshCurrentPage();
    }

    /**
     * Dirty hack to stop rendering an item.
     * 
     * This toggles visbility by changing the render function itself
     * to an empty function if not visible, otherwise we fall back to the
     * saved render function.
     * 
     * @param {UIObject} item 
     * @param {boolean} isVisible
     */
    _setVisibility(item, isVisible) {

        if (!item[SAVED_RENDER_FUNCTION]) {
            item[SAVED_RENDER_FUNCTION] = item.render;
        }        

        item.render = isVisible ? item[SAVED_RENDER_FUNCTION] : this._stopRender;
    }

    _stopRender() {

    }

    relayout() {

        this._navButtonSpacer.size.x = this._layout.size.x - (this._buttonNext.size.x + this._buttonPrev.size.x);
        this._layoutNavButtons.relayout();

        // Need to signal to the main layout to re-layout
        this._layout.relayout();

        // We just use the size of the inner layout
        this.size = this._layout.size;
    }

    _refreshCurrentPage() {

        while (this._layoutItems.children.length) {
            const lastChild = this._layoutItems.children[this._layoutItems.children.length - 1];
            this._layoutItems.removeChild(lastChild);
        }

        const pageStart = this._pageIndex * this._pageSize;
        const pageEnd = (this._pageIndex + 1) * this._pageSize;

        for (const item of this._items) {            
            item.visible = false;
        }

        for (let i = pageStart; i < pageEnd; i += 1) {
            if (i >= this._items.length) break;

            const item = this._items[i];
            this._layoutItems.addChild(item);

            item.visible = true;
        }

        this._buttonPrev.disabled = pageStart == 0;
        this._buttonNext.disabled = pageEnd >= this._items.length;

        this.relayout();

        // If we are parented into a layout panel
        // then we need to signal to the parent to also re-layout
        if (this.parent && this.parent.relayout) {
            this.parent.relayout();
        }
    }

    _nextPage() {

        const pageCount = ceil(this._items.length / this._pageSize);        
        this._pageIndex  = min(pageCount - 1, this._pageIndex + 1);
        this._refreshCurrentPage();

    }

    _previousPage() {

        this._pageIndex = max(0, this._pageIndex - 1);
        this._refreshCurrentPage();

    }


}