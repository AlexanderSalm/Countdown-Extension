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
        log('show-sec : ' + this.settings.get_boolean('show-sec'));
        log('show-min : ' + this.settings.get_boolean('show-min'));
        log('show-hour: ' + this.settings.get_boolean('show-hour'));
        log('show-days: ' + this.settings.get_boolean('show-days'));
        log('text     : ' + this.settings.get_string('text'));
        log('update-frequency: ' + this.settings.get_double('update-frequency'));
        
        log('target-second: ' + this.settings.get_double('target-second'));
        log('target-minute: ' + this.settings.get_double('target-minute'));
        log('target-hour: '   + this.settings.get_double('target-hour'));
        log('target-day: '    + this.settings.get_double('target-day'));
        log('target-month: '  + this.settings.get_double('target-month'));
        log('target-year: '   + this.settings.get_double('target-year'));

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
        this.timeout = Mainloop.timeout_add_seconds(Math.max(0.1, this.settings.get_double('update-frequency')), this.update.bind(this));
        let now = Glib.DateTime.new_now_local();
        
        const second = this.settings.get_double('target-second');
        const minute  = this.settings.get_double('target-minute');
        const hour    = this.settings.get_double('target-hour');
        const day     = this.settings.get_double('target-day');
        const month   = this.settings.get_double('target-month') + 1;
        const year    = this.settings.get_double('target-year');
        
        let target = Glib.DateTime.new_local(year, month, day, hour, minute, second);
        let diff = target.to_unix() - now.to_unix();
        this.time.text = this.ConvertSecToDay(diff).toString();
    }
    
    //Called when the countdown button is pressed
    onClick(){
        Util.spawnCommandLine("gnome-extensions prefs countdown@alikay");
    }
    
    ConvertSecToDay(n) {
        let ret = ""
        let initTime = n
        let first = n >= 0
        
        //Time identifier variables
        let dayString = "d, "
        let minString = "m, "
        let hourString = "h, "
        let secString = "s"
        
        
        //Check if using condensed time identifiers or not
        if (this.settings.get_boolean("expand-text")){
            dayString = " days, "
            minString = " minutes, "
            hourString = " hours, "
            secString = " seconds"
        }
        
        //Cascading time calculation - days
        if (this.settings.get_boolean('show-days')){
            var day = Math.floor(n / (24 * 3600));
            n = n % (24 * 3600);
            if (day > 0 || !first){
                ret = ret + day.toString() + dayString
                first = false
            }
        }
        
        //Cascading time calculation - hours
        if (this.settings.get_boolean('show-hour')){
            var hour = Math.floor(n / 3600);
            n %= 3600;
            if (hour > 0 || !first){
                ret = ret + hour.toString() + hourString
                first = false
            }
        }
        
        //Cascading time calculation - minutes
        if (this.settings.get_boolean('show-min')){
            var minutes = Math.floor(n / 60);
            n %= 60;
            if (minutes > 0 || !first){
                ret = ret + minutes.toString() + minString  
                first = false
            }
        }
        
        //Cascading time calculation - seconds
        if (this.settings.get_boolean('show-sec')){
            var seconds = Math.floor(n);
            n %= 1000
            if (seconds > 0 || !first){
                ret = ret + seconds.toString() + secString
                first = false
            }
        }
        
        //Check if the time is up
        if (initTime <= 0){
            ret = ret + "⏰"
        }
        
        return ret;
    }
}

function init() {
    log(`initializing ${Me.metadata.name}`);
    
    return new Extension();
}





