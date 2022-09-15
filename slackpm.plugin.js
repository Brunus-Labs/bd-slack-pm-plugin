/**
 * @name slackpm
 * @author Josh Brown
 * @description Slack like pms for discord
 * @version 0.0.1
 */

const config = {
    "info": {
        "name": "slackpm",
        "authors": [{
            "name": "gentik"
        }],
        "version": "0.1.0",
        "description": "Slack like DMs for discord",
        "github": "https://github.com/GentikSolm/bd-slack-pm-plugin",
    }
};

class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}

if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
            });
        }
    });
}

module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
    const plugin = (Plugin, Api) => {

        const {WebpackModules, Logger, Patcher, } = Api;
        const {getByProps} = WebpackModules;

        return class ExamplePlugin extends Plugin {

            onStart() {
                Logger.log(getByProps());
                Patcher.before(Logger, "log", (t, a) => {
                    a[0] = "Patched Message: " + a[0];
                });
            }

            onStop() {
                Logger.log("Stopped");
                Patcher.unpatchAll();
            }
        };

    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
