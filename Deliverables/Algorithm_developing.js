    // There are 5 actuators, which require energy: Heater, Ventilation, Air conditioner, Light(number of lamps)
    // and computers (number of computers). If we divide 100 by 5, we get that each actuator has cost = 20,
    // in case, we consider light and computers we have to 20 divide by number of lamps/computers = cost
    // required for using 1 computer. Because we have 4 different situations when ratio (comfort/saving) energy
    // between comfort and saving energy equal to 0-0.33, 0.33-1, 1-3 and >3, we can set rules in a way that
    // for ratio 0-0.33, we have to use energy with cost <= 20, for ratio 0.33-1 cost should be between 20 and 50
    // for ratio 1-3 cost is between 50 and 80, and for ratio >3 we have cost >= 80. Therefore, when we calculate
    // cost, we have to consider whether it is bigger of a certain number or not.

    // ideal CO2 level indoor is 400-1000
    // ideal indoor temperature is 20-25 for comfort and 15-20 for energy saving
    // ideal indoor humidity is 30-50%
    // ideal indoor lux level is 500-800 for study room or office

    setRules: function (t, l, c, h, nl, nc, r, tout, hvacOn, wOpen, dOpen, rain, wind, pmv) {
        //t - temperature, l - lux_level, c - co2 level, h - humidity, r - ratio,
        // nl - number of lamps, nc - number of computers
        //tout - temperature outside
        var currentCost = 0;
        var bestMinCost = 0;
        var bestMaxCost = 0;
        var lampCost = 20/nl;
        var compCost = 20/nc;
        if(r <= 0.33){
            bestMaxCost = 20;
        } else if(r > 0.33 && r <= 1){
            bestMinCost = 20;
            bestMaxCost = 50;
        } else if(r >1 && r <= 3){
            bestMinCost = 50;
            bestMaxCost = 80;
        } else if(r > 3){
            bestMinCost = 80;
            bestMaxCost = 100;
        }
        console.log("best minimum cost: " + bestMinCost + " best maximum cost: " + bestMaxCost);
        console.log("cost of one lamp: " + lampCost + " cost of one computer: " + compCost);

        //start with a temperature.
        if(r < 1){
            //comfort is less important than saving energy
            //ideal temperature should be between >15 && <25
            console.log("It seems that saving energy is more important in this environment.");
            if(t < 15){
                console.log("Your temperature indoor = " + t + ". It is not enough for an optimal value of temperature.");
                if(tout >=15){
                    console.log("It is warm enough outside. Outdoor temperature is " + tout);
                    this.rainAndWind(rain, wind, hvacOn, wOpen, currentCost);
                } else {
                    console.log("It is cold outside. Outdoor temperature is " + tout);
                    if(pmv < -1){
                        console.log("PMV status is " + pmv +". It is too cold.");
                        this.hvacONOFF(hvacOn);
                    } else {
                        console.log("Everything is good. No action is needed to perform.");
                    }
                }
            } else {
                if(pmv < 3){
                    console.log("Everything is good. No action is needed to perform.");
                } else {
                    console.log("PMV status is " + pmv + ". Too hot!");
                    this.rainAndWind(rain, wind, hvacOn, wOpen, currentCost);
                }
            }
        } else {
            if(pmv > 1){
                console.log("It is hot in the room.");
                this.hvacONOFF(hvacOn, currentCost);
            } else if(pmv < -1){
                console.log("It is cold in the room.");
                this.hvacONOFF(hvacOn, currentCost);
            } else {
                console.log("It is slightly cold/warm or neutral in the room.");
                if(hvacOn === true){
                    console.log("It is okay in the room. No need in a heater or air conditioner.");
                    console.log("Please, turn off heater/air conditioner");
                } else {
                    console.log("Everything is good. No action is needed to perform.");
                }
            }
        }
    },

    hvacONOFF: function(hvacOn, currentCost){
        if(hvacOn === false) {
            console.log("Turn on heater/air conditioner.");
        } else {
            console.log("Heater/air conditioner is on. No action is needed to perform.");
        }
        currentCost += 20;
        console.log("Your current cost is " + currentCost);
    },

    windowOpenClose: function(windowOpen){
        if(windowOpen === false) {
            console.log("Open window.");
        } else {
            console.log("Window is open. No action is needed to perform.");
        }
    },

    rainAndWind: function(rain, wind, hvacOn, wOpen, currentCost){
        if(rain === true){
            this.hvacONOFF(hvacOn, currentCost);
        } else {
            if(wind > 30){
                this.hvacONOFF(hvacOn, currentCost);
            } else {
                this.windowOpenClose(wOpen);
            }
        }
    }
};
