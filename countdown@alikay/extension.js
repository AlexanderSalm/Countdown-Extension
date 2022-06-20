const Gio = imports.gi.Gio;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


class Extension {
    constructor() {
        this.button = null;
        this.text = null;
        this.settings = null;
    }
    
    enable() {
        this.settings = ExtensionUtils.getSettings(
            'org.gnome.shell.extensions.countdown@alikay');

        log(`enabling ${Me.metadata.name}`);
        log('show-msec: ' + this.settings.get_boolean('show-msec'));

        let indicatorName = `${Me.metadata.name} Indicator`;
        
        this.button = new St.Bin({
            style_class : "panel-button",
        });

        this.text = new St.Label({
            text : "Hello World",
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.button.set_child(this.text);

        /*
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        
        // Add an icon
        let icon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'face-laugh-symbolic'}),
            style_class: 'system-status-icon'
        });
        this._indicator.add_child(icon);

        // Bind our indicator visibility to the GSettings value
        //
        // NOTE: Binding properties only works with GProperties (properties
        // registered on a GObject class), not native JavaScript properties
        this.settings.bind(
            'show-indicator',
            this._indicator,
            'visible',
            Gio.SettingsBindFlags.DEFAULT
        );
        */

        //Main.panel.addToStatusArea(indicatorName, this.button);

        Main.panel._rightBox.insert_child_at_index(this.button, 0);
    }
    
    disable() {
        log(`disabling ${Me.metadata.name}`);

        this.text.destroy();
        this.button.destroy();
        this.button = null;
        this.text = null;
    }
}


function init() {
    log(`initializing ${Me.metadata.name}`);
    
    return new Extension();
}

