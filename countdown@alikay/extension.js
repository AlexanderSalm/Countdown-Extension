const Gio = imports.gi.Gio;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Util = imports.misc.util;
const Glib = imports.gi.GLib;
const Mainloop = imports.mainloop;

class Extension {
    constructor() {
        this.button = null;
        this.indicators = null;
        this.text = null;
        this.time = null;
        this.settings = null;
        this.timeout = null;
    }
    
    enable() {
        this.settings = ExtensionUtils.getSettings(
            'org.gnome.shell.extensions.countdown@alikay');

        log(`enabling ${Me.metadata.name}`);
        log('show-msec: ' + this.settings.get_boolean('show-msec'));
        log('show-sec : ' + this.settings.get_boolean('show-sec'));
        log('show-min : ' + this.settings.get_boolean('show-min'));
        log('show-hour: ' + this.settings.get_boolean('show-hour'));
        log('show-days: ' + this.settings.get_boolean('show-days'));
        log('text     : ' + this.settings.get_string('text'));
        log('update-frequency: ' + this.settings.get_double('update-frequency'));

        let indicatorName = `${Me.metadata.name} Indicator`;
        
        
        // Create a panel button
        this.button = new PanelMenu.Button(0.0, "Countdown!", false);
        this.indicators = new St.BoxLayout({style_class: 'panel-status-indicators-box'});
        this.text = new St.Label({
            text : this.settings.get_string('text'),
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.time = new St.Label({
            text : "TIME",
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.button.add_child(this.indicators);
        this.indicators.add_child(this.text);
        this.indicators.add_child(this.time);
        
        this.button.connect("button-press-event", this.onClick.bind(this));
        
        this.settings.bind(
            'text',
            this.text,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );
        

        Main.panel.addToStatusArea(indicatorName, this.button);

        //Main.panel._rightBox.insert_child_at_index(this.button, 0);
        
        this.update();
        
    }
    
    disable() {
        log(`disabling ${Me.metadata.name}`);

        this.text.destroy();
        this.time.destroy();
        this.indicators.destroy();
        this.button.destroy();
        this.button = null;
        this.time = null;
        this.text = null;
        this.indicators = null;
        Mainloop.source_remove(this.timeout);
        this.timeout = null;
    }
    
    update(){
        this.timeout = Mainloop.timeout_add_seconds(this.settings.get_double('update-frequency'), this.update.bind(this));
        log("Update");
        let now = Glib.DateTime.new_now_local();
        let nowString = now.format("%Y-%m-%d %H:%M:%S");
        this.time.text = nowString;
    }
    
    //Called when the countdown button is pressed
    onClick(){
        Util.spawnCommandLine("gnome-extensions prefs countdown@alikay");
    }
}


function init() {
    log(`initializing ${Me.metadata.name}`);
    
    return new Extension();
}



