-- Load json_lib.lua first
local json = require("json").json

-- main driver code 
Drone = {
    drone_name="",
    drone_id=os.getComputerID(),

    fleet_id="",
    fleet_name="default",

    fuel=turtle.getFuelLevel(),
    max_fuel=turtle.getFuelLimit(),

    selected_slot=turtle.getSelectedSlot()
}

-- print("Name your drone: ")
-- Drone.drone_name = read();

-- print("Enter new or existing fleet name: ")
-- Drone.fleet_name = read()

print("[BINDING] ... ")
print(">> TurtulOS")
local ws, err = http.websocket("ws://128.199.234.165:5757/");

if err then
    print(err)
elseif ws then
    ws.send(json.encode({
        type="setup",
        data=Drone
    }))

    while true do
        local message = ws.receive()
        -- print(message)

        if message == nil then
            break
        end

        -- print(message)
        local obj = json.decode(message)
        
        if obj.type == "setup" then
            term.clear()
            Drone = obj.data
            print("[BOUND] "..Drone.drone_id.." ("..Drone.drone_name..")")
            print(">> TurtleOS Bound & Operational")
        end

        if obj.type == "eval" then
            local func = loadstring(obj['function'])

            local result = func()
            ws.send(json.encode({type="res",data=result, nonce=obj.nonce}))
        end
    end
end

if ws then
    ws.send(json.encode({
        type="delete",
        data=Drone
    }));

    ws.close()
end