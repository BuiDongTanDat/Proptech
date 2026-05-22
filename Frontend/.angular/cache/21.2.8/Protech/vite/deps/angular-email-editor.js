import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  setClassMetadata,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵproperty,
  ɵɵstyleProp
} from "./chunk-BJPSW4SK.js";
import "./chunk-4YCCEXQQ.js";
import "./chunk-J46EEYGT.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-U7EDC2PH.js";

// node_modules/angular-email-editor/fesm2020/angular-email-editor.mjs
var EmailEditorService = class {
  constructor() {
  }
};
EmailEditorService.ɵfac = function EmailEditorService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || EmailEditorService)();
};
EmailEditorService.ɵprov = ɵɵdefineInjectable({
  token: EmailEditorService,
  factory: EmailEditorService.ɵfac,
  providedIn: "root"
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmailEditorService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();
var defaultScriptUrl = "https://editor.unlayer.com/embed.js?2";
var callbacks = [];
var loaded = false;
var isScriptInjected = (scriptUrl) => {
  const scripts = document.querySelectorAll("script");
  let injected = false;
  scripts.forEach((script) => {
    if (script.src.includes(scriptUrl)) {
      injected = true;
    }
  });
  return injected;
};
var addCallback = (callback) => {
  callbacks.push(callback);
};
var runCallbacks = () => {
  if (loaded) {
    let callback;
    while (callback = callbacks.shift()) {
      callback();
    }
  }
};
var loadScript = (callback, scriptUrl = defaultScriptUrl) => {
  addCallback(callback);
  if (!isScriptInjected(scriptUrl)) {
    const embedScript = document.createElement("script");
    embedScript.setAttribute("src", scriptUrl);
    embedScript.onload = () => {
      loaded = true;
      runCallbacks();
    };
    document.head.appendChild(embedScript);
  } else {
    runCallbacks();
  }
};
var name = "angular-email-editor";
var version = "15.3.0";
var peerDependencies = {
  "@unlayer/types": "^1.394.0"
};
var dependencies = {
  tslib: "^2.3.0"
};
var pkg = {
  name,
  version,
  peerDependencies,
  dependencies
};
var lastEditorId = 0;
var EmailEditorComponent = class {
  constructor() {
    this.options = {};
    this.minHeight = "500px";
    this.loaded = new EventEmitter();
    this.ready = new EventEmitter();
    this.id = this.editorId || `editor-${++lastEditorId}`;
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    loadScript(this.loadEditor.bind(this), this.scriptUrl);
  }
  loadEditor() {
    const options = this.options || {};
    if (this.projectId) {
      options.projectId = this.projectId;
    }
    if (this.tools) {
      options.tools = this.tools;
    }
    if (this.appearance) {
      options.appearance = this.appearance;
    }
    if (this.locale) {
      options.locale = this.locale;
    }
    this.editor = unlayer.createEditor(__spreadProps(__spreadValues({}, options), {
      id: this.id,
      displayMode: options.displayMode || "email",
      source: {
        name: pkg.name,
        version: pkg.version
      }
    }));
    this.loaded.emit({});
    this.editor.addEventListener("editor:ready", () => {
      this.ready.emit({});
    });
  }
  loadDesign(data) {
    this.editor.loadDesign(data);
  }
  saveDesign(cb) {
    this.editor.saveDesign(cb);
  }
  exportHtml(cb) {
    this.editor.exportHtml(cb);
  }
};
EmailEditorComponent.ɵfac = function EmailEditorComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || EmailEditorComponent)();
};
EmailEditorComponent.ɵcmp = ɵɵdefineComponent({
  type: EmailEditorComponent,
  selectors: [["email-editor"]],
  inputs: {
    editorId: "editorId",
    options: "options",
    projectId: "projectId",
    scriptUrl: "scriptUrl",
    tools: "tools",
    appearance: "appearance",
    locale: "locale",
    id: "id",
    minHeight: "minHeight"
  },
  outputs: {
    loaded: "loaded",
    ready: "ready"
  },
  standalone: false,
  decls: 1,
  vars: 3,
  consts: [[1, "unlayer-editor", 3, "id"]],
  template: function EmailEditorComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelement(0, "div", 0);
    }
    if (rf & 2) {
      ɵɵstyleProp("min-height", ctx.minHeight);
      ɵɵproperty("id", ctx.id);
    }
  },
  styles: ["[_nghost-%COMP%]{flex:1;display:flex}.unlayer-editor[_ngcontent-%COMP%]{flex:1;display:flex}"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmailEditorComponent, [{
    type: Component,
    args: [{
      selector: "email-editor",
      template: '<div [id]="id" class="unlayer-editor" [style.min-height]="minHeight"></div>\n',
      styles: [":host{flex:1;display:flex}.unlayer-editor{flex:1;display:flex}\n"]
    }]
  }], function() {
    return [];
  }, {
    editorId: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    projectId: [{
      type: Input
    }],
    scriptUrl: [{
      type: Input
    }],
    tools: [{
      type: Input
    }],
    appearance: [{
      type: Input
    }],
    locale: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    minHeight: [{
      type: Input
    }],
    loaded: [{
      type: Output
    }],
    ready: [{
      type: Output
    }]
  });
})();
var EmailEditorModule = class {
};
EmailEditorModule.ɵfac = function EmailEditorModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || EmailEditorModule)();
};
EmailEditorModule.ɵmod = ɵɵdefineNgModule({
  type: EmailEditorModule,
  declarations: [EmailEditorComponent],
  exports: [EmailEditorComponent]
});
EmailEditorModule.ɵinj = ɵɵdefineInjector({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmailEditorModule, [{
    type: NgModule,
    args: [{
      declarations: [EmailEditorComponent],
      imports: [],
      exports: [EmailEditorComponent]
    }]
  }], null, null);
})();
export {
  EmailEditorComponent,
  EmailEditorModule,
  EmailEditorService
};
//# sourceMappingURL=angular-email-editor.js.map
