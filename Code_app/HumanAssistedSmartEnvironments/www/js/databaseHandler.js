var databaseHandler;
databaseHandler = {
    db: null,
    createDatabase: function () {
        this.db = window.openDatabase(
            "environment.db",
            "1.0",
            "environment database",
            1000000);
        this.db.transaction(
            function (tx) {
                //Run sql here using tx
                tx.executeSql(
                    "create table if not exists environments(id INTEGER primary key, name TEXT unique, address_country TEXT, " +
                    "address_city TEXT, temp_inside INTEGER, temp_outside INTEGER, humidity_inside INTEGER," +
                    "humidity_outside INTEGER, wind_kmhr FLOAT, rain_perc INTEGER, CO2_level FLOAT," +
                    "outdoor_CO2_level FLOAT, number_of_computers INTEGER, desk_work BOOLEAN, number_of_doors INTEGER," +
                    "number_of_windows INTEGER, energy_balance FLOAT, heat_losses FLOAT, pmv_status FLOAT," +
                    "HVAC_heat_prod FLOAT, HVAC_status BOOLEAN, number_of_lamps INTEGER, light_power_consumption INTEGER," +
                    "lux_level FLOAT, outdoor_lux_level FLOAT, isLightAuthoSwitched BOOLEAN, isDoorAuthoOpened BOOLEAN, areWindowShadesAuthoMoved BOOLEAN," +
                    "isHVACsystemAuthoControlled BOOLEAN, ratio_comfort_economy FLOAT)",
                    [],
                    function (tx, results) {
                    },
                    function (tx, error) {
                        console.log("Error while creating the table: " + error.message);
                    }
                );
            },
            function (error) {
                console.log("Transaction error: " + error.message);
            },
            function () {
                console.log("Create DB transaction completed successfully");
            }
        );
    },

    createUsersTable: function () {
        this.db.transaction(
            function (tx) {
                //Run sql here using tx
                tx.executeSql(
                    "create table if not exists users(id INTEGER primary key, name TEXT unique, environment_id " +
                    "INTEGER NOT NULL, FOREIGN KEY (environment_id) REFERENCES environments(id))",
                    []
                );
                tx.executeSql(
                    "create table if not exists ratioCosts(id INTEGER primary key, minRatio FLOAT unique, " +
                    "maxRatio FLOAT unique, bestMinCost INTEGER, bestMaxCost INTEGER, description TEXT)",
                    []
                );
                tx.executeSql(
                    "create table if not exists setActuators(id INTEGER primary key, fanTurnedOn BOOLEAN, " +
                    "heaterTurnedON BOOLEAN, airConditionerTurnedOn BOOLEAN, lampsAreTurnedON BOOLEAN, num_LampsON INTEGER, " +
                    "environment_id INTEGER NOT NULL unique, FOREIGN KEY (environment_id) REFERENCES environments(id))",
                    []
                );
                // 0 - turned off, 1 - automatically open, 2 - by human
                tx.executeSql(
                    "create table if not exists actions(id INTEGER primary key, moveShades INTEGER, openWindow INTEGER, " +
                    "turnOnFan INTEGER, turnOnHeater INTEGER, turnOnAirCon INTEGER, turnOnLamp INTEGER, turnOnComputer INTEGER, " +
                    "num_LampsON INTEGER, num_CompsON INTEGER, currentCost INTEGER, environment_id INTEGER NOT NULL unique, FOREIGN KEY (environment_id) " +
                    "REFERENCES environments(id))",
                    []
                );
            }
        );
    },
};