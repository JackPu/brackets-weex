define(function (require, exports, module) {
  "use strict";
  var FILE_EXT = ".we", 
      MENU_LABEL = "New *.we", 
      EXTENSION_NAME = "Brackets Weex", 
      WEEx_CREATE_EXECUTE = "weex.create.execute", 
      // weex has some same syntax to vue
      VUE_MODE_FILE_PATH = "/thirdparty/CodeMirror/mode/vue/vue.js", 
      documentIndex = 1, 
      Menus = brackets.getModule("command/Menus"), 
      AppInit = brackets.getModule("utils/AppInit"), 
      Commands = brackets.getModule("command/Commands"), 
      FileUtils = brackets.getModule("file/FileUtils"), 
      FileSystem = brackets.getModule("filesystem/FileSystem"), 
      EditorManager = brackets.getModule("editor/EditorManager"), 
      CommandManager = brackets.getModule("command/CommandManager"), 
      DocumentManager = brackets.getModule("document/DocumentManager"), 
      MainViewManager = brackets.getModule("view/MainViewManager"), 
      LanguageManager = brackets.getModule("language/LanguageManager");

  function createWeexFile() {
    var templateContent = require("text!./template.we"), 
        document = DocumentManager.createUntitledDocument(documentIndex++, FILE_EXT);
    MainViewManager._edit(MainViewManager.ACTIVE_PANE, document);
    try {
      var activeEditor = EditorManager.getActiveEditor();
      activeEditor.document.replaceRange(templateContent, activeEditor.getCursorPos());
    }
    catch (e) {
      console.log(EXTENSION_NAME + " createVueComponentFile() : ", e);
    }
    return new $.Deferred().resolve(document).promise();
  }

  function setLanguage(mode) {
    console.log(mode);
    LanguageManager.defineLanguage("we", {
      name: "Weex component file"
      , mode: mode
      , fileExtensions: ["we"]
    });
  }
  var file = FileSystem.getFileForPath(FileUtils.getNativeBracketsDirectoryPath() + VUE_MODE_FILE_PATH);
  file.exists(function (err, exists) {
    setLanguage((!err && exists) ? "vue" : "htmlmixed");
  });
  AppInit.appReady(function () {
    CommandManager.register(MENU_LABEL, VUE_CREATE_EXECUTE, createWeexFile);
    var fileMenu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    fileMenu.addMenuItem(VUE_CREATE_EXECUTE, undefined, Menus.AFTER, Commands.FILE_NEW_UNTITLED);
  });
});
