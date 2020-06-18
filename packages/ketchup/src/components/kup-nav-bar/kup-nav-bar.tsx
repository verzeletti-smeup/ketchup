import { MDCTopAppBar } from '@material/top-app-bar';
import {
    Component,
    Element,
    Prop,
    h,
    Listen,
    EventEmitter,
    Event,
    Host,
} from '@stencil/core';
import {
    ComponentNavBarData,
    ComponentNavBarElement,
    getClassNameByComponentMode,
    ComponentNavBarMode,
} from './kup-nav-bar-declarations';
import { ComponentListElement } from '../kup-list/kup-list-declarations';
import { positionRecalc } from '../../utils/recalc-position';

@Component({
    tag: 'kup-nav-bar',
    styleUrl: 'kup-nav-bar.scss',
    shadow: true,
})
export class KupNavBar {
    @Element() rootElement: HTMLElement;

    /**
     * Custom style to be passed to the component.
     */
    @Prop({ reflect: true }) customStyle: string = undefined;
    /**
     * Defaults at false. When set to true, the component is disabled.
     */
    @Prop({ reflect: true }) disabled: boolean = false;

    /**
     * Data to render
     */
    @Prop({ reflect: true }) data: ComponentNavBarData = {
        title: 'default title',
    };

    /**
     * Render mode
     */
    @Prop({ reflect: true }) mode: ComponentNavBarMode =
        ComponentNavBarMode.DEFAULT;

    private optionsButtonEl: any = undefined;
    private optionsListEl: any = undefined;
    private menuButtonEl: any = undefined;
    private menuListEl: any = undefined;

    @Listen('click', { target: 'document' })
    listenClick() {
        this.closeList();
    }

    @Listen('keyup', { target: 'document' })
    listenKeyup(e: KeyboardEvent) {
        if (this.isListOpened()) {
            if (e.key === 'Escape') {
                this.closeList();
            }
            if (e.key === 'Enter') {
                this.closeList();
            }
            if (e.key === 'ArrowDown') {
                this.arrowDownList();
            }
            if (e.key === 'ArrowUp') {
                this.arrowUpList();
            }
        }
    }

