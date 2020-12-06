var environmentHandler = {
    addEnvironment: function (name, country, city, temp_inside, temp_outside, humidity_inside, humidity_outside,
                              wind, rain, CO2_level, outdoor_CO2_level, num_comp, desk_work, num_doors,
                              num_windows, energy_balance, heat_losses, pmv_status, HVAC_heat_prod, HVAC_status,
                              number_lamps, light_pow_consumption, lux_level, outdoor_lux, isLightAuthoSwitched,
                              isDoorAuthoOpened, areWindowShadesAuthoMoved, isHVACsystemAuthoControlled, ratio_comfort_economy) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into environments(name, address_country, " +
                    "address_city, temp_inside, temp_outside, humidity_inside," +
                    "humidity_outside, wind_kmhr, rain_perc, CO2_level," +
                    "outdoor_CO2_level, number_of_computers, desk_work, number_of_doors," +
                    "number_of_windows, energy_balance, heat_losses, pmv_status," +
                    "HVAC_heat_prod, HVAC_status, number_of_lamps, light_power_consumption," +
                    "lux_level, outdoor_lux_level, isLightAuthoSwitched, isDoorAuthoOpened, areWindowShadesAuthoMoved," +
                    "isHVACsystemAuthoControlled, ratio_comfort_economy) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [name, country, city, temp_inside, temp_outside, humidity_inside, humidity_outside,
                        wind, rain, CO2_level, outdoor_CO2_level, num_comp, desk_work, num_doors,
                        num_windows, energy_balance, heat_losses, pmv_status, HVAC_heat_prod, HVAC_status,
                        number_lamps, light_pow_consumption, lux_level, outdoor_lux, isLightAuthoSwitched,
                        isDoorAuthoOpened, areWindowShadesAuthoMoved, isHVACsystemAuthoControlled, ratio_comfort_economy],
                    function (tx, results) {

                    },
                    function (tx, error) {
                        console.log("add product error: " + error.message);
                    }
                );
            },
            function (error) {
            },
            function () {
            }
        );
    },

    generateNewActuators: function (environment_id) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("insert or ignore into setActuators(fanTurnedOn, heaterTurnedON, airConditionerTurnedOn, " +
                    "lampsAreTurnedON, num_LampsON, environment_id) values(false, false, false, false, 0, ?)",
                    [environment_id]);
                tx.executeSql("insert or ignore into actions(moveShades, openWindow, " +
                    "turnOnFan, turnOnHeater, turnOnAirCon, turnOnLamp, turnOnComputer, " +
                    "num_LampsON, num_CompsON, currentCost, environment_id) values(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?)",
                    [environment_id]);
            }
        );
    },

    addUser: function (name, environment_id) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into users(name, environment_id) values(?, ?)",
                    [name, environment_id],
                    function (tx, results) {
                    },
                    function (tx, error) {
                        console.log("add user error: " + error.message);
                    }
                );
            },
            function (error) {
            },
            function () {
            }
        );
    },

    loadProducts: function (displayEnvironments) {
        databaseHandler.db.readTransaction(
            function (tx) {
                tx.executeSql(
                    "select * from environments",
                    [],
                    function (tx, results) {
                        //Do the display
                        displayEnvironments(results);
                        generateActuatorsAndActions(results);
                    },
                    function (tx, error) {
                        console.log("Error while selecting the environments" + error.message);
                    },
                    function () {
                        console.log("Selecting environments was successful");
                    }
                );
            }
        );
    },

    loadEnvironment: function (setRules, value) {
        databaseHandler.db.readTransaction(
            function (tx) {
                tx.executeSql(
                    "select * from environments where id = ?",
                    [value],
                    function (tx, results) {
                        //Do the display
                        setRules(results, value);
                    },
                    function (tx, error) {
                        console.log("Error while selecting the environments" + error.message);
                    },
                    function () {
                        console.log("Selecting environments was successful");
                    }
                );
            }
        );
    },

    loadEnvironmentNames: function (displayNames) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "select id, name from environments",
                    [],
                    function (tx, results) {
                        //Do the display
                        displayNames(results);
                    },
                    function (tx, error) {
                        console.log("Error while selecting the environments' names" + error.message);
                    },
                    function () {
                        console.log("Selecting environments' names was successful");
                    }
                );
            }
        );
    },

    getNumberOfUsers: function (displayUsers, value) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "select * from users where environment_id = ?",
                    [value],
                    function (tx, results) {
                        //Do the display
                        displayUsers(results);
                    },
                    function (tx, results) {
                        //Do the display
                        displayUserNames(results);
                    },
                    function (tx, error) {
                        console.log("Error while selecting the users" + error.message);
                    },
                    function () {
                        console.log("Selecting users was successful");
                    }
                );
            }
        );
    },

    getUserAsked: function (displayUsers, value, i) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "select * from users where environment_id = ?",
                    [value],
                    function (tx, results) {
                        //Do the display
                        getUser(results, value, i);
                    },
                    function (tx, error) {
                        console.log("Error while selecting the users" + error.message);
                    },
                    function () {
                        console.log("Selecting users was successful");
                    }
                );
            }
        );
    },

    setQuestionsAndRules: function (askQuestionsAndActions, value, selectedUser) {
        databaseHandler.db.readTransaction(
            function (tx) {
                tx.executeSql(
                    "select * from environments where id = ?",
                    [value],
                    function (tx, results) {
                        //Do the display
                        askQuestionsAndActions(results, selectedUser, value);
                    },
                    function (tx, error) {
                        console.log("Error while selecting the environments" + error.message);
                    }
                );
            }
        );
    },

    deleteEnvironment: function (id) {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql(
                    "delete from environments where id = ?",
                    [id],
                    function (tx, results) {
                    },
                    function (tx, error) {
                        console.log("Error happen when deleting: " + error.message);
                    }
                );
            }
        );
    },

    retrieveActions: function (getActions, currentCost, environment_id, ratioBestCost) {
        databaseHandler.db.readTransaction(
            function (tx) {
                tx.executeSql("select * from actions where environment_id = ?",
                    [environment_id],
                    function (tx, results) {
                        //Do the display
                        getActions(results, currentCost, ratioBestCost, environment_id);
                    });
            }
        );
    },

    setCostsForRatio: function (setMinMaxCosts, ratio, currentCost, environment_id) {
        databaseHandler.db.readTransaction(
            function (tx) {
                tx.executeSql("select * from ratioCosts WHERE minRatio <= ? AND maxRatio > ?",
                    [ratio, ratio],
                    function (tx, results) {
                        setMinMaxCosts(results, currentCost, environment_id);
                    },
                    function (tx, error) {
                        console.log("setting ratio costs error: " + error.message);
                    });
            }
        );
    },

    updateValue: function (variable, newValue, environment_id) {
        databaseHandler.db.transaction(
            function (tx) {
                switch (variable) {
                    case 'temp_inside':
                        tx.executeSql("update environments set temp_inside = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'temp_outside':
                        tx.executeSql("update environments set temp_outside = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'hum_inside':
                        tx.executeSql("update environments set humidity_inside = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'hum_outside':
                        tx.executeSql("update environments set humidity_outside = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'wind':
                        tx.executeSql("update environments set wind_kmhr = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'rain':
                        tx.executeSql("update environments set rain_perc = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'CO2_inside':
                        tx.executeSql("update environments set CO2_level = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'CO2_outside':
                        tx.executeSql("update environments set outdoor_CO2_level = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'comp':
                        tx.executeSql("update environments set number_of_computers = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'door':
                        tx.executeSql("update environments set number_of_doors = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'window':
                        tx.executeSql("update environments set number_of_windows = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'lamp':
                        tx.executeSql("update environments set number_of_lamps = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'energy_balance':
                        tx.executeSql("update environments set energy_balance = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'heat_losses':
                        tx.executeSql("update environments set heat_losses = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'pmv_status':
                        tx.executeSql("update environments set pmv_status = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'hvac_prod':
                        tx.executeSql("update environments set HVAC_heat_prod = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'light':
                        tx.executeSql("update environments set light_power_consumption = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'lux_inside':
                        tx.executeSql("update environments set lux_level = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    case 'lux_outside':
                        tx.executeSql("update environments set outdoor_lux_level = ? where id = ?;",
                            [newValue, environment_id]);
                        break;
                    default:
                        break;
                }
            }
        );
    },

    updateSetActuators: function (actuator, environment_id) {
        databaseHandler.db.transaction(
            function (tx) {
                switch (actuator) {
                    case 'heater':
                        tx.executeSql("update setActuators set heaterTurnedON = 'true' where id = ?;",
                            [environment_id]);
                        break;
                    case 'air conditioner':
                        tx.executeSql("update setActuators set airConditionerTurnedON = 'true' where id = ?;",
                            [environment_id]);
                        break;
                    case 'fan':
                        tx.executeSql("update setActuators set fanTurnedON = 'true' where id = ?;",
                            [environment_id]);
                        break;
                    case 'light':
                        tx.executeSql("update setActuators set lampsAreTurnedON = 'true' where id = ?;",
                            [environment_id]);
                        break;
                    default:
                        break;
                }
            }
        );
    },

    updateActions: function (actuator, value, environment_id) {
        databaseHandler.db.transaction(
            function (tx) {
                switch (actuator) {
                    case 'cost':
                        tx.executeSql("update actions set currentCost = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'heater':
                        tx.executeSql("update actions set turnOnHeater = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'air conditioner':
                        tx.executeSql("update actions set turnOnAirCon = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'window':
                        tx.executeSql("update actions set openWindow = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'fan':
                        tx.executeSql("update actions set turnOnFan = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'light':
                        tx.executeSql("update actions set turnOnLamp = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'computer':
                        tx.executeSql("update actions set turnOnComputer = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'shades':
                        tx.executeSql("update actions set moveShades = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'num_lamps':
                        tx.executeSql("update actions set num_LampsON = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    case 'num_comps':
                        tx.executeSql("update actions set  num_CompsON = ? where id = ?;",
                            [value, environment_id]);
                        break;
                    default:
                        break;
                }
            }
        );
    },

    fillInDatabase: function () {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("insert or ignore into environments(name, address_country, " +
                    "address_city, temp_inside, temp_outside, humidity_inside," +
                    "humidity_outside, wind_kmhr, rain_perc, CO2_level," +
                    "outdoor_CO2_level, number_of_computers, desk_work, number_of_doors," +
                    "number_of_windows, energy_balance, heat_losses, pmv_status," +
                    "HVAC_heat_prod, HVAC_status, number_of_lamps, light_power_consumption," +
                    "lux_level, outdoor_lux_level, isLightAuthoSwitched, isDoorAuthoOpened, areWindowShadesAuthoMoved," +
                    "isHVACsystemAuthoControlled, ratio_comfort_economy) values('Room 5161.0230(Rug University)', 'Netherlands', 'Groningen', 14, 10, 40, 60," +
                    "13, 20, 30, 40, 3, true, 4, 2, 1000, 500, 1, 1000, true, 3, 2000, 244, 400, 'true', 'false', 'true'," +
                    " 'false', 0.39)");
                tx.executeSql("insert or ignore into environments(name, address_country, " +
                    "address_city, temp_inside, temp_outside, humidity_inside," +
                    "humidity_outside, wind_kmhr, rain_perc, CO2_level," +
                    "outdoor_CO2_level, number_of_computers, desk_work, number_of_doors," +
                    "number_of_windows, energy_balance, heat_losses, pmv_status," +
                    "HVAC_heat_prod, HVAC_status, number_of_lamps, light_power_consumption," +
                    "lux_level, outdoor_lux_level, isLightAuthoSwitched, isDoorAuthoOpened, areWindowShadesAuthoMoved," +
                    "isHVACsystemAuthoControlled, ratio_comfort_economy) values('Smart House', 'France', 'Paris', null, 10, null, null," +
                    "11, 20, 10, 40, 3, true, 3, 2, 500, null, 1, 1000, 'true', 2, 2500, 244, 400, 'false', 'false', 'true'," +
                    " 'true', 3.0)");
                tx.executeSql("insert or ignore into users(name, environment_id) values ('Tom',1)");
                tx.executeSql("insert or ignore into users(name, environment_id) values ('Jack',1)");
                tx.executeSql("insert or ignore into users(name, environment_id) values ('Rachel',1)");
                tx.executeSql("insert or ignore into users(name, environment_id) values ('Tim',2)");
                tx.executeSql("insert or ignore into users(name, environment_id) values ('Jay',2)");
                tx.executeSql("insert or ignore into users(name, environment_id) values ('John',2)");
            },
            function (error) {
                console.log("Transaction error: " + error.message);
            },
            function () {
                console.log("Fill DB transaction completed successfully");
            }
        );
    },

    fillInRatioActuatorsTables: function () {
        databaseHandler.db.transaction(
            function (tx) {
                tx.executeSql("insert or ignore into ratioCosts(minRatio, maxRatio, bestMinCost, bestMaxCost, description) " +
                    "values(0, 0.33, 0, 30, 'It seems that saving energy is more important in this environment.')");
                tx.executeSql("insert or ignore into ratioCosts(minRatio, maxRatio, bestMinCost, bestMaxCost, description) " +
                    "values(0.33, 1, 30, 50, 'It seems that saving energy is more important in this environment.')");
                tx.executeSql("insert or ignore into ratioCosts(minRatio, maxRatio, bestMinCost, bestMaxCost, description) " +
                    "values(1, 3, 50, 80, 'It seems that comfort is more important in this environment.')");
                tx.executeSql("insert or ignore into ratioCosts(minRatio, maxRatio, bestMinCost, bestMaxCost, description) " +
                    "values(3, 100 , 80, 100, 'It seems that comfort is more important in this environment.')");
            },
            function (error) {
                console.log("Transaction error: " + error.message);
            },
            function () {
                console.log("Fill DB transaction completed successfully");
            }
        );
    },
};

