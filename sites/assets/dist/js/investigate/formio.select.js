var j = function(e) {
            !function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && O(e, t)
            }(d, e);
            var t, n, c, f = S(d);
            function d() {
                return y(this, d),
                f.apply(this, arguments)
            }
            return t = d,
            c = [{
                key: "schema",
                value: function() {
                    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                        t[n] = arguments[n];
                    return a.default.schema.apply(a.default, [{
                        type: "select",
                        label: "Select",
                        key: "select",
                        idPath: "id",
                        data: {
                            values: [],
                            json: "",
                            url: "",
                            resource: "",
                            custom: ""
                        },
                        clearOnRefresh: !1,
                        limit: 100,
                        dataSrc: "values",
                        valueProperty: "",
                        lazyLoad: !0,
                        filter: "",
                        searchEnabled: !0,
                        searchField: "",
                        minSearch: 0,
                        readOnlyValue: !1,
                        authenticate: !1,
                        template: "<span>{{ item.label }}</span>",
                        selectFields: "",
                        searchThreshold: .3,
                        uniqueOptions: !1,
                        tableView: !0,
                        fuseOptions: {
                            include: "score",
                            threshold: .3
                        },
                        customOptions: {}
                    }].concat(t))
                }
            }, {
                key: "builderInfo",
                get: function() {
                    return {
                        title: "Select",
                        group: "basic",
                        icon: "th-list",
                        weight: 70,
                        documentation: "/userguide/#select",
                        schema: d.schema()
                    }
                }
            }],
            (n = [{
                key: "init",
                value: function() {
                    var e = this;
                    k(P(d.prototype), "init", this).call(this),
                    this.validators = this.validators.concat(["select"]);
                    var t = []
                      , n = o.default.debounce((function() {
                        t = [];
                        for (var n = arguments.length, r = new Array(n), o = 0; o < n; o++)
                            r[o] = arguments[o];
                        return e.updateItems.apply(e, r)
                    }
                    ), 100);
                    this.triggerUpdate = function() {
                        for (var e = arguments.length, r = new Array(e), o = 0; o < e; o++)
                            r[o] = arguments[o];
                        return r.length && (t = r),
                        n.apply(void 0, h(t))
                    }
                    ,
                    this.selectOptions = [],
                    this.isInfiniteScrollProvided && (this.isFromSearch = !1,
                    this.searchServerCount = null,
                    this.defaultServerCount = null,
                    this.isScrollLoading = !1,
                    this.searchDownloadedResources = [],
                    this.defaultDownloadedResources = []),
                    this.activated = !1,
                    this.itemsLoaded = new u.default((function(t) {
                        e.itemsLoadedResolve = t
                    }
                    ))
                }
            }, {
                key: "isEntireObjectDisplay",
                value: function() {
                    return "resource" === this.component.dataSrc && "data" === this.valueProperty
                }
            }, {
                key: "itemTemplate",
                value: function(e) {
                    if (o.default.isEmpty(e))
                        return "";
                    if (this.options.readOnly && this.component.readOnlyValue)
                        return this.itemValue(e);
                    if (e && !this.component.template) {
                        var t = e.label || e;
                        return "string" == typeof t ? this.t(t) : t
                    }
                    if ("string" == typeof e)
                        return this.t(e);
                    if (e.data) {
                        var n = /item\.data\.\w*/g.test(this.component.template);
                        e.data = this.isEntireObjectDisplay() && o.default.isObject(e.data) && !n ? JSON.stringify(e.data) : e.data
                    }
                    var r = this.sanitize(this.component.template ? this.interpolate(this.component.template, {
                        item: e
                    }) : e.label);
                    if (r) {
                        var i = r.replace(/<\/?[^>]+(>|$)/g, "");
                        if (!i || !this.t(i))
                            return;
                        return r.replace(i, this.t(i))
                    }
                    return JSON.stringify(e)
                }
            }, {
                key: "addOption",
                value: function(e, t) {
                    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
                      , r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : (0,
                    l.getRandomComponentId)();
                    if (!o.default.isNil(t)) {
                        var i = this.component.idPath ? this.component.idPath.split(".").reduceRight((function(e, t) {
                            return w({}, t, e)
                        }
                        ), r) : {}
                          , a = p({
                            value: o.default.isObject(e) && this.isEntireObjectDisplay() ? this.normalizeSingleValue(e) : o.default.isObject(e) ? e : o.default.isNull(e) ? this.emptyValue : String(this.normalizeSingleValue(e)),
                            label: t
                        }, i)
                          , s = !!this.component.uniqueOptions && !!this.selectOptions.find((function(e) {
                            return o.default.isEqual(e.value, a.value)
                        }
                        ));
                        if (!s && (e && this.selectOptions.push(a),
                        this.refs.selectContainer && "html5" === this.component.widget)) {
                            var u = document.createElement("div");
                            u.innerHTML = this.sanitize(this.renderTemplate("selectOption", {
                                selected: o.default.isEqual(this.dataValue, a.value),
                                option: a,
                                attrs: n,
                                id: r,
                                useId: "" === this.valueProperty && o.default.isObject(e) && r
                            })).trim(),
                            a.element = u.firstChild,
                            this.refs.selectContainer.appendChild(a.element)
                        }
                    }
                }
            }, {
                key: "addValueOptions",
                value: function(e) {
                    e = e || [];
                    var t = !1;
                    if (!this.selectOptions.length) {
                        var n = Array.isArray(this.dataValue) ? this.dataValue : [this.dataValue];
                        (t = this.addCurrentChoices(n, e)) || this.component.multiple || this.addPlaceholder()
                    }
                    return t
                }
            }, {
                key: "disableInfiniteScroll",
                value: function() {
                    this.downloadedResources && (this.downloadedResources.serverCount = this.downloadedResources.length,
                    this.serverCount = this.downloadedResources.length)
                }
            }, {
                key: "setItems",
                value: function(e, t) {
                    var n, r = this;
                    if ("string" == typeof e)
                        try {
                            e = JSON.parse(e)
                        } catch (t) {
                            console.warn(t.message),
                            e = []
                        }
                    if (this.component.onSetItems && "function" == typeof this.component.onSetItems) {
                        var i = this.component.onSetItems(this, e);
                        i && (e = i)
                    }
                    if (!this.choices && this.refs.selectContainer && (this.loading,
                    this.empty(this.refs.selectContainer)),
                    this.component.selectValues && (e = o.default.get(e, this.component.selectValues, e) || []),
                    this.isInfiniteScrollProvided) {
                        n = !!this.isSelectURL && o.default.isEqual(e, this.downloadedResources);
                        var a = this.component.limit > e.length
                          , s = n && this.downloadedResources && this.downloadedResources.length === e.length;
                        a ? this.disableInfiniteScroll() : s ? this.selectOptions = [] : this.serverCount = e.serverCount
                    }
                    if (this.isScrollLoading && e)
                        n || (this.downloadedResources = this.downloadedResources ? this.downloadedResources.concat(e) : e),
                        this.downloadedResources.serverCount = e.serverCount || this.downloadedResources.serverCount;
                    else if (this.downloadedResources = e || [],
                    this.selectOptions = [],
                    !o.default.isEmpty(this.dataValue) && this.component.idPath) {
                        var u = o.default.get(this.dataValue, this.component.idPath, null)
                          , l = !o.default.isNil(u) && e.find((function(e) {
                            return o.default.get(e, r.component.idPath) === u
                        }
                        ));
                        l && this.setValue(l)
                    }
                    if (t || this.addValueOptions(e),
                    "html5" !== this.component.widget || this.component.placeholder || this.addOption(null, ""),
                    o.default.each(e, (function(e, t) {
                        r.root && r.root.options.editForm && r.root.options.editForm._id && r.root.options.editForm._id === e._id || r.addOption(r.itemValue(e), r.itemTemplate(e), {}, o.default.get(e, r.component.idPath, String(t)))
                    }
                    )),
                    this.choices) {
                        if (this.choices.setChoices(this.selectOptions, "value", "label", !0),
                        this.overlayOptions) {
                            var c = this.choices.dropdown.element;
                            c.style.position = "fixed";
                            var f = function() {
                                var e = r.element.getBoundingClientRect()
                                  , t = e.top
                                  , n = e.height
                                  , o = e.width;
                                c.style.top = "".concat(t + n, "px"),
                                c.style.width = "".concat(o, "px")
                            };
                            f(),
                            ["scroll", "resize"].forEach((function(e) {
                                return r.addEventListener(window, e, f)
                            }
                            ))
                        }
                    } else
                        this.loading;
                    if (this.isScrollLoading = !1,
                    this.loading = !1,
                    this.dataValue)
                        this.setValue(this.dataValue, {
                            noUpdateEvent: !0
                        });
                    else {
                        var d = this.multiple ? this.defaultValue || [] : this.defaultValue;
                        d && this.setValue(d)
                    }
                    this.itemsLoadedResolve()
                }
            }, {
                key: "loadItems",
                value: function(e, t, n, r, a, s) {
                    var u = this;
                    r = r || {};
                    var l = parseInt(this.component.minSearch, 10);
                    if (this.component.searchField && l > 0 && (!t || t.length < l))
                        return this.setItems([]);
                    "GET" === (a = a || "GET").toUpperCase() && (s = null);
                    var c = this.component.limit || 100
                      , f = this.isScrollLoading ? this.selectOptions.length : 0
                      , d = "url" === this.component.dataSrc ? {} : {
                        limit: c,
                        skip: f
                    };
                    e = this.interpolate(e, {
                        formioBase: i.default.getBaseUrl(),
                        search: t,
                        limit: c,
                        skip: f,
                        page: Math.abs(Math.floor(f / c))
                    }),
                    this.component.searchField && t && (Array.isArray(t) ? d["".concat(this.component.searchField)] = t.join(",") : d["".concat(this.component.searchField)] = t),
                    this.component.selectFields && (d.select = this.component.selectFields),
                    this.component.sort && (d.sort = this.component.sort),
                    o.default.isEmpty(d) || (e += (e.includes("?") ? "&" : "?") + i.default.serialize(d, (function(e) {
                        return u.interpolate(e)
                    }
                    ))),
                    this.component.filter && (e += (e.includes("?") ? "&" : "?") + this.interpolate(this.component.filter)),
                    r.header = n,
                    this.loading = !0,
                    i.default.makeRequest(this.options.formio, "select", e, a, s, r).then((function(e) {
                        u.loading = !1,
                        u.setItems(e, !!t)
                    }
                    )).catch((function(e) {
                        u.isInfiniteScrollProvided && (u.setItems([]),
                        u.disableInfiniteScroll()),
                        u.isScrollLoading = !1,
                        u.loading = !1,
                        u.itemsLoadedResolve(),
                        u.emit("componentError", {
                            component: u.component,
                            message: e.toString()
                        }),
                        console.warn("Unable to load resources for ".concat(u.key))
                    }
                    ))
                }
            }, {
                key: "getCustomItems",
                value: function() {
                    return this.evaluate(this.component.data.custom, {
                        values: []
                    }, "values")
                }
            }, {
                key: "updateCustomItems",
                value: function() {
                    this.setItems(this.getCustomItems() || [])
                }
            }, {
                key: "refresh",
                value: function(e, t) {
                    var n = t.instance;
                    if (this.component.clearOnRefresh && n && !n.pristine && this.setValue(this.emptyValue),
                    this.component.lazyLoad)
                        return this.activated = !1,
                        this.loading = !0,
                        void this.setItems([]);
                    this.updateItems(null, !0)
                }
            }, {
                key: "updateItems",
                value: function(e, t) {
                    var n = this;
                    if (this.itemsLoaded = new u.default((function(e) {
                        n.itemsLoadedResolve = e
                    }
                    )),
                    !this.component.data)
                        return console.warn("Select component ".concat(this.key, " does not have data configuration.")),
                        void this.itemsLoadedResolve();
                    if (this.checkConditions())
                        switch (this.component.dataSrc) {
                        case "values":
                            this.setItems(this.component.data.values);
                            break;
                        case "json":
                            this.setItems(this.component.data.json);
                            break;
                        case "custom":
                            this.updateCustomItems();
                            break;
                        case "resource":
                            if (!this.component.data.resource || !t && !this.active)
                                return;
                            var r = this.options.formio ? this.options.formio.formsUrl : "".concat(i.default.getProjectUrl(), "/form");
                            if (r += "/".concat(this.component.data.resource, "/submission"),
                            t || this.additionalResourcesAvailable || this.dataValue.length && !this.serverCount)
                                try {
                                    this.loadItems(r, e, this.requestHeaders)
                                } catch (e) {
                                    console.warn("Unable to load resources for ".concat(this.key))
                                }
                            else
                                this.setItems(this.downloadedResources);
                            break;
                        case "url":
                            if (!t && !this.active && !this.calculatedValue)
                                return;
                            var a, s, l = this.component.data.url;
                            if (l.startsWith("/")) {
                                var c = l.startsWith("/project") ? i.default.getBaseUrl() : i.default.getProjectUrl() || i.default.getBaseUrl();
                                l = c + l
                            }
                            this.component.data.method ? s = "POST" === (a = this.component.data.method).toUpperCase() ? this.component.data.body : null : a = "GET";
                            var f = this.component.authenticate ? {} : {
                                noToken: !0
                            };
                            this.loadItems(l, e, this.requestHeaders, f, a, s);
                            break;
                        case "indexeddb":
                            if (window.indexedDB || window.alert("Your browser doesn't support current version of indexedDB"),
                            this.component.indexeddb && this.component.indexeddb.database && this.component.indexeddb.table) {
                                var d = window.indexedDB.open(this.component.indexeddb.database);
                                d.onupgradeneeded = function(e) {
                                    if (n.component.customOptions) {
                                        var t = e.target.result;
                                        t.createObjectStore(n.component.indexeddb.table, {
                                            keyPath: "myKey",
                                            autoIncrement: !0
                                        }).transaction.oncomplete = function() {
                                            var e = t.transaction(n.component.indexeddb.table, "readwrite");
                                            n.component.customOptions.forEach((function(t) {
                                                e.objectStore(n.component.indexeddb.table).put(t)
                                            }
                                            ))
                                        }
                                    }
                                }
                                ,
                                d.onerror = function() {
                                    window.alert(d.errorCode)
                                }
                                ,
                                d.onsuccess = function(e) {
                                    var t = e.target.result.transaction(n.component.indexeddb.table, "readwrite").objectStore(n.component.indexeddb.table);
                                    new u.default((function(e) {
                                        var n = [];
                                        t.getAll().onsuccess = function(t) {
                                            t.target.result.forEach((function(e) {
                                                n.push(e)
                                            }
                                            )),
                                            e(n)
                                        }
                                    }
                                    )).then((function(e) {
                                        o.default.isEmpty(n.component.indexeddb.filter) || (e = o.default.filter(e, n.component.indexeddb.filter)),
                                        n.setItems(e)
                                    }
                                    ))
                                }
                            }
                        }
                    else
                        this.itemsLoadedResolve()
                }
            }, {
                key: "addPlaceholder",
                value: function() {
                    this.component.placeholder && this.addOption("", this.component.placeholder, {
                        placeholder: !0
                    })
                }
            }, {
                key: "activate",
                value: function() {
                    !this.loading && this.active || this.setLoadingItem(),
                    this.active || (this.activated = !0,
                    this.triggerUpdate())
                }
            }, {
                key: "setLoadingItem",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    this.choices ? e ? this.choices.setChoices([{
                        value: "".concat(this.id, "-loading"),
                        label: "Loading...",
                        disabled: !0
                    }], "value", "label") : this.choices.setChoices([{
                        value: "",
                        label: '<i class="'.concat(this.iconClass("refresh"), '" style="font-size:1.3em;"></i>'),
                        disabled: !0
                    }], "value", "label", !0) : "url" !== this.component.dataSrc && "resource" !== this.component.dataSrc || this.addOption("", this.t("loading..."))
                }
            }, {
                key: "render",
                value: function() {
                    var e = this.inputInfo
                      , t = this.overlayOptions ? {
                        position: "fixed",
                        display: "block",
                        width: "400px",
                        height: "100%",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        "z-index": 2
                    } : null;
                    return e.attr = e.attr || {},
                    e.multiple = this.component.multiple,
                    k(P(d.prototype), "render", this).call(this, this.wrapElement(this.renderTemplate("select", {
                        input: e,
                        selectOptions: "",
                        styles: t,
                        index: null
                    })))
                }
            }, {
                key: "wrapElement",
                value: function(e) {
                    return this.component.addResource && !this.options.readOnly ? this.renderTemplate("resourceAdd", {
                        element: e
                    }) : e
                }
            }, {
                key: "choicesOptions",
                value: function() {
                    var e = !this.component.hasOwnProperty("searchEnabled") || this.component.searchEnabled
                      , t = this.t(this.component.placeholder)
                      , n = this.component.customOptions || {};
                    if ("string" == typeof n)
                        try {
                            n = JSON.parse(n)
                        } catch (e) {
                            console.warn(e.message),
                            n = {}
                        }
                    return p({
                        removeItemButton: !this.component.disabled && o.default.get(this.component, "removeItemButton", !0),
                        itemSelectText: "",
                        classNames: {
                            containerOuter: "choices form-group formio-choices",
                            containerInner: this.transform("class", "form-control ui fluid selection dropdown")
                        },
                        addItemText: !1,
                        placeholder: !!this.component.placeholder,
                        placeholderValue: t,
                        noResultsText: this.t("No results found"),
                        noChoicesText: this.t("No choices to choose from"),
                        searchPlaceholderValue: this.t("Type to search"),
                        shouldSort: !1,
                        position: this.component.dropdown || "auto",
                        searchEnabled: e,
                        searchChoices: !this.component.searchField,
                        searchFields: o.default.get(this, "component.searchFields", ["label"]),
                        fuseOptions: Object.assign({}, o.default.get(this, "component.fuseOptions", {}), {
                            include: "score",
                            threshold: o.default.get(this, "component.searchThreshold", .3)
                        }),
                        valueComparer: o.default.isEqual,
                        resetScrollPosition: !1
                    }, n)
                }
            }, {
                key: "attach",
                value: function(e) {
                    var t = this
                      , n = k(P(d.prototype), "attach", this).call(this, e);
                    this.loadRefs(e, {
                        selectContainer: "single",
                        addResource: "single",
                        autocompleteInput: "single"
                    });
                    var a = this.refs.autocompleteInput;
                    a && this.addEventListener(a, "change", (function(e) {
                        t.setValue(e.target.value)
                    }
                    ));
                    var u = this.refs.selectContainer;
                    if (u) {
                        if (this.addEventListener(u, this.inputInfo.changeEvent, (function() {
                            return t.updateValue(null, {
                                modified: !0
                            })
                        }
                        )),
                        this.attachRefreshOnBlur(),
                        "html5" === this.component.widget)
                            return this.triggerUpdate(null, !0),
                            this.setItems(this.selectOptions || []),
                            this.focusableElement = u,
                            this.addEventListener(u, "focus", (function() {
                                return t.update()
                            }
                            )),
                            void this.addEventListener(u, "keydown", (function(e) {
                                var n = e.key;
                                ["Backspace", "Delete"].includes(n) && t.setValue(t.emptyValue)
                            }
                            ));
                        var l = u.tabIndex;
                        this.addPlaceholder(),
                        u.setAttribute("dir", this.i18next.dir()),
                        this.choices && this.choices.destroy();
                        var c = this.choicesOptions();
                        return this.choices = new r.default(u,c),
                        this.selectOptions && this.selectOptions.length && this.choices.setChoices(this.selectOptions, "value", "label", !0),
                        this.component.multiple ? this.focusableElement = this.choices.input.element : (this.focusableElement = this.choices.containerInner.element,
                        this.choices.containerOuter.element.setAttribute("tabIndex", "-1"),
                        c.searchEnabled && this.addEventListener(this.choices.containerOuter.element, "focus", (function() {
                            return t.focusableElement.focus()
                        }
                        ))),
                        this.isInfiniteScrollProvided && (this.scrollList = this.choices.choiceList.element,
                        this.addEventListener(this.scrollList, "scroll", (function() {
                            return t.onScroll()
                        }
                        ))),
                        this.focusableElement.setAttribute("tabIndex", l),
                        this.component.searchField && (this.choices && this.choices.input && this.choices.input.element && this.addEventListener(this.choices.input.element, "input", (function(e) {
                            t.isFromSearch = !!e.target.value,
                            e.target.value ? (t.serverCount = null,
                            t.downloadedResources = []) : t.triggerUpdate()
                        }
                        )),
                        this.addEventListener(u, "choice", (function() {
                            t.component.multiple && "resource" === t.component.dataSrc && t.isFromSearch && t.triggerUpdate(),
                            t.isFromSearch = !1
                        }
                        )),
                        this.addEventListener(u, "search", (function(e) {
                            return t.triggerUpdate(e.detail.value)
                        }
                        )),
                        this.addEventListener(u, "stopSearch", (function() {
                            return t.triggerUpdate()
                        }
                        )),
                        this.addEventListener(u, "hideDropdown", (function() {
                            t.choices.input.element.value = "",
                            t.updateItems(null, !0)
                        }
                        ))),
                        this.addEventListener(u, "showDropdown", (function() {
                            return t.update()
                        }
                        )),
                        c.placeholderValue && this.choices._isSelectOneElement && (this.addPlaceholderItem(c.placeholderValue),
                        this.addEventListener(u, "removeItem", (function() {
                            t.addPlaceholderItem(c.placeholderValue)
                        }
                        ))),
                        this.addValueOptions(),
                        this.setChoicesValue(this.dataValue),
                        this.isSelectResource && this.refs.addResource && this.addEventListener(this.refs.addResource, "click", (function(e) {
                            e.preventDefault();
                            var n = t.ce("div")
                              , r = t.createModal(n)
                              , a = o.default.get(t.root, "formio.projectUrl", i.default.getBaseUrl())
                              , u = "".concat(a, "/form/").concat(t.component.data.resource);
                            new s.default(n,u,{}).ready.then((function(e) {
                                e.on("submit", (function(e) {
                                    var n = t.valueProperty ? o.default.get(e, t.valueProperty) : e;
                                    t.component.multiple && (n = [].concat(h(t.dataValue), [n])),
                                    t.setValue(n),
                                    t.triggerUpdate(),
                                    r.close()
                                }
                                ))
                            }
                            ))
                        }
                        )),
                        this.disabled = this.shouldDisabled,
                        this.triggerUpdate(),
                        n
                    }
                }
            }, {
                key: "onScroll",
                value: function() {
                    this.isLoadingAvailable && (this.isScrollLoading = !0,
                    this.setLoadingItem(!0),
                    this.triggerUpdate(this.choices.input.element.value))
                }
            }, {
                key: "attachRefreshOnBlur",
                value: function() {
                    var e = this;
                    this.component.refreshOnBlur && this.on("blur", (function(t) {
                        e.checkRefreshOn([{
                            instance: t,
                            value: t.dataValue
                        }], {
                            fromBlur: !0
                        })
                    }
                    ))
                }
            }, {
                key: "addPlaceholderItem",
                value: function(e) {
                    this.choices._store.activeItems.length || this.choices._addItem({
                        value: e,
                        label: e,
                        choiceId: 0,
                        groupId: -1,
                        customProperties: null,
                        placeholder: !0,
                        keyCode: null
                    })
                }
            }, {
                key: "update",
                value: function() {
                    "custom" === this.component.dataSrc && this.updateCustomItems(),
                    this.activate()
                }
            }, {
                key: "addCurrentChoices",
                value: function(e, t, n) {
                    var r = this;
                    if (!e)
                        return !1;
                    var i = []
                      , a = e.reduce((function(e, a) {
                        if (!a || o.default.isEmpty(a))
                            return e;
                        var s = !1
                          , u = t === r.selectOptions;
                        return t && t.length && o.default.each(t, (function(e) {
                            if (e._id && a._id && e._id === a._id)
                                return s = !0,
                                !1;
                            var t = n ? e.value : r.itemValue(e, u);
                            return !(s |= o.default.isEqual(t, a))
                        }
                        )),
                        s ? s || e : (i.push({
                            value: r.itemValue(a),
                            label: r.itemTemplate(a)
                        }),
                        !0)
                    }
                    ), !1);
                    return i.length && (this.choices ? this.choices.setChoices(i, "value", "label") : i.map((function(e) {
                        r.addOption(e.value, e.label)
                    }
                    ))),
                    a
                }
            }, {
                key: "getValueAsString",
                value: function(e) {
                    return this.component.multiple && Array.isArray(e) ? e.map(this.asString.bind(this)).join(", ") : this.asString(e)
                }
            }, {
                key: "getValue",
                value: function() {
                    if (this.viewOnly || this.loading || !this.component.lazyLoad && !this.selectOptions.length || !this.element)
                        return this.dataValue;
                    var e = this.emptyValue;
                    if (this.choices)
                        e = this.choices.getValue(!0),
                        !this.component.multiple && this.component.placeholder && e === this.t(this.component.placeholder) && (e = this.emptyValue);
                    else if (this.refs.selectContainer) {
                        if (e = this.refs.selectContainer.value,
                        "" === this.valueProperty) {
                            if ("" === e)
                                return {};
                            var t = this.selectOptions[e];
                            t && o.default.isObject(t.value) && (e = t.value)
                        }
                    } else
                        e = this.dataValue;
                    return null == e && (e = ""),
                    e
                }
            }, {
                key: "redraw",
                value: function() {
                    var e = k(P(d.prototype), "redraw", this).call(this);
                    return this.triggerUpdate(),
                    e
                }
            }, {
                key: "normalizeSingleValue",
                value: function(e) {
                    if (!o.default.isNil(e)) {
                        if (o.default.isObject(e) && 0 === Object.keys(e).length)
                            return e;
                        var t = this.isEntireObjectDisplay()
                          , n = this.component.dataType || "auto"
                          , r = {
                            value: e,
                            number: function() {
                                var t = Number(this.value)
                                  , n = e.toString() === t.toString();
                                return !Number.isNaN(t) && Number.isFinite(t) && "" !== e && n && (this.value = t),
                                this
                            },
                            boolean: function() {
                                return !o.default.isString(this.value) || "true" !== this.value.toLowerCase() && "false" !== this.value.toLowerCase() || (this.value = "true" === this.value.toLowerCase()),
                                this
                            },
                            string: function() {
                                return this.value = String(this.value),
                                this
                            },
                            object: function() {
                                return o.default.isObject(this.value) && t && (this.value = JSON.stringify(this.value)),
                                this
                            },
                            auto: function() {
                                return o.default.isObject(this.value) ? this.value = this.object().value : this.value = this.string().number().boolean().value,
                                this
                            }
                        };
                        try {
                            return r[n]().value
                        } catch (t) {
                            return console.warn("Failed to normalize value", t),
                            e
                        }
                    }
                }
            }, {
                key: "normalizeValue",
                value: function(e) {
                    var t = this;
                    return this.component.multiple && Array.isArray(e) ? e.map((function(e) {
                        return t.normalizeSingleValue(e)
                    }
                    )) : k(P(d.prototype), "normalizeValue", this).call(this, this.normalizeSingleValue(e))
                }
            }, {
                key: "setValue",
                value: function(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                      , n = this.dataValue
                      , r = this.updateValue(e, t);
                    e = this.dataValue;
                    var i = Array.isArray(n) ? n.length : n
                      , a = Array.isArray(e) ? e.length : e;
                    if (this.component.multiple && Array.isArray(e) ? e = e.map((function(e) {
                        return "boolean" == typeof e || "number" == typeof e ? e.toString() : e
                    }
                    )) : "boolean" != typeof e && "number" != typeof e || (e = e.toString()),
                    this.loading)
                        return r;
                    if (this.isInitApiCallNeeded(a)) {
                        this.loading = !0,
                        this.lazyLoadInit = !0;
                        var s = this.component.searchField || this.component.valueProperty;
                        return this.triggerUpdate(o.default.get(e.data || e, s, e), !0),
                        r
                    }
                    return this.addValueOptions(),
                    this.setChoicesValue(e, i, t),
                    r
                }
            }, {
                key: "isInitApiCallNeeded",
                value: function(e) {
                    return this.component.lazyLoad && !this.lazyLoadInit && !this.active && !this.selectOptions.length && e && this.visible && (this.component.searchField || this.component.valueProperty)
                }
            }, {
                key: "setChoicesValue",
                value: function(e, t) {
                    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
                      , r = Array.isArray(e) ? e.length : e;
                    if (t = void 0 === t || t,
                    this.choices)
                        if (r) {
                            this.choices.removeActiveItems();
                            var i = Array.isArray(e) ? e : [e];
                            this.addCurrentChoices(i, this.selectOptions, !0) || this.choices.setChoices(this.selectOptions, "value", "label", !0),
                            this.choices.setChoiceByValue(e)
                        } else
                            (t || n.resetValue) && this.choices.removeActiveItems();
                    else if (r) {
                        var a = Array.isArray(e) ? e : [e];
                        o.default.each(this.selectOptions, (function(e) {
                            o.default.each(a, (function(t) {
                                if (o.default.isEqual(t, e.value) && e.element)
                                    return e.element.selected = !0,
                                    e.element.setAttribute("selected", "selected"),
                                    !1
                            }
                            ))
                        }
                        ))
                    } else
                        o.default.each(this.selectOptions, (function(e) {
                            e.element && (e.element.selected = !1,
                            e.element.removeAttribute("selected"))
                        }
                        ))
                }
            }, {
                key: "deleteValue",
                value: function() {
                    this.setValue("", {
                        noUpdateEvent: !0
                    }),
                    this.unset()
                }
            }, {
                key: "validateMultiple",
                value: function() {
                    return !1
                }
            }, {
                key: "isBooleanOrNumber",
                value: function(e) {
                    return "number" == typeof e || "boolean" == typeof e
                }
            }, {
                key: "getNormalizedValues",
                value: function() {
                    var e = this;
                    if (this.component && this.component.data && this.component.data.values)
                        return this.component.data.values.map((function(t) {
                            return {
                                label: t.label,
                                value: String(e.normalizeSingleValue(t.value))
                            }
                        }
                        ))
                }
            }, {
                key: "asString",
                value: function(e) {
                    var t = this
                      , n = function(e, n) {
                        return n ? (Array.isArray(e) ? e.forEach((function(e) {
                            return e[n] = e[n].toString()
                        }
                        )) : e[n] = e[n].toString(),
                        e) : (t.isBooleanOrNumber(e) && (e = e.toString()),
                        Array.isArray(e) && e.some((function(e) {
                            return t.isBooleanOrNumber(e)
                        }
                        )) && (e = e.map((function(e) {
                            t.isBooleanOrNumber(e) && (e = e.toString())
                        }
                        ))),
                        e)
                    };
                    if (e = n(e = e || this.getValue()),
                    ["values", "custom"].includes(this.component.dataSrc)) {
                        var r = "values" === this.component.dataSrc ? {
                            items: n(this.getNormalizedValues(), "value"),
                            valueProperty: "value"
                        } : {
                            items: n(this.getCustomItems(), this.valueProperty),
                            valueProperty: this.valueProperty
                        }
                          , i = r.items
                          , a = r.valueProperty;
                        e = this.component.multiple && Array.isArray(e) ? o.default.filter(i, (function(t) {
                            return e.includes(t.value)
                        }
                        )) : a ? o.default.find(i, [a, e]) : e
                    }
                    if (o.default.isString(e))
                        return e;
                    if (Array.isArray(e)) {
                        var s = [];
                        return e.forEach((function(e) {
                            return s.push(t.itemTemplate(e))
                        }
                        )),
                        s.length > 0 ? s.join("<br />") : "-"
                    }
                    return o.default.isNil(e) ? "-" : this.itemTemplate(e)
                }
            }, {
                key: "detach",
                value: function() {
                    k(P(d.prototype), "detach", this).call(this),
                    this.choices && (this.choices.destroy(),
                    this.choices = null)
                }
            }, {
                key: "focus",
                value: function() {
                    this.focusableElement && (k(P(d.prototype), "focus", this).call(this),
                    this.focusableElement.focus())
                }
            }, {
                key: "setErrorClasses",
                value: function(e, t, n) {
                    k(P(d.prototype), "setErrorClasses", this).call(this, e, t, n),
                    this.choices ? k(P(d.prototype), "setErrorClasses", this).call(this, [this.choices.containerInner.element], t, n) : k(P(d.prototype), "setErrorClasses", this).call(this, [this.refs.selectContainer], t, n)
                }
            }, {
                key: "dataReady",
                get: function() {
                    return this.itemsLoaded
                }
            }, {
                key: "defaultSchema",
                get: function() {
                    return d.schema()
                }
            }, {
                key: "emptyValue",
                get: function() {
                    if (this.component.multiple)
                        return [];
                    if ("json" === this.component.dataSrc && this.component.data.json) {
                        var e, t = this.component.data.json[0];
                        return (e = this.valueProperty ? o.default.get(t, this.valueProperty) : t) && "string" == typeof e ? "" : {}
                    }
                    return this.valueProperty ? "" : {}
                }
            }, {
                key: "overlayOptions",
                get: function() {
                    return this.parent && this.parent.component && "table" === this.parent.component.type
                }
            }, {
                key: "valueProperty",
                get: function() {
                    return this.component.valueProperty ? this.component.valueProperty : "values" === this.component.dataSrc ? "value" : ""
                }
            }, {
                key: "inputInfo",
                get: function() {
                    var e = k(P(d.prototype), "elementInfo", this).call(this);
                    return e.type = "select",
                    e.changeEvent = "change",
                    e
                }
            }, {
                key: "isSelectResource",
                get: function() {
                    return "resource" === this.component.dataSrc
                }
            }, {
                key: "isSelectURL",
                get: function() {
                    return "url" === this.component.dataSrc
                }
            }, {
                key: "isInfiniteScrollProvided",
                get: function() {
                    return this.isSelectResource || this.isSelectURL
                }
            }, {
                key: "shouldDisabled",
                get: function() {
                    return k(P(d.prototype), "shouldDisabled", this) || this.parentDisabled
                }
            }, {
                key: "requestHeaders",
                get: function() {
                    var e = this
                      , t = new i.default.Headers;
                    if (this.component.data && this.component.data.headers)
                        try {
                            o.default.each(this.component.data.headers, (function(n) {
                                n.key && t.set(n.key, e.interpolate(n.value))
                            }
                            ))
                        } catch (e) {
                            console.warn(e.message)
                        }
                    return t
                }
            }, {
                key: "additionalResourcesAvailable",
                get: function() {
                    return o.default.isNil(this.serverCount) || this.serverCount > this.downloadedResources.length
                }
            }, {
                key: "serverCount",
                get: function() {
                    return this.isFromSearch ? this.searchServerCount : this.defaultServerCount
                },
                set: function(e) {
                    this.isFromSearch ? this.searchServerCount = e : this.defaultServerCount = e
                }
            }, {
                key: "downloadedResources",
                get: function() {
                    return this.isFromSearch ? this.searchDownloadedResources : this.defaultDownloadedResources
                },
                set: function(e) {
                    this.isFromSearch ? this.searchDownloadedResources = e : this.defaultDownloadedResources = e
                }
            }, {
                key: "active",
                get: function() {
                    return !this.component.lazyLoad || this.activated || this.options.readOnly
                }
            }, {
                key: "isLoadingAvailable",
                get: function() {
                    return !this.isScrollLoading && this.additionalResourcesAvailable
                }
            }, {
                key: "disabled",
                set: function(e) {
                    g(P(d.prototype), "disabled", e, this, !0),
                    this.choices && (e ? (this.setDisabled(this.choices.containerInner.element, !0),
                    this.focusableElement.removeAttribute("tabIndex"),
                    this.choices.disable()) : (this.setDisabled(this.choices.containerInner.element, !1),
                    this.focusableElement.setAttribute("tabIndex", this.component.tabindex || 0),
                    this.choices.enable()))
                },
                get: function() {
                    return k(P(d.prototype), "disabled", this)
                }
            }, {
                key: "visible",
                set: function(e) {
                    e && !this._visible != !e && this.triggerUpdate(),
                    g(P(d.prototype), "visible", e, this, !0)
                },
                get: function() {
                    return k(P(d.prototype), "visible", this)
                }
            }]) && v(t.prototype, n),
            c && v(t, c),
            d
        }