"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drone = void 0;
var console_1 = require("console");
var crypto_1 = require("crypto");
var events_1 = __importDefault(require("events"));
var nonces = new Set();
function getNonce() {
    var nonce = '';
    while (nonce === '' || nonces.has(nonce)) {
        nonce = (0, crypto_1.randomBytes)(4).toString('hex');
    }
    nonces.add(nonce);
    return nonce;
}
var Drone = /** @class */ (function (_super) {
    __extends(Drone, _super);
    function Drone(json, parent) {
        var _a;
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.ws = json.socket;
        _this.fuel = json.fuel;
        _this.max_fuel = json.max_fuel;
        _this.drone_id = json.drone_id;
        _this.inventory = json.inventory;
        _this.drone_name = json.drone_name;
        _this.selected_slot = json.selected_slot;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateInventory()];
                    case 1:
                        _a.sent();
                        this.emit('init');
                        return [2 /*return*/];
                }
            });
        }); });
        (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.on('message', function (data) {
            var parsed = JSON.parse(data);
            if (parsed.type == "delete") {
                parent.removeDrone(parsed.data.drone_id);
            }
        });
        return _this;
    }
    Drone.prototype.execute = function (string) {
        var _this = this;
        return new Promise(function (r) {
            var nonce = getNonce();
            _this.ws.send(JSON.stringify({
                type: "eval",
                function: "return + " + string,
                nonce: nonce
            }));
            var listener = function (_res) {
                try {
                    var res = JSON.parse(_res);
                    if ((res === null || res === void 0 ? void 0 : res.nonce) == nonce) {
                        r(res.data);
                        _this.ws.off('message', listener);
                    }
                }
                catch (e) { }
            };
            _this.ws.on('message', listener);
        });
    };
    Drone.prototype.toJSON = function () {
        return {
            drone_id: this.drone_id,
            drone_name: this.drone_name,
            inventory: this.inventory,
            selectedSlot: this.selected_slot,
            fuel: this.fuel,
            maxFuel: this.max_fuel,
        };
    };
    Drone.prototype.move = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute("turtle." + direction + "()")];
                    case 1:
                        r = _a.sent();
                        if (r)
                            this.fuel--;
                        return [4 /*yield*/, this.updatePosition(direction)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, r];
                }
            });
        });
    };
    Drone.prototype.turn = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var d, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        d = direction == "left" ? "turnLeft" : "turnRight";
                        return [4 /*yield*/, this.execute("turtle.turn" + d + "()")];
                    case 1:
                        r = _a.sent();
                        if (!r) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updatePosition(direction)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, r];
                }
            });
        });
    };
    Drone.prototype.dig = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute("turtle.dig" + this.parseDirection("dig", direction) + "()")];
                    case 1:
                        r = _a.sent();
                        return [4 /*yield*/, this.updateInventory()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, r];
                }
            });
        });
    };
    Drone.prototype.refuel = function (ammount) {
        return __awaiter(this, void 0, void 0, function () {
            var r, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.execute("turtle.refuel" + (typeof ammount === 'number' ? console_1.count.toString() : '') + "()")];
                    case 1:
                        r = _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.execute('turtle.getFuelLevel()')];
                    case 2:
                        _a.fuel = _b.sent();
                        return [4 /*yield*/, this.updateInventory()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, r];
                }
            });
        });
    };
    Drone.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.updateInventory()];
                    case 1:
                        _d.sent();
                        _a = this;
                        return [4 /*yield*/, this.execute('turtle.getSelectedSlot()')];
                    case 2:
                        _a.selected_slot = _d.sent();
                        _b = this;
                        return [4 /*yield*/, this.execute('turtle.getFuelLimit()')];
                    case 3:
                        _b.max_fuel = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.execute('turtle.getFuelLevel()')];
                    case 4:
                        _c.fuel = _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Drone.prototype.parseDirection = function (prefix, direction) {
        switch (direction) {
            case "forward":
                return prefix;
            case "up":
                return prefix + 'Up';
            case "down":
                return prefix + 'Down';
        }
    };
    Drone.prototype.updatePosition = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Future planning for creating a mapping protocol.
                console.log(direction);
                this.emit('update');
                return [2 /*return*/, true];
            });
        });
    };
    Drone.prototype.updateInventory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.execute('{' + new Array(16).fill(0).map(function (_, i) { return "turtle.getItemDetail(" + (i + 1) + ")"; }).join(', ') + '}')];
                    case 1:
                        _a.inventory = _b.sent();
                        while (this.inventory.length < 16) {
                            this.inventory.push({
                                count: 0,
                                name: '',
                                damage: 0
                            });
                        }
                        this.emit('update');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Drone;
}(events_1.default));
exports.Drone = Drone;
