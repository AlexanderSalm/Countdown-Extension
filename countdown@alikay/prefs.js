'use strict';

const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.countdown@alikay');
    
    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group0 = new Adw.PreferencesGroup();
    page.add(group0);

    //Create a text entry field
    const row0 = new Adw.ActionRow({ title: 'Text' });
    group0.add(row0);

    //Create text entry field
    const text = new Gtk.Entry({

    });
    settings.bind(
      'text',
      text,
      'text',
      Gio.SettingsBindFlags.DEFAULT
    );

    //------------------------------------------------------
    const group1 = new Adw.PreferencesGroup();
    page.add(group1);

    // Create a new preferences row
    const row1 = new Adw.ActionRow({ title: 'Show Milliseconds' });
    group1.add(row1);

    // Create the switch and bind its value to the `show-indicator` key
    const toggle1 = new Gtk.Switch({
        active: settings.get_boolean ('show-msec'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'show-msec',
        toggle1,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Create a new preferences row
    const row2 = new Adw.ActionRow({ title: 'Show Seconds' });
    group1.add(row2);

    // Create the switch and bind its value to the `show-indicator` key
    const toggle2 = new Gtk.Switch({
        active: settings.get_boolean ('show-sec'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'show-sec',
        toggle2,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Create a new preferences row
    const row3 = new Adw.ActionRow({ title: 'Show Minutes' });
    group1.add(row3);

    // Create the switch and bind its value to the `show-indicator` key
    const toggle3 = new Gtk.Switch({
        active: settings.get_boolean ('show-min'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'show-min',
        toggle3,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Create a new preferences row
    const row4 = new Adw.ActionRow({ title: 'Show Hours' });
    group1.add(row4);

    // Create the switch and bind its value to the `show-indicator` key
    const toggle4 = new Gtk.Switch({
        active: settings.get_boolean ('show-hour'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'show-hour',
        toggle4,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Create a new preferences row
    const row5 = new Adw.ActionRow({ title: 'Show Days' });
    group1.add(row5);

    // Create the switch and bind its value to the `show-indicator` key
    const toggle5 = new Gtk.Switch({
        active: settings.get_boolean ('show-days'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'show-days',
        toggle5,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    //Add the entry to the row
    row0.add_suffix(text);
    row0.activatable_widget = text;

    // Add the switch to the row
    row1.add_suffix(toggle1);
    row1.activatable_widget = toggle1;

    // Add the switch to the row
    row2.add_suffix(toggle2);
    row2.activatable_widget = toggle2;

    // Add the switch to the row
    row3.add_suffix(toggle3);
    row3.activatable_widget = toggle3;

    // Add the switch to the row
    row4.add_suffix(toggle4);
    row4.activatable_widget = toggle4;

    // Add the switch to the row
    row5.add_suffix(toggle5);
    row5.activatable_widget = toggle5;

    // Add our page to the window
    window.add(page);
}