    @Event({
        eventName: 'kupMenuItemClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupMenuItemClick: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupOptionItemClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupOptionItemClick: EventEmitter<{
        value: any;
    }>;
    //---- Methods ----

    onKupMenuItemClick(e: CustomEvent) {
        let selectedValue: string = e.detail.selected.value;
        this.closeList();
        this.kupMenuItemClick.emit({
            value: selectedValue,
        });
    }

    onKupMenuButtonClick(value: string) {
        let selectedValue: string = value;
        this.kupMenuItemClick.emit({
            value: selectedValue,
        });
    }

    onKupOptionItemClick(e: CustomEvent) {
        let selectedValue: string = e.detail.selected.value;
        this.closeList();
        this.kupOptionItemClick.emit({
            value: selectedValue,
        });
    }

    onKupOptionButtonClick(value: string) {
        let selectedValue: string = value;
        this.kupOptionItemClick.emit({
            value: selectedValue,
        });
    }

    arrowDownList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.optionsListEl.arrowDown = true;
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.menuListEl.arrowDown = true;
        }
    }

    arrowUpList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.optionsListEl.arrowUp = true;
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.menuListEl.arrowUp = true;
        }
    }

    openList(listEl): boolean {
        this.closeList();
        if (listEl == null) {
            return false;
        }
        listEl.menuVisible = true;
        listEl.classList.add('dynamic-position-active');
        let elStyle: any = listEl.style;
        elStyle.height = 'auto';
        return true;
    }

    closeList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.closeThisList(this.optionsListEl);
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.closeThisList(this.menuListEl);
        }
    }

    closeThisList(listEl) {
        if (listEl == null) {
            return;
        }
        listEl.menuVisible = false;
        listEl.classList.remove('dynamic-position-active');
    }

    isListOpened(): boolean {
        return (
            this.isThisListOpened(this.optionsListEl) ||
            this.isThisListOpened(this.menuListEl)
        );
    }

    isThisListOpened(listEl): boolean {
        if (listEl == null) {
            return false;
        }
        return listEl.menuVisible == true;
    }
    //---- Lifecycle hooks ----

    componentDidRender() {
        const root = this.rootElement.shadowRoot;
        if (root != null) {
            const topAppBarElement = root.querySelector('.mdc-top-app-bar');
            //MDCTopAppBar.attachTo(topAppBarElement);
            new MDCTopAppBar(topAppBarElement);
        }
        if (this.menuListEl != null) {
            positionRecalc(this.menuListEl, this.menuButtonEl);
        }
        if (this.optionsListEl != null) {
            positionRecalc(this.optionsListEl, this.optionsButtonEl);
        }
    }

    prepMenuList(listData: ComponentListElement[]): HTMLElement {
        this.menuListEl = null;
        if (listData.length == 0) {
            return null;
        }
        let comp: HTMLElement = (
            <kup-list
                data={...listData}
                is-menu
                show-icons
                customStyle={this.customStyle}
                onKupListClick={(e) => this.onKupMenuItemClick(e)}
                id={this.rootElement.id + '_list'}
                ref={(el) => (this.menuListEl = el as any)}
            ></kup-list>
        );

        return comp;
    }

    prepOptionsList(listData: ComponentListElement[]): HTMLElement {
        this.optionsListEl = null;
        if (listData.length == 0) {
            return null;
        }
        let comp: HTMLElement = (
            <kup-list
                data={...listData}
                is-menu
                show-icons
                customStyle={this.customStyle}
                onKupListClick={(e) => this.onKupOptionItemClick(e)}
                id={this.rootElement.id + '_list'}
                ref={(el) => (this.optionsListEl = el as any)}
            ></kup-list>
        );

        return comp;
    }

    render() {
        let customStyle = undefined;
        if (this.customStyle) {
            customStyle = <style>{this.customStyle}</style>;
        }
        let wrapperClass = undefined;

        let visibleButtons: Array<HTMLElement> = [];
        let optionsButtons: ComponentListElement[] = [];
        let menuButtons: ComponentListElement[] = [];

        if (this.data.optionActions != null) {
            for (let i = 0; i < this.data.optionActions.length; i++) {
                let action: ComponentNavBarElement = this.data.optionActions[i];
                if (action.visible == true) {
                    let button = (
                        <kup-button
                            icon={action.icon}
                            iconColor="white"
                            tooltip={action.tooltip}
                            customStyle={this.customStyle}
                            onKupButtonClick={() =>
                                this.onKupOptionButtonClick(action.value)
                            }
                        ></kup-button>
                    );
                    visibleButtons.push(button);
                } else {
                    let listItem: ComponentListElement = {
                        text: action.text,
                        value: action.value,
                        icon: action.icon,
                    };
                    optionsButtons.push(listItem);
                }
            }
        }

        if (optionsButtons.length > 0) {
            let button = (
                <kup-button
                    icon="more_vert"
                    iconColor="white"
                    tooltip="Options"
                    onKupButtonClick={() => this.openList(this.optionsListEl)}
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => (this.optionsButtonEl = el as any)}
                ></kup-button>
            );
            visibleButtons.push(button);
        }

        let menuButton = null;
        if (this.data.menuAction != null) {
            let action = this.data.menuAction;
            menuButton = (
                <kup-button
                    icon={action.icon}
                    iconColor="white"
                    tooltip={action.tooltip}
                    customStyle={this.customStyle}
                    onKupButtonClick={() =>
                        this.onKupMenuButtonClick(action.value)
                    }
                ></kup-button>
            );
        } else if (this.data.menuActions != null) {
            for (let i = 0; i < this.data.menuActions.length; i++) {
                let action: ComponentNavBarElement = this.data.menuActions[i];
                let listItem: ComponentListElement = {
                    text: action.text,
                    value: action.value,
                    icon: action.icon,
                };
                menuButtons.push(listItem);
            }
            menuButton = (
                <kup-button
                    icon="menu"
                    iconColor="white"
                    tooltip="Open navigation menu"
                    disabled={menuButtons.length == 0}
                    onKupButtonClick={() => this.openList(this.menuListEl)}
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => (this.menuButtonEl = el as any)}
                ></kup-button>
            );
        }

        let headerClassName =
            'mdc-top-app-bar ' + getClassNameByComponentMode(this.mode);
        return (
            <Host>
                {customStyle}
                <div id="kup-component" class={wrapperClass}>
                    <header class={headerClassName}>
                        <div class="mdc-top-app-bar__row">
                            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                                {menuButton}
                                {this.prepMenuList(menuButtons)}
                                <span class="mdc-top-app-bar__title">
                                    {this.data.title}
                                </span>
                            </section>
                            <section
                                class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
                                role="toolbar"
                            >
                                {visibleButtons}
                                {this.prepOptionsList(optionsButtons)}
                            </section>
                        </div>
                    </header>
                </div>
            </Host>
        );
    }
}
