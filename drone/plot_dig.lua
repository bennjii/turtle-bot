print("TUNNELBOT @2021 UNREAL")
print("PLEASE PLACE ITEM[16] IN THE DIRECTION OF TRAVERSION... ")

print("How many plots? ")
local plot_count = read()
local plot_size = 8

print(plot_count)
print(plot_size)

function digArea(dig_down) 
    turtle.digUp()
    turtle.dig()

    if dig_down then
        turtle.digDown()
    end

    turtle.up()
    turtle.dig()
    turtle.digUp()

    turtle.down()
end

function fuelUp()
    local fuel_requirement = plot_count * (23 * plot_size)
    local prev_select = turtle.getSelectedSlot()

    for k = 1, 16 do
        -- print("Turtle has fuel ", turtle.getItemCount(k), " @ ", k)
        turtle.select(k)
        turtle.refuel()
    end

    turtle.select(prev_select)

    if turtle.getFuelLevel() < fuel_requirement or fuel_requirement > turtle.getFuelLimit() then
        print("Insufficient fuel to cover distance ", fuel_requirement)
        return false
    end
    
    return true
end 

function detectForward()
    local continue = true 
    local prev_select = turtle.getSelectedSlot()
    turtle.select(16)

    while continue do
        turtle.turnLeft()
        if turtle.compare() then
            continue = false
            break
        end
    end

    turtle.select(prev_select)
end

function digHalfRow(direction)
    -- Dig Lefts
    for k = 1, 3 do
        digArea(true)
        turtle.forward()

        if k == 3 then
            turtle.digDown()
        end
    end

    -- Return to Neutral
    for k = 1, 3 do
        turtle.back()
    end

    -- Perform Realignment
    if direction == "left" then
        turtle.turnRight()
    end
    
    if direction == "right" then
        turtle.turnLeft()
    end
end

function digRow()
    turtle.forward()

    turtle.turnLeft()
    digHalfRow("left")

    turtle.turnRight()
    digHalfRow("right")
end

if fuelUp() then
    print("Beginning operation of size ", plot_count * (23 * plot_size), " with fuel level ", turtle.getFuelLevel())
    -- Ensure facing towards destination location.
    detectForward()
    digArea(false)
    turtle.forward()

    for p = 1, plot_count do
        -- Each Plot 
        print("[PLOT] ", p)
        
        digArea(false)
        turtle.forward()
    
        for i = 1, plot_size do
            print("\t[ROW]", i)
            -- Each Row
            digRow()
            digArea(false)
    
            turtle.forward()
        end
    end
end