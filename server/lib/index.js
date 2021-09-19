"use strict";
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
var ws_1 = require("ws");
var socket_io_1 = require("socket.io");
// import { connect } from 'ngrok';
var fleet_manager_1 = require("./fleet_manager");
var uuid_1 = require("uuid");
var fs_1 = __importDefault(require("fs"));
var fleet = new ws_1.Server({ port: 5757 });
var fleetManager = new fleet_manager_1.FleetManager(fleet);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var web, fleetId, droneId;
    var _a;
    return __generator(this, function (_b) {
        // const fleetURL = await connect(5757);
        console.log("[URL] 128.199.234.165:5757");
        // const webURL = await connect(5758);
        fs_1.default.writeFileSync('../client/turtle-bot/public/ip.json', "{ \"url\": \"http://128.199.234.165:5758\" }");
        web = new socket_io_1.Server(5758, {
            cors: {
                origin: true,
                methods: ["GET", "POST"]
            }
        });
        fleetManager.newDroneFleet((0, uuid_1.v4)(), "fleet alpha");
        fleetManager.newDroneFleet((0, uuid_1.v4)(), "fleet beta");
        fleetId = (0, uuid_1.v4)();
        fleetManager.newDroneFleet(fleetId, "default");
        droneId = (0, uuid_1.v4)();
        (_a = fleetManager.getFleet(fleetId)) === null || _a === void 0 ? void 0 : _a.addDrone(droneId, "#1 pogg drone", null);
        console.log(fleetManager.getFleetByName("default"));
        web.on('connection', function (ws) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("[CONNECTION] Web");
                ws.on('message', function (data) {
                    if (data.type == "request") {
                        ws.send({
                            type: "response",
                            data: fleetManager.getFleetByName(data.data.fleet)
                        });
                    }
                });
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); })();
fleet.on('connection', function connection(ws) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("[CONNECTION] Drone");
            ws.on('message', function (data) {
                var _a, _b, _c;
                var parsed = JSON.parse(data);
                if (parsed.type == "setup") {
                    var droneData = parsed.data;
                    //@ts-expect-error
                    var fleetExists = fleetManager.getFleet(parsed.fleet_id);
                    if (fleetExists) {
                        var droneId = (0, uuid_1.v4)();
                        fleetExists.addDrone(droneId, droneData.drone_name, ws);
                        console.log("Added drone to existing fleet " + fleetExists.fleet_name);
                        var drone = fleetExists === null || fleetExists === void 0 ? void 0 : fleetExists.getDrone(droneId);
                        ws.send(JSON.stringify({
                            type: "setup",
                            data: {
                                drone_name: drone === null || drone === void 0 ? void 0 : drone.drone_name,
                                drone_id: drone === null || drone === void 0 ? void 0 : drone.drone_id,
                                fleet_id: fleetExists.fleet_id,
                                fleet_name: fleetExists.fleet_name,
                                setup: true
                            }
                        }));
                    }
                    else {
                        var fleetId = (0, uuid_1.v4)();
                        fleetManager.newDroneFleet(fleetId, droneData.fleet_name);
                        var droneId = (0, uuid_1.v4)();
                        (_a = fleetManager.getFleet(fleetId)) === null || _a === void 0 ? void 0 : _a.addDrone(droneId, droneData.drone_name, ws);
                        var drone = (_b = fleetManager.getFleet(fleetId)) === null || _b === void 0 ? void 0 : _b.getDrone(droneId);
                        ws.send(JSON.stringify({
                            type: "setup",
                            data: {
                                drone_name: drone === null || drone === void 0 ? void 0 : drone.drone_name,
                                drone_id: drone === null || drone === void 0 ? void 0 : drone.drone_id,
                                fleet_id: fleetId,
                                fleet_name: (_c = fleetManager.getFleet(fleetId)) === null || _c === void 0 ? void 0 : _c.fleet_name,
                                setup: true
                            }
                        }));
                    }
                }
            });
            return [2 /*return*/];
        });
    });
});
