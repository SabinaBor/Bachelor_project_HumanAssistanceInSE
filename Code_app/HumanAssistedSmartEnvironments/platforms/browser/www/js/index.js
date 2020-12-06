//Fills in the database
$(document).on("ready", function () {
    databaseHandler.createDatabase();
    databaseHandler.createUsersTable();
    environmentHandler.fillInDatabase();
    environmentHandler.fillInRatioActuatorsTables();
    environmentHandler.loadProducts(generateActuatorsAndActions);
});

//Shows data on the see data page
$(document).on("pagebeforeshow", "#seeDataPage", function () {
    environmentHandler.loadProducts(displayEnvironments);
});

//Holds all actions performed on the main/home page
$(document).on("pagebeforeshow", "#mainPage", function () {
    environmentHandler.loadEnvironmentNames(displayNames);

    $("#select-native-1").on("change", function () {
        //Frees page when a new environment is selected
        $("#mainPage-content").empty();
        $("#user-details").empty();
        $('#UserAsked').empty();
        $('#lstQuestions').empty();
        $('#user-names-details').empty();

        //Variable which holds the id of the selected environment
        var selectedOption = $(this).children("option:selected").val();
        $("#select-native-1").empty();
        //Gets all data from users table and display all users of the selected environment
        environmentHandler.getNumberOfUsers(displayUsers, selectedOption);

        //Displays a form which asks to choose whether the user is already in the system of not
        displayMainPageContent(selectedOption);

        //If the user is not in the system, then add user form is displayed
        $('input:radio[id="boolAddUserFalse"]').on("change", function () {
            if ($(this).is(':checked')) {
                displayAddUserForm(selectedOption);
            }
        });

        //Otherwise, the System asks the user to choose his/her name in the new appeared list
        $('input:radio[id="boolAddUserTrue"]').on("change", function () {
            if ($(this).is(':checked')) {
                $("#mainPage-content").empty();
                $("#user-details").empty();
                environmentHandler.getNumberOfUsers(displayUserNames, selectedOption);

                $('#user-names-details').on('change', '#select-native-3', function () {
                    //Variable which holds the id of the selected user's name
                    var selectedUser = $(this).children("option:selected").val();
                    $('#user-names-details').empty();
                    //The System asks whether the user is free at the moment
                    environmentHandler.getUserAsked(getUser, selectedOption, selectedUser);
                });
                // environmentHandler.setQuestionsAndRules(askQuestionsAndActions, selectedOption);
            }
        });
    });
});

//These lines are responsible for the slider's functionality
var slider = document.getElementById("ComfortEconomyRatio");

var output = document.getElementById("demo");

output.innerHTML = slider.val(); // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = this.val();
};

//Initialize the current environment
var currentEnvironment = {
    id: -1,
    name: "",
    address_country: "",
    address_city: "",
    temp_inside: -1,
    temp_outside: -1,
    humidity_inside: -1,
    humidity_outside: -1,
    wind_kmhr: -1.0,
    rain_perc: -1,
    CO2_level: -1.0,
    outdoor_CO2_level: -1.0,
    number_of_computers: -1,
    desk_work: false,
    number_of_doors: -1,
    number_of_windows: -1,
    energy_balance: -1.0,
    heat_losses: -1.0,
    pmv_status: -1.0,
    HVAC_heat_prod: -1.0,
    HVAC_status: false,
    number_of_lamps: -1,
    light_power_consumption: -1,
    lux_level: -1.0,
    outdoor_lux_level: -1.0,
    isLightAuthoSwitched: false,
    isDoorAuthoOpened: false,
    areWindowShadesAuthoMoved: false,
    isHVACsystemAuthoControlled: false,
    ratio_comfort_economy: -1.0
};

//Adds a new environment to the database
function addEnvironment() {
    //Collects all data filled in on the Add a new environment page
    var range = $("#ComfortEconomyRatio").val();
    var name = $("#envName").val();
    var country = $("#envCountry").val();
    var city = $("#txtEnvCity").val();
    var temp_inside = $("#txtTempInside").val();
    var temp_outside = $("#txtTempOutdoor").val();
    var hum_inside = $("#txtHumidityIndoor").val();
    var hum_outside = $("#txtHumidityOutdoor").val();
    var wind = $("#txtWind").val();
    var rain = $("#txtRain").val();
    var CO2_indoor = $("#txtCO2levelIndoor").val();
    var CO2_outdoor = $("#txtCO2levelOutdoor").val();
    var energy_balance = $("#txtEnergyBalance").val();
    var heat_losses = $("#txtHeatLosses").val();
    var pmv_status = $("#txtPMVstatus").val();
    var hvac_heat_prod = $("#txtHVACHeatProd").val();
    var light_pow_consumption = $("#txtLightPowerCon").val();
    var lux_level_indoor = $("#txtLuxLevelIn").val();
    var lux_level_outdoor = $("#txtLuxLevelOut").val();
    var number_of_computers = $("#txtComputersNum").val();
    var number_of_doors = $("#txtDoorsNum").val();
    var number_of_windows = $("#txtWindowsNum").val();
    var number_of_lamps = $("#txtLampsNum").val();

    var hvac_status = document.getElementById("boolHVACstatusTrue").checked;
    var desk_work = document.getElementById("boolDeskWorkTrue").checked;
    var switch_light = document.getElementById("boolSwitchLightTrue").checked;
    var open_door = document.getElementById("boolOpenDoorTrue").checked;
    var move_shades = document.getElementById("boolMoveShadesTrue").checked;
    var control_hvac = document.getElementById("boolControlHVACTrue").checked;

    //Computes the ratio between comfort and saving energy
    var ratio = range / (100 - range);

    //Name of the environment is required
    if (!name) {
        alert("Name is required");
    }

    //Checks whether the user answered all questions with radio buttons
    if ((!document.getElementById("boolHVACstatusTrue").checked && !document.getElementById("boolHVACstatusFalse").checked) ||
        (!document.getElementById("boolDeskWorkTrue").checked && !document.getElementById("boolDeskWorkFalse").checked) ||
        (!document.getElementById("boolSwitchLightTrue").checked && !document.getElementById("boolSwitchLightFalse").checked) ||
        (!document.getElementById("boolOpenDoorTrue").checked && !document.getElementById("boolCloseDoorFalse").checked) ||
        (!document.getElementById("boolMoveShadesTrue").checked && !document.getElementById("boolMoveShadesFalse").checked) ||
        (!document.getElementById("boolControlHVACTrue").checked && !document.getElementById("boolControlHVACFalse").checked)) {
        alert("Please, select one option everywhere");
    } else {
        //If everything is correct
        var r = confirm("Name: " + name + "\n" + "Ratio:" + ratio + "\n" + "Country: " + country + "\n" + "City:" + city + "\n" +
            "Temperature inside:" + temp_inside + "\n" + "Temperature outside:" + temp_outside + "\n" +
            "Humidity inside:" + hum_inside + "\n" + "Humidity outside:" + hum_outside + "\n" + "Wind:" + wind + "\n" +
            "Chance of rain:" + rain + "\n" + "CO2 level indoor:" + CO2_indoor + "\n" + "CO2 level outdoor:" +
            CO2_outdoor + "\n" + "Number of computers:" + number_of_computers + "\n" + "Desk work:" +
            desk_work + "\n" + "Number of doors:" + number_of_doors + "\n" + "Number of windows:" + number_of_windows + "\n" +
            "Energy balance:" + energy_balance + "\n" + "Heat losses:" + heat_losses + "\n" +
            "PMV status:" + pmv_status + "\n" + "HVAC heat production:" + hvac_heat_prod + "\n" + "HVAC status:" + hvac_status + "\n" +
            "Number of Lamps:" + number_of_lamps + "\n" + "Light Power Consumption:" + light_pow_consumption + "\n" +
            "Lux level indoor:" + lux_level_indoor + "\n" + "Lux level outdoor:" + lux_level_outdoor + "\n" +
            "Switch light on/off:" + switch_light + "\n" + "Open/Close doors:" + open_door + "\n" +
            "Move windows' shades:" + move_shades + "\n" + "Control HVAC:" + control_hvac);

        if (r === true) {
            //Adds all filled in data to the database
            environmentHandler.addEnvironment(name, country, city, temp_inside, temp_outside, hum_inside, hum_outside, wind,
                rain, CO2_indoor, CO2_outdoor, number_of_computers, desk_work, number_of_doors, number_of_windows, energy_balance,
                heat_losses, pmv_status, hvac_heat_prod, hvac_status, number_of_lamps, light_pow_consumption, lux_level_indoor,
                lux_level_outdoor, switch_light, open_door, move_shades, control_hvac, ratio);
            $("addNewEnvironmentPage").reload();
        }
    }
}

//Initializes setActuators and actions table
function generateActuatorsAndActions(results) {
    var length = results.rows.length;
    for (var i = 0; i < length; i++) {
        var item = results.rows.item(i);
        environmentHandler.generateNewActuators(item.id);
    }
}

//Adds a new user to the selected environment
function addUser(selectedOption) {
    var name = $("#userName").val();
    var environment_id = selectedOption;

    if (!name) {
        alert("Name is required");
    } else {
        var r = confirm("Name: " + name + "\n" + "Id:" + environment_id);

        if (r === true) {
            environmentHandler.addUser(name, environment_id);
            $("#userName").val("");
            $("#userEnvId").val("");
        }
    }
}

//Responsible for displaying data on the See Data page
function displayEnvironments(results) {
    var length = results.rows.length;
    var lstProducts = $("#lstEnvironments");

    lstProducts.empty();//Clean the old data before adding.

    for (var i = 0; i < length; i++) {
        var item = results.rows.item(i);
        var a = $("<a />");
        var h3 = $("<h3 />").text("Name: ");
        var pId = $("<p />").text("Id: ");
        var pCountry = $("<p />").text("Country: ");
        var pCity = $("<p />").text("City: ");
        var pTempIn = $("<p />").text("Temperature Inside: ");
        var pTempOut = $("<p />").text("Temperature Outside: ");
        var pHumIn = $("<p />").text("Humidity Inside: ");
        var pHumOut = $("<p />").text("Humidity Outside: ");
        var pWind = $("<p />").text("Speed of wind: ");
        var pRain = $("<p />").text("Chance of rain: ");
        var pCO2LevelIn = $("<p />").text("CO2 level indoor: ");
        var pCO2LevelOut = $("<p />").text("CO2 level outdoor: ");
        var pNumComp = $("<p />").text("Number of computers: ");
        var pNumDoors = $("<p />").text("Number of doors: ");
        var pNumWind = $("<p />").text("Number of windows: ");
        var pNumLamps = $("<p />").text("Number of lamps: ");
        var pDeskWork = $("<p />").text("Desk work: ");
        var pEnergyBalance = $("<p />").text("Energy balance: ");
        var pHeatLosses = $("<p />").text("Heat losses: ");
        var pPMVStatus = $("<p />").text("PMV status: ");
        var pHVACHeatProd = $("<p />").text("HVAC heat production: ");
        var pHVACStatus = $("<p />").text("HVAC status: ");
        var pLightPowerCon = $("<p />").text("Light Power Consumption: ");
        var pLuxLevelIn = $("<p />").text("Lux level indoor: ");
        var pLuxLevelOut = $("<p />").text("Lux level outdoor: ");
        var pLightAuthoSwitched = $("<p />").text("Light is authomatically switched on/off: ");
        var pDoorAuthoOpened = $("<p />").text("Doors are authomatically opened/closed: ");
        var pWindowsShadesMoved = $("<p />").text("Windows' shades are authomatically moved: ");
        var pHVACSystemAuthoControlled = $("<p />").text("HVAC system is authomatically controlled: ");
        var pRatio = $("<p />").text("Ratio of comfort to economy: ");
        var spanId = $("<span />").text(item.id);
        spanId.attr("name", "id");
        var spanName = $("<span />").text(item.name);
        spanName.attr("name", "name");
        var spanCountry = $("<span />").text(item.address_country);
        spanCountry.attr("name", "address_country");
        var spanCity = $("<span />").text(item.address_city);
        spanCity.attr("name", "address_city");
        var spanTempIn = $("<span />").text(item.temp_inside);
        spanTempIn.attr("name", "temp_inside");
        var spanTempOut = $("<span />").text(item.temp_outside);
        spanTempOut.attr("name", "temp_outside");
        var spanHumIn = $("<span />").text(item.humidity_inside);
        spanHumIn.attr("name", "humidity_inside");
        var spanHumOut = $("<span />").text(item.humidity_outside);
        spanHumOut.attr("name", "humidity_outside");
        var spanWind = $("<span />").text(item.wind_kmhr);
        spanWind.attr("name", "wind_kmhr");
        var spanRain = $("<span />").text(item.rain_perc);
        spanRain.attr("name", "rain_perc");
        var spanCO2LevelIn = $("<span />").text(item.CO2_level);
        spanCO2LevelIn.attr("name", "CO2_level");
        var spanCO2LevelOut = $("<span />").text(item.outdoor_CO2_level);
        spanCO2LevelOut.attr("name", "outdoor_CO2_level");
        var spanNumComp = $("<span />").text(item.number_of_computers);
        spanNumComp.attr("name", "number_of_computers");
        var spanNumDoors = $("<span />").text(item.number_of_doors);
        spanNumDoors.attr("name", "number_of_doors");
        var spanNumWindows = $("<span />").text(item.number_of_windows);
        spanNumWindows.attr("name", "number_of_windows");
        var spanNumLamps = $("<span />").text(item.number_of_lamps);
        spanNumLamps.attr("name", "number_of_lamps");
        var spanDeskWork = $("<span />").text(item.desk_work);
        spanDeskWork.attr("name", "desk_work");
        var spanEnergyBalance = $("<span />").text(item.energy_balance);
        spanEnergyBalance.attr("name", "energy_balance");
        var spanHeatLosses = $("<span />").text(item.heat_losses);
        spanHeatLosses.attr("name", "heat_losses");
        var spanPMVStatus = $("<span />").text(item.pmv_status);
        spanPMVStatus.attr("name", "pmv_status");
        var spanHVACHeatProd = $("<span />").text(item.HVAC_heat_prod);
        spanHVACHeatProd.attr("name", "HVAC_heat_prod");
        var spanHVACstatus = $("<span />").text(item.HVAC_status);
        spanHVACstatus.attr("name", "HVAC_status");
        var spanLightPowerCon = $("<span />").text(item.light_power_consumption);
        spanLightPowerCon.attr("name", "light_power_consumption");
        var spanLuxLevelIn = $("<span />").text(item.lux_level);
        spanLuxLevelIn.attr("name", "lux_level");
        var spanLuxLevelOut = $("<span />").text(item.outdoor_lux_level);
        spanLuxLevelOut.attr("name", "outdoor_lux_level");
        var spanLightAuthoSwitched = $("<span />").text(item.isLightAuthoSwitched);
        spanLightAuthoSwitched.attr("name", "isLightAuthoSwitched");
        var spanDoorAuthoOpened = $("<span />").text(item.isDoorAuthoOpened);
        spanDoorAuthoOpened.attr("name", "isDoorAuthoOpened");
        var spanWindowsShadesMoved = $("<span />").text(item.areWindowShadesAuthoMoved);
        spanWindowsShadesMoved.attr("name", "areWindowShadesAuthoMoved");
        var spanHVACSystemAuthoControlled = $("<span />").text(item.isHVACsystemAuthoControlled);
        spanHVACSystemAuthoControlled.attr("name", "isHVACsystemAuthoControlled");
        var spanRatio = $("<span />").text(item.ratio_comfort_economy);
        spanRatio.attr("name", "ratio");

        (((a.append(h3.append(spanName))).append(pId.append(spanId))).append(pCountry.append(spanCountry))).append(pCity.append(spanCity));
        (((a.append(pTempIn.append(spanTempIn))).append(pTempOut.append(spanTempOut))).append(pHumIn.append(spanHumIn))).append(pHumOut.append(spanHumOut));
        (((a.append(pWind.append(spanWind))).append(pRain.append(spanRain))).append(pCO2LevelIn.append(spanCO2LevelIn))).append(pCO2LevelOut.append(spanCO2LevelOut));
        (((a.append(pNumComp.append(spanNumComp))).append(pNumDoors.append(spanNumDoors))).append(pNumWind.append(spanNumWindows))).append(pNumLamps.append(spanNumLamps));
        (((a.append(pDeskWork.append(spanDeskWork))).append(pEnergyBalance.append(spanEnergyBalance))).append(pHeatLosses.append(spanHeatLosses))).append(pPMVStatus.append(spanPMVStatus));
        (a.append(pHVACHeatProd.append(spanHVACHeatProd))).append(pHVACStatus.append(spanHVACstatus));
        (a.append(pLightPowerCon.append(spanLightPowerCon))).append(pLuxLevelIn.append(spanLuxLevelIn));
        (a.append(pLuxLevelOut.append(spanLuxLevelOut))).append(pLightAuthoSwitched.append(spanLightAuthoSwitched));
        (a.append(pDoorAuthoOpened.append(spanDoorAuthoOpened))).append(pWindowsShadesMoved.append(spanWindowsShadesMoved));
        (a.append(pHVACSystemAuthoControlled.append(spanHVACSystemAuthoControlled))).append(pRatio.append(spanRatio));

        var li = $("<li/>");
        li.attr("data-filtertext", item.name);
        li.append(a);
        lstProducts.append(li);
    }

    lstProducts.listview("refresh");
    //Searches environments by its id, name, city and country
    lstProducts.on("tap", "li", function () {
        currentEnvironment.id = $(this).find("[name='id']").text();
        currentEnvironment.name = $(this).find("[name='name']").text();
        currentEnvironment.address_country = $(this).find("[name='address_country']").text();
        currentEnvironment.address_city = $(this).find("[name='address_city']").text();
        $("#popupUpdateDelete").popup("open");
    });
}

//Displays all existed environments' names
function displayNames(results) {
    var length = results.rows.length;
    var lstNames = $("#select-native-1");

    lstNames.empty();//Clean the old data before adding.
    lstNames.append($("<option />").text("Choose..."));

    //Allows to choose the environment the user wants to work with
    for (var i = 0; i < length; i++) {
        var item = results.rows.item(i);
        var op = $("<option />").text(item.name);
        op.val(item.id);
        lstNames.append(op);
    }

    lstNames.selectmenu("refresh", true);
}

//Displays names of users in the selected environment
function displayUserNames(results) {
    var length = results.rows.length;
    var selectUserName = $("<select />").attr("id", "select-native-3");
    var lstNames = $("#user-names-details");
    //Allows to choose the user's name
    var h3 = $("<h3 />").text("Please, choose your name from the list below:");

    selectUserName.attr("name", "select-native-3");
    lstNames.empty();//Clean the old data before adding.
    lstNames.append(h3);
    selectUserName.append($("<option />").text("Choose:"));

    for (var i = 0; i < length; i++) {
        var item = results.rows.item(i);
        var op = $("<option />").text(i + ". " + item.name);
        op.val(i);
        selectUserName.append(op);
    }

    lstNames.append(selectUserName);
}

//Displays users' names in the select list
function displayUsers(results) {
    var length = results.rows.length;
    var users = $("#users-content");

    users.empty();

    for (var i = 0; i < length; i++) {
        var item = results.rows.item(i);
        var a = $("<a />");
        var p = $("<p />").text("Name: ");
        var spanName = $("<span />").text(item.name);
        spanName.attr("name", "name");
        p.append(spanName);
        a.append(p);
        var li = $("<li/>");
        li.append(a);
        users.append(li);
    }

    users.listview("refresh");
}

//Get user id, ask whether the user is free at the moment or not
function getUser(results, value, i) {
    var length = results.rows.length;
    var users = $("#UserAsked");

    users.empty();

    if (i < length) {
        var item = results.rows.item(i);
        var h3 = $("<h3 />").text("The system is asking the user " + item.name + " for assistance");
        var p = $("<p />").text(item.name + ", are you available at the moment?");
        var aYes = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
        aYes.attr("id", "YesIamFree");
        aYes.attr("name", "YesIamFree");
        //If the user is free, the System displays required questions
        aYes.on("tap", function () {
            // users.empty();
            environmentHandler.setQuestionsAndRules(askQuestionsAndActions, value, i);
        });
        aYes.text("Yes, I am free");
        var aNo = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
        aNo.attr("id", "NoICant");
        aNo.attr("name", "NoICant");
        //Otherwise, the System asks a next user
        aNo.on("tap", function () {
            $("#lstQuestions").empty();
            getUser(results, value, i + 1);
        });
        aNo.text("No, I am sorry");
        (((users.append(h3)).append(p)).append(aYes)).append(aNo);
    } else {
        //If the last asked user was the last in the users' table, then the System asks
        //the user with the id = 1 again
        getUser(results, value, 0);
    }
}

//Asks whether the user is in the System or not
function displayMainPageContent(selectedOption) {
    var content = $("#mainPage-content");

    var h2 = $("<h4 />").text("Are you in the list above?");
    h2.attr("style", "text-align: center");

    var labelForTrue = $("<label />");
    var inputTrue = $("<input />");
    inputTrue.attr("type", "radio");
    inputTrue.attr("id", "boolAddUserTrue");
    inputTrue.attr("name", "boolAddUser");
    labelForTrue.attr("for", "boolAddUserTrue");
    labelForTrue.text("yes");

    var labelForFalse = $("<label />");
    var inputFalse = $("<input />");
    inputFalse.attr("type", "radio");
    inputFalse.attr("id", "boolAddUserFalse");
    inputFalse.attr("name", "boolAddUser");
    labelForFalse.attr("for", "boolAddUserFalse");
    labelForFalse.text("no");

    content.append(h2);
    content.append(labelForTrue);
    content.append(inputTrue);
    content.append(labelForFalse);
    content.append(inputFalse);
}

//Displays the form required to add a new user
function displayAddUserForm(selectedOption) {
    var details = $("#user-details");
    var lab = $("<label />");

    lab.attr("for", "userName");
    lab.text("Name:");

    var input = $("<input />");
    input.attr("type", "text");
    input.attr("id", "userName");
    input.attr("data-clear-btn", "true");

    var labBtn = $("<label />").attr("for", "btnAddUser");
    var a = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
    a.attr("id", "btnAddUser");

    a.on("tap", function () {
        addUser(selectedOption);
        environmentHandler.getNumberOfUsers(displayUsers, selectedOption);
        details.empty();
    });

    a.text("Submit");
    (((details.append(lab)).append(input)).append(labBtn)).append(a);
}

//Deletes the selected environment
function deleteEnvironment() {
    var r = confirm("Delete environment\nName: " + currentEnvironment.name);

    if (r === true) {
        environmentHandler.deleteEnvironment(currentEnvironment.id);
        environmentHandler.loadProducts(displayEnvironments);
    }

    $("#popupUpdateDelete").popup("close");
}

//Asks another user to answer questions/perform actions
function skipTurn(value, id) {
    environmentHandler.getUserAsked(getUser, value, id + 1);
}

//Creates questions required to answer
//If some data is not given (meaning that the System does not have a specific sensor
//Required to get this data without human participation), the System asks the user to fill it in
function askQuestionsAndActions(results, selectedUser, selectedOption) {
    var lstQuestions = $("#lstQuestions");
    var item = results.rows.item(0);

    //Clean the old data before adding.
    lstQuestions.empty();

    //The user does not need to answer all questions, he or she can always ask the System to
    //Ask another user, i.e., pass the turn
    var aSkip = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
    aSkip.attr("id", "btnSkip");
    aSkip.text("Ask another user");

    aSkip.on("tap", function () {
        var r = confirm("Are you sure you want to stop assisting the system?");

        if (r === true) {
            $("#lstQuestions").empty();
            skipTurn(item.id, selectedUser);
        }
    });

    if (item.temp_inside == null || item.temp_inside === '') {
        var h3TempIn = $("<h3 />").text("It seems that the system does not know what temperature inside is");
        var pTempIn = $("<p />").text("Could you please help us to get some necessary data?");
        var labTempIn = $("<label />").text("Temperature inside: ");
        labTempIn.attr("for", "userTempIn");
        var inputTempIn = $("<input />").attr("type", "number");
        inputTempIn.attr("id", "userTempIn");
        inputTempIn.attr("data-clear-btn", "true");
        var a = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
        a.attr("id", "btnUpdateTempIn");

        a.on("tap", function () {
            var newValue = $("#userTempIn").val();
            var r = confirm("Update environment " + item.id + " set temp_inside = " + newValue);

            if (r === true) {
                environmentHandler.updateValue('temp_inside', newValue, item.id);
                environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
            }

        });

        a.text("Submit");

        ((((lstQuestions.append(h3TempIn)).append(pTempIn)).append(labTempIn)).append(inputTempIn)).append(a);
        lstQuestions.append(aSkip);
    } else {
        if (item.temp_outside == null || item.temp_outside === '') {
            var h3TempOut = $("<h3 />").text("It seems that the system does not know what temperature outside is");
            var pTempOut = $("<p />").text("Could you please help us to get some necessary data?");
            var labTempOut = $("<label />").text("Temperature outside: ");
            labTempOut.attr("for", "userTempOut");
            var inputTempOut = $("<input />").attr("type", "number");
            inputTempOut.attr("id", "userTempOut");
            inputTempOut.attr("data-clear-btn", "true");
            var aTempOut = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
            aTempOut.attr("id", "btnUpdateTempOut");

            aTempOut.on("tap", function () {
                var newValue = $("#userTempOut").val();
                var r = confirm("Update environment " + item.id + " set temp_outside = " + newValue);

                if (r === true) {
                    environmentHandler.updateValue('temp_outside', newValue, item.id);
                    environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                }
            });

            aTempOut.text("Submit");

            ((((lstQuestions.append(h3TempOut)).append(pTempOut)).append(labTempOut)).append(inputTempOut)).append(aTempOut);
            lstQuestions.append(aSkip);
        } else {
            if (item.humidity_inside == null || item.humidity_inside === '') {
                var h3HumIn = $("<h3 />").text("It seems that the system does not know what humidity inside is");
                var pHumIn = $("<p />").text("Could you please help us to get some necessary data?");
                var labHumIn = $("<label />").text("Humidity inside: ");
                labHumIn.attr("for", "userHumIn");
                var inputHumIn = $("<input />").attr("type", "number");
                inputHumIn.attr("id", "userHumIn");
                inputHumIn.attr("data-clear-btn", "true");
                var aHumIn = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                aHumIn.attr("id", "btnUpdateHumIn");

                aHumIn.on("tap", function () {
                    var newValue = $("#userHumIn").val();
                    var r = confirm("Update environment " + item.id + " set humidity_inside = " + newValue);
                    if (r === true) {
                        environmentHandler.updateValue('hum_inside', newValue, item.id);
                        environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                    }
                });

                aHumIn.text("Submit");

                ((((lstQuestions.append(h3HumIn)).append(pHumIn)).append(labHumIn)).append(inputHumIn)).append(aHumIn);
                lstQuestions.append(aSkip);
            } else {
                if (item.humidity_outside == null || item.humidity_outside === '') {
                    var h3HumOut = $("<h3 />").text("It seems that the system does not know what humidity outside is");
                    var pHumOut = $("<p />").text("Could you please help us to get some necessary data?");
                    var labHumOut = $("<label />").text("Humidity outside: ");
                    labHumOut.attr("for", "userHumOut");
                    var inputHumOut = $("<input />").attr("type", "number");
                    inputHumOut.attr("id", "userHumOut");
                    inputHumOut.attr("data-clear-btn", "true");
                    var aHumOut = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                    aHumOut.attr("id", "btnUpdateHumOut");

                    aHumOut.on("tap", function () {
                        var newValue = $("#userHumOut").val();
                        var r = confirm("Update environment " + item.id + " set humidity_outside = " + newValue);

                        if (r === true) {
                            environmentHandler.updateValue('hum_outside', newValue, item.id);
                            environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                        }
                    });

                    aHumOut.text("Submit");

                    ((((lstQuestions.append(h3HumOut)).append(pHumOut)).append(labHumOut)).append(inputHumOut)).append(aHumOut);
                    lstQuestions.append(aSkip);
                } else {
                    if (item.wind_kmhr == null || item.wind_kmhr === '') {
                        var h3Wind = $("<h3 />").text("It seems that the system does not know what spped of the wind is at the moment");
                        var pWind = $("<p />").text("Could you please help us to get some necessary data?");
                        var labWind = $("<label />").text("Wind speed: ");
                        labWind.attr("for", "userWind");
                        var inputWind = $("<input />").attr("type", "number");
                        inputWind.attr("id", "userWind");
                        inputWind.attr("data-clear-btn", "true");
                        var aWind = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                        aWind.attr("id", "btnUpdateWind");

                        aWind.on("tap", function () {
                            var newValue = $("#userWind").val();
                            var r = confirm("Update environment " + item.id + " set wind_kmhr = " + newValue);

                            if (r === true) {
                                environmentHandler.updateValue('wind', newValue, item.id);
                                environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                            }
                        });

                        aWind.text("Submit");

                        ((((lstQuestions.append(h3Wind)).append(pWind)).append(labWind)).append(inputWind)).append(aWind);
                        lstQuestions.append(aSkip);
                    } else {
                        if (item.rain_perc == null || item.rain_perc === '') {
                            var h3Rain = $("<h3 />").text("It seems that the system does not know whether it is rainy at the moment");
                            var pRain = $("<p />").text("Could you please help us to get some necessary data?");
                            var pIsRainy = $("<p />").text("Is it rainy right now?");

                            var labelRainy = $("<label />");
                            var inputRainy = $("<input />");
                            inputRainy.attr("type", "radio");
                            inputRainy.attr("id", "boolRainyTrue");
                            inputRainy.attr("name", "boolRainy");
                            labelRainy.attr("for", "boolRainyTrue");
                            labelRainy.text("yes");

                            var labelNotRainy = $("<label />");
                            var inputNotRainy = $("<input />");
                            inputNotRainy.attr("type", "radio");
                            inputNotRainy.attr("id", "boolRainyFalse");
                            inputNotRainy.attr("name", "boolRainy");
                            labelNotRainy.attr("for", "boolRainyFalse");
                            labelNotRainy.text("no");
                            var labCloudy = $("<label />");
                            var inputCloudy = $("<input />");
                            inputCloudy.attr("type", "radio");
                            inputCloudy.attr("id", "boolCloudyTrue");
                            inputCloudy.attr("name", "boolCloudy");
                            labCloudy.attr("for", "boolCloudyTrue");
                            labCloudy.text("Yes, it is cloudy.");

                            var labNotCloudy = $("<label />");
                            var inputNotCloudy = $("<input />");
                            inputNotCloudy.attr("type", "radio");
                            inputNotCloudy.attr("id", "boolCloudyFalse");
                            inputNotCloudy.attr("name", "boolCloudy");
                            labNotCloudy.attr("for", "boolCloudyFalse");
                            labNotCloudy.text("No. The sky is clear");

                            var aRain = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                            aRain.attr("id", "btnUpdateRain");
                            aRain.text("Submit");
                            ((((((lstQuestions.append(h3Rain)).append(pRain)).append(pIsRainy)).append(labelRainy)).append(inputRainy)).append(labelNotRainy)).append(inputNotRainy);
                            var newValue;

                            $('input:radio[id="boolRainyTrue"]').on("change", function () {
                                if ($(this).is(':checked')) {
                                    lstQuestions.empty();
                                    newValue = 100;

                                    aRain.on("tap", function () {
                                        var r = confirm("Update environment " + item.id + " set rain_perc = 100");

                                        if (r === true) {
                                            environmentHandler.updateValue('rain', 100, item.id);
                                            environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                        }
                                    });

                                    lstQuestions.append(aRain);
                                }
                            });

                            $('input:radio[id="boolRainyFalse"]').on("change", function () {
                                if ($(this).is(':checked')) {
                                    lstQuestions.empty();
                                    var pChanceOfRain = $("<p />").text("Then what chance that there will be rain?");
                                    var labRain = $("<label />").text("Chance of rain: ");
                                    labRain.attr("for", "userRain");
                                    var inputRain = $("<input />").attr("type", "number");
                                    inputRain.attr("id", "userRain");
                                    inputRain.attr("data-clear-btn", "true");
                                    ((lstQuestions.append(pChanceOfRain)).append(labRain)).append(inputRain);
                                    var aConfirm = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                    aConfirm.attr("id", "btnConfirmValue");
                                    aConfirm.text("Confirm");
                                    lstQuestions.append(aConfirm);
                                    aConfirm.on("tap", function () {
                                        var rainValue = $("#userRain").val();

                                        if (rainValue > 20 && rainValue < 80) {
                                            lstQuestions.empty();
                                            var pWeatherState = $("<h3 />").text("It is still confusing. Could you tell me whether it is cloudy outside or not?");
                                            lstQuestions.append(pWeatherState);
                                            ((((lstQuestions.append(labCloudy)).append(inputCloudy)).append(labNotCloudy)).append(inputNotCloudy)).append(aRain);

                                            $('input:radio[id="boolCloudyTrue"]').on("change", function () {
                                                if ($(this).is(':checked')) {
                                                    aRain.on("tap", function () {
                                                        var r = confirm("Update environment " + item.id + " set rain_perc = 80");

                                                        if (r === true) {
                                                            environmentHandler.updateValue('rain', 80, item.id);
                                                            environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                                        }
                                                    });
                                                }
                                            });

                                            $('input:radio[id="boolCloudyFalse"]').on("change", function () {
                                                if ($(this).is(':checked')) {
                                                    aRain.on("tap", function () {
                                                        var r = confirm("Update environment " + item.id + " set rain_perc = 20");

                                                        if (r === true) {
                                                            environmentHandler.updateValue('rain', 20, item.id);
                                                            environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            newValue = $("#userRain").val();

                                            aRain.on("tap", function () {
                                                var r = confirm("Update environment " + item.id + " set rain_perc = " + newValue);

                                                if (r === true) {
                                                    environmentHandler.updateValue('rain', newValue, item.id);
                                                    environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                                }
                                            });

                                            lstQuestions.append(aRain);
                                            lstQuestions.append(aSkip);
                                        }
                                    });
                                }
                            });
                        } else {
                            if (item.CO2_level == null || item.CO2_level === '') {
                                var h3CO2In = $("<h3 />").text("It seems that the system does not know what indoor CO2 level is at the moment");
                                var pCO2In = $("<p />").text("Could you please help us to get some necessary data?");
                                var labCO2In = $("<label />").text("Indoor CO2 level: ");
                                labCO2In.attr("for", "userCO2In");
                                var inputCO2In = $("<input />").attr("type", "number");
                                inputCO2In.attr("id", "userCO2In");
                                inputCO2In.attr("data-clear-btn", "true");
                                var aCO2In = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                aCO2In.attr("id", "btnUpdateCO2In");
                                aCO2In.on("tap", function () {
                                    var newValue = $("#userCO2In").val();
                                    var r = confirm("Update environment " + item.id + " set CO2_level = " + newValue);

                                    if (r === true) {
                                        environmentHandler.updateValue('CO2_inside', newValue, item.id);
                                        environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                    }
                                });

                                aCO2In.text("Submit");

                                ((((lstQuestions.append(h3CO2In)).append(pCO2In)).append(labCO2In)).append(inputCO2In)).append(aCO2In);
                                lstQuestions.append(aSkip);
                            } else {
                                if (item.outdoor_CO2_level == null || item.outdoor_CO2_level === '') {
                                    var h3CO2Out = $("<h3 />").text("It seems that the system does not know what indoor CO2 level is at the moment");
                                    var pCO2Out = $("<p />").text("Could you please help us to get some necessary data?");
                                    var labCO2Out = $("<label />").text("Outdoor CO2 level: ");
                                    labCO2Out.attr("for", "userCO2Out");
                                    var inputCO2Out = $("<input />").attr("type", "number");
                                    inputCO2Out.attr("id", "userCO2Out");
                                    inputCO2Out.attr("data-clear-btn", "true");
                                    var aCO2Out = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                    aCO2Out.attr("id", "btnUpdateCO2Out");

                                    aCO2Out.on("tap", function () {
                                        var newValue = $("#userCO2Out").val();
                                        var r = confirm("Update environment " + item.id + " set CO2_level_outdoor = " + newValue);

                                        if (r === true) {
                                            environmentHandler.updateValue('CO2_outside', newValue, item.id);
                                            environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                        }
                                    });

                                    aCO2Out.text("Submit");

                                    ((((lstQuestions.append(h3CO2Out)).append(pCO2Out)).append(labCO2Out)).append(inputCO2Out)).append(aCO2Out);
                                    lstQuestions.append(aSkip);
                                } else {
                                    if (item.number_of_lamps == null || item.number_of_lamps === '') {
                                        var h3NumLamps = $("<h3 />").text("Could you please tell me how many lamps are in the room you are now?");
                                        var labNumLamps = $("<label />").text("Number of lamps: ");
                                        labNumLamps.attr("for", "userNumLamps");
                                        var inputNumLamps = $("<input />").attr("type", "number");
                                        inputNumLamps.attr("id", "userNumLamps");
                                        inputNumLamps.attr("data-clear-btn", "true");
                                        var aLampsNum = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                        aLampsNum.attr("id", "btnLampsNum");

                                        aLampsNum.on("tap", function () {
                                            var newValue = $("#userNumLamps").val();
                                            var r = confirm("Update environment " + item.id + " set number_of_lamps = " + newValue);
                                            if (r === true) {
                                                environmentHandler.updateValue('lamp', newValue, item.id);
                                                environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                            }
                                        });
                                        aLampsNum.text("Submit");

                                        (((lstQuestions.append(h3NumLamps)).append(labNumLamps)).append(inputNumLamps)).append(aLampsNum);
                                        lstQuestions.append(aSkip);
                                    } else {
                                        if (item.number_of_windows == null || item.number_of_windows === '') {
                                            var h3NumWindows = $("<h3 />").text("Could you please tell me how many windows are in the room you are now?");
                                            var labNumWindows = $("<label />").text("Number of windows: ");
                                            labNumWindows.attr("for", "userNumWindows");
                                            var inputNumWindows = $("<input />").attr("type", "number");
                                            inputNumWindows.attr("id", "userNumWindows");
                                            inputNumWindows.attr("data-clear-btn", "true");
                                            var aWindowsNum = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                            aWindowsNum.attr("id", "btnWindowsNum");

                                            aWindowsNum.on("tap", function () {
                                                var newValue = $("#userNumWindows").val();
                                                var r = confirm("Update environment " + item.id + " set number_of_windows = " + newValue);

                                                if (r === true) {
                                                    environmentHandler.updateValue('window', newValue, item.id);
                                                    environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                                }
                                            });

                                            aWindowsNum.text("Submit");

                                            (((lstQuestions.append(h3NumWindows)).append(labNumWindows)).append(inputNumWindows)).append(aWindowsNum);
                                            lstQuestions.append(aSkip);
                                        } else {
                                            if (item.number_of_doors == null || item.number_of_doors === '') {
                                                var h3NumDoors = $("<h3 />").text("Could you please tell me how many doors are in the room you are now?");
                                                var labNumDoors = $("<label />").text("Number of doors: ");
                                                labNumDoors.attr("for", "userNumDoors");
                                                var inputNumDoors = $("<input />").attr("type", "number");
                                                inputNumDoors.attr("id", "userNumDoors");
                                                inputNumDoors.attr("data-clear-btn", "true");
                                                var aDoorsNum = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                                aDoorsNum.attr("id", "btnDoorsNum");

                                                aDoorsNum.on("tap", function () {
                                                    var newValue = $("#userNumDoors").val();
                                                    var r = confirm("Update environment " + item.id + " set number_of_doors = " + newValue);

                                                    if (r === true) {
                                                        environmentHandler.updateValue('door', newValue, item.id);
                                                        environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption
                                                        );
                                                    }
                                                });

                                                aDoorsNum.text("Submit");

                                                (((lstQuestions.append(h3NumDoors)).append(labNumDoors)).append(inputNumDoors)).append(aDoorsNum);
                                                lstQuestions.append(aSkip);
                                            } else {
                                                if (item.number_of_computers == null || item.number_of_computers === '') {
                                                    var h3NumComp = $("<h3 />").text("Could you please tell me how many computers are in the room you are now?");
                                                    var labNumComp = $("<label />").text("Number of computers: ");
                                                    labNumComp.attr("for", "userNumComp");
                                                    var inputNumComp = $("<input />").attr("type", "number");
                                                    inputNumComp.attr("id", "userNumComp");
                                                    inputNumComp.attr("data-clear-btn", "true");
                                                    var aCompNum = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                                    aCompNum.attr("id", "btnCompNum");

                                                    aCompNum.on("tap", function () {
                                                        var newValue = $("#userNumComp").val();
                                                        var r = confirm("Update environment " + item.id + " set number_of_computers = " + newValue);
                                                        if (r === true) {
                                                            environmentHandler.updateValue('comp', newValue, item.id);
                                                            environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                                        }
                                                    });

                                                    aCompNum.text("Submit");
                                                    (((lstQuestions.append(h3NumComp)).append(labNumComp)).append(inputNumComp)).append(aCompNum);
                                                    lstQuestions.append(aSkip);
                                                } else {
                                                    if (item.lux_level == null || item.lux_level === '') {
                                                        var h3LuxIn = $("<h3 />").text("It seems that the system does not know what indoor lux level is at the moment");
                                                        var pLuxIn = $("<p />").text("Could you please help us to get some necessary data?");
                                                        var lavLuxIn = $("<label />").text("Indoor lux level: ");
                                                        lavLuxIn.attr("for", "userLuxIn");
                                                        var inputLuxIn = $("<input />").attr("type", "number");
                                                        inputLuxIn.attr("id", "userLuxIn");
                                                        inputLuxIn.attr("data-clear-btn", "true");
                                                        var aLuxIn = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                                        aLuxIn.attr("id", "btnLuxIn");

                                                        aLuxIn.on("tap", function () {
                                                            var newValue = $("#userLuxIn").val();
                                                            var r = confirm("Update environment " + item.id + " set lux_level = " + newValue);
                                                            if (r === true) {
                                                                environmentHandler.updateValue('lux_inside', newValue, item.id);
                                                                environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                                            }
                                                        });

                                                        aLuxIn.text("Submit");

                                                        ((((lstQuestions.append(h3LuxIn)).append(pLuxIn)).append(lavLuxIn)).append(inputLuxIn)).append(aLuxIn);
                                                        lstQuestions.append(aSkip);
                                                    } else {
                                                        if (item.outdoor_lux_level == null || item.outdoor_lux_level === '') {
                                                            var h3LuxOut = $("<h3 />").text("It seems that the system does not know what outdoor lux level is at the moment");
                                                            var pLuxOut = $("<p />").text("Could you please help us to get some necessary data?");
                                                            var lavLuxOut = $("<label />").text("Outdoor lux level: ");
                                                            lavLuxOut.attr("for", "userLuxOut");
                                                            var inputLuxOut = $("<input />").attr("type", "number");
                                                            inputLuxOut.attr("id", "userLuxOut");
                                                            inputLuxOut.attr("data-clear-btn", "true");
                                                            var aLuxOut = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                                            aLuxOut.attr("id", "btnLuxOut");

                                                            aLuxOut.on("tap", function () {
                                                                var newValue = $("#userLuxOut").val();
                                                                var r = confirm("Update environment " + item.id + " set outdoor_lux_level = " + newValue);

                                                                if (r === true) {
                                                                    environmentHandler.updateValue('lux_outside', newValue, item.id);
                                                                    environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                                                }
                                                            });

                                                            aLuxOut.text("Submit");

                                                            ((((lstQuestions.append(h3LuxOut)).append(pLuxOut)).append(lavLuxOut)).append(inputLuxOut)).append(aLuxOut);
                                                            lstQuestions.append(aSkip);
                                                        } else {
                                                            if (item.pmv_status == null || item.pmv_status === '') {
                                                                var h3PMVStatus = $("<h3 />").text("It seems that the system does not know what PMV status is");
                                                                var pPMVStatus = $("<p />").text("Could you please help us to get some necessary data?");
                                                                var pPMVStatusAsk = $("<p />").text("How does it feel in the room?");
                                                                var selectPMVStatus = $("<select />").attr("name", "select-native-2");
                                                                selectPMVStatus.attr("id", "select-native-2");
                                                                var op1 = $("<option />").text("Choose");
                                                                var op2 = $("<option />").text("Too cold");
                                                                op2.val(-3);
                                                                var op3 = $("<option />").text("Cool");
                                                                op3.val(-2);
                                                                var op4 = $("<option />").text("Slightly cool");
                                                                op4.val(-1);
                                                                var op5 = $("<option />").text("Neutral");
                                                                op5.val(0);
                                                                var op6 = $("<option />").text("Slightly warm");
                                                                op6.val(1);
                                                                var op7 = $("<option />").text("Warm");
                                                                op7.val(2);
                                                                var op8 = $("<option />").text("Too hot");
                                                                op8.val(3);
                                                                var aPMVstatus = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
                                                                aPMVstatus.attr("id", "btnPMVstatus");

                                                                $("#select-native-2").on("change", aPMVstatus.on("tap", function () {
                                                                        var newValue = $("#select-native-2").children("option:selected").val();
                                                                        var r = confirm("Update environment " + item.id + " set pmv_status = " + newValue);
                                                                        if (r === true) {
                                                                            environmentHandler.updateValue('pmv_status', newValue, item.id);
                                                                            environmentHandler.setQuestionsAndRules(askQuestionsAndActions, item.id, selectedUser, selectedOption);
                                                                        }
                                                                    })
                                                                );

                                                                aPMVstatus.text("Submit");

                                                                (((((((selectPMVStatus.append(op1)).append(op2)).append(op3)).append(op4)).append(op5)).append(op6)).append(op7)).append(op8);
                                                                ((((lstQuestions.append(h3PMVStatus)).append(pPMVStatus)).append(pPMVStatusAsk)).append(selectPMVStatus)).append(aPMVstatus);
                                                                lstQuestions.append(aSkip);
                                                            } else {
                                                                $("#UserAsked").empty();
                                                                environmentHandler.loadEnvironment(setRules, selectedOption);
                                                                // lstQuestions.append($("<h3 />").text("Thank you! You answered all questions."));
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// There are 5 actuators, which require energy: Heater, Ventilation, Air conditioner, Light(number of lamps)
// and computers (number of computers). If we divide 100 by 5, we get that each actuator has cost = 20,
// in case, we consider light and computers we have to 20 divide by number of lamps/computers = cost
// required for using 1 computer. Because we have 4 different situations when ratio (comfort/saving) energy
// between comfort and saving energy equal to 0-0.33, 0.33-1, 1-3 and >3, we can set rules in a way that
// for ratio 0-0.33, we have to use energy with cost <= 20, for ratio 0.33-1 cost should be between 20 and 50
// for ratio 1-3 cost is between 50 and 80, and for ratio >3 we have cost >= 80. Therefore, when we calculate
// cost, we have to consider whether it is bigger of a certain number or not. 61, 39

// ideal CO2 level indoor is 400-1000
// ideal indoor temperature is 20-25 for comfort and 15-20 for energy saving
// ideal indoor humidity is 30-50%
// ideal indoor lux level is 500-1000 for study room or office

//Retrieves the best maximum possible cost depending on the ratio_comfort_economy of the environment
function setMinMaxCosts(results, currentCost, selectedOption) {
    var ratioBestCost = results.rows.item(0).bestMaxCost;
    var description = results.rows.item(0).description;
    environmentHandler.retrieveActions(getActions, currentCost, selectedOption, ratioBestCost);
}

//Gets actions' list
function getActions(results, currentCost, ratioBestCost, selectedOption) {
    var lstActions = $("#lstActions");
    lstActions.empty();
    var item = results.rows.item(0);
    var costValue = currentCost;
    var attributes = [item.turnOnFan, item.turnOnAirCon, item.turnOnHeater, item.turnOnLamp, item.turnOnComp];
    var attrNames = ['Fresh air (using energy)', 'Temperature in the room (colder)', 'Temperature in the room (warmer)', 'Light (lamps)', 'computer'];
    var actuator = ['fan', 'air conditioner', 'heater', 'light', 'computer'];
    var length = attributes.length;
    if (currentCost > ratioBestCost) {
        var h3 = $("<h3 />").text("What is LESS important for you?");
        lstActions.append(h3);
        var selectActions = $("<select />").attr("name", "select-native-4");
        selectActions.attr("id", "select-native-4");
        var op1 = $("<option />").text("Choose");
        var op = [];
        selectActions.append(op1);
        for (var i = 0; i < length; i++) {
            if (attributes[i] > 0) {
                op[i] = $("<option />").text(attrNames[i]);
                op[i].val(i);
                selectActions.append(op[i]);
            }
        }
        var aSelectAction = $("<a />").addClass("ui-btn ui-icon-plus ui-btn-icon-left");
        aSelectAction.attr("id", "btnSelectAction");
        aSelectAction.text("Submit");
        $("#select-native-4").on("change", aSelectAction.on("tap", function () {
                var newValue = $("#select-native-4").children("option:selected").val();
                var r;
                var actuatorCost = calculateActuatorCost(actuator[newValue]);
                if (actuator[newValue] === 'light') {
                    actuatorCost *= item.num_LampsON;
                }
                r = confirm("You chose " + attrNames[newValue] + ". Its cost is " + actuatorCost);
                if (r === true) {
                    environmentHandler.updateActions(actuator[newValue], 0, selectedOption);
                    costValue -= actuatorCost;
                    environmentHandler.updateActions('cost', costValue, selectedOption);
                    environmentHandler.retrieveActions(getActions, costValue, selectedOption, ratioBestCost);
                }
            })
        );
        (lstActions.append(selectActions)).append(aSelectAction);
    } else {
        var count = 0;
        var allAttributes = [item.openWindow, item.moveShades, item.turnOnFan, item.turnOnAirCon, item.turnOnHeater, item.turnOnLamp, 0];
        var actionsIfOne = ['', 'Windows blinds are opened', 'Fan is turned on', 'Air Conditioner is turned on', 'Heater is turned on', item.num_LampsON + ' lamps are turned on', ''];
        var actionsIfTwo = ['Open window', 'Open windows blinds', 'Turn on fan', 'Turn on Air Conditioner', 'Turn on heater', 'Turn on ' + item.num_LampsON + ' lamps', 'Turn on ' + item.num_CompsON + ' computers'];
        var listIfOne = $("#listIfOne");
        var listIfTwo = $("#listIfTwo");
        var h4IfOne = $("<h4 />").text("Actions performed automatically:");
        for (var j = 0; j < allAttributes.length; j++) {
            if (allAttributes[j] === 1) {
                listIfOne.append($("<li />").text(actionsIfOne[j]));
                count++;
            }
        }
        if (count > 0) {
            lstActions.append(h4IfOne);
        }
        lstActions.append(listIfOne);
        listIfOne.listview("refresh");
        count = 0;
        var h4IfTwo = $("<h4 />").text("Actions you need to perform:");
        for (var k = 0; k < allAttributes.length; k++) {
            if (allAttributes[k] === 2) {
                listIfTwo.append($("<li />").text(actionsIfTwo[k]));
                count++;
            }
        }
        if (count > 0) {
            lstActions.append(h4IfTwo);
        }
        lstActions.append(listIfTwo);
        listIfTwo.listview("refresh");
    }
}

//Goes through all data and applies rules to it
function setRules(results, selectedOption) {
    var currentCost = 0;
    var windowCanBeOpen = false;
    var item = results.rows.item(0);
    //start with a temperature.
    currentCost += setTemperature(item.ratio_comfort_economy, item.pmv_status, item.temp_inside, item.temp_outside, item.rain_perc, item.wind_kmhr, item.isHVACsystemAuthoControlled, currentCost, selectedOption);
    if (currentCost < 5) {
        windowCanBeOpen = true;
    }
    currentCost += setCO2Level(item.ratio_comfort_economy, item.CO2_level, windowCanBeOpen, item.isHVACsystemAuthoControlled, selectedOption);
    currentCost += setLuxLevel(item.ratio_comfort_economy, item.number_of_lamps, item.lux_level, item.areWindowShadesAuthoMoved, item.isLightAuthoSwitched, selectedOption);
    environmentHandler.setCostsForRatio(setMinMaxCosts, item.ratio_comfort_economy, currentCost, selectedOption);
}

//Rules to set temperature
function setTemperature(ratio, pmv, temp_inside, temp_outside, rain, wind, hvacOn, cost, selectedOption) {
    var currentCost = 0;
    switch (true) {
        case (ratio < 1):
            if (temp_inside < 20) {
                if (temp_outside >= 20) {
                    currentCost += rainAndWind(rain, wind, 'heater', calculateActuatorCost('heater'), false, hvacOn, true, selectedOption);
                } else {
                    currentCost += getPMVStatus(pmv, rain, wind, hvacOn, false, selectedOption);
                }
            } else {
                currentCost += getPMVStatus(pmv, rain, wind, hvacOn, true, selectedOption);
            }
            break;
        case (ratio >= 1):
            currentCost += getPMVStatus(pmv, rain, wind, hvacOn, false, selectedOption);
            break;
        default:
            break;
    }
    return currentCost;
}

//Rules to set CO2 level
function setCO2Level(ratio, CO2_level, windowOpen, hvacOn, selectedOption) {
    var currentCost = 0;
    switch (true) {
        case (CO2_level >= 400 && CO2_level <= 1000):
            break;
        case(ratio < 3):
            switch (windowOpen) {
                case true:
                    environmentHandler.updateActions('window', 2, selectedOption);
                    break;
                default:
                    currentCost += hvacONOFF('fan', hvacOn, false, calculateActuatorCost('fan'), selectedOption);
            }
            break;
        case(ratio >= 3):
            currentCost += hvacONOFF('fan', hvacOn, false, calculateActuatorCost('fan'), selectedOption);
            break;
    }
    return currentCost;
}

//500-1000 assuming led lamp is 8-12 = 800 lux = 800 per m^2 = 80 per 10 m^2.
function setLuxLevel(ratio, lampNum, lux_in, shadesMove, lightSwitch, selectedOption) {
    var currentCost = 0;
    var time = new Date();
    var startTime = new Date();
    startTime.setHours(9, 0, 0); // 9.00 pm
    var endTime = new Date();
    endTime.setHours(17, 0, 0);
    var count = 0;
    var lux_inside = lux_in;
    var lux_per_lamp = 800 / 10;
    var lamp_num = lampNum;
    switch (true) {
        case(lux_in >= 500 && lux_in <= 1000):
            break;
        case(lux_in < 500):
            switch (true) {
                case(time >= startTime && time <= endTime):
                    currentCost += windowBlindsCloseOpen('open', 'closed', shadesMove, selectedOption);
                    break;
                case(time < startTime || time > endTime):
                    while (lamp_num > 0 && lux_inside < 500) {
                        currentCost += calculateActuatorCost('light');
                        lux_inside += lux_per_lamp;
                        lamp_num--;
                        count++;
                    }
                    environmentHandler.updateActions('num_lamps', count, selectedOption);
                    environmentHandler.updateValue('lux_inside', lux_inside, selectedOption);
                    currentCost += lampsOnOff(count, lightSwitch, 'on', 'off', lux_inside, selectedOption);
                    break;
                default:
                    break;
            }
            break;
        case(lux_in > 1000):
            while (lux_inside > 1000 || lamp_num > 0) {
                lux_inside -= lux_per_lamp;
                lamp_num--;
            }
            var lampsToTurnOff = lampNum - lamp_num;
            environmentHandler.updateActions('num_lamps', lampsToTurnOff, selectedOption);
            environmentHandler.updateValue('lux_inside', lux_inside, selectedOption);
            var costLamps = lampsToTurnOff * calculateActuatorCost('light');
            currentCost -= costLamps;
            currentCost += lampsOnOff(lampsToTurnOff, lightSwitch, 'off', 'on', lux_inside, selectedOption);
            if (lux_inside > 1000) {
                currentCost += windowBlindsCloseOpen('clos', 'open', shadesMove, selectedOption);
            }
            break;
        default:
            break;
    }
    return currentCost;
}

//Checks whether it is possible to move the window's shades
function windowBlindsCloseOpen(todo, state, shadesMove, selectedOption) {
    var currentCost = 0;
    switch (shadesMove) {
        case 'true':
            currentCost += 2;
            if (todo === 'open') {
                environmentHandler.updateActions('shades', 1, selectedOption);
            }
            break;
        default:
            if (todo === 'open') {
                environmentHandler.updateActions('shades', 2, selectedOption);
            }
            break;
    }
    return currentCost;
}

//Checks whether lamps should be turned on by users or it can be done automatically
function lampsOnOff(number, lightSwitch, on_off, state, lux_inside, selectedOption) {
    var currentCost = 0;
    switch (lightSwitch) {
        case 'true':
            currentCost += 2;
            if (on_off === 'on') {
                environmentHandler.updateActions('light', 1, selectedOption);
            }
            break;
        default:
            if (on_off === 'on') {
                environmentHandler.updateActions('light', 2, selectedOption);
            }
            break;
    }
    if (on_off === 'on') {
        environmentHandler.updateSetActuators('light', selectedOption);
    }
    return currentCost;
}

//Considers PMV status
function getPMVStatus(pmv, rain, wind, hvacON, openWindow, selectedOption) {
    var currentCost = 0;
    var actuator = '';
    var actuatorCost = 0;
    var isOkay = false;
    switch (true) {
        case (pmv < -1):
            actuator = 'heater';
            actuatorCost = calculateActuatorCost(actuator) + 2;
            currentCost += rainAndWind(rain, wind, actuator, actuatorCost, isOkay, hvacON, openWindow, selectedOption);
            break;
        case (pmv >= -1 && pmv <= 2):
            isOkay = true;
            break;
        case (pmv > 2) :
            actuator = 'air conditioner';
            actuatorCost = calculateActuatorCost(actuator) + 2;
            currentCost += rainAndWind(rain, wind, actuator, actuatorCost, isOkay, hvacON, openWindow, selectedOption);
            break;
        default:
            break;
    }
    return currentCost;
}

//Checks whether it is possible to open the window
function rainAndWind(rain, wind, actuator, actuatorCost, isOkay, hvacOn, openWindow, selectedOption) {
    var currentCost = 0;
    switch (openWindow) {
        case true:
            switch (true) {
                case (rain >= 80):
                    currentCost += hvacONOFF(actuator, hvacOn, isOkay, actuatorCost, selectedOption);
                    break;
                case (rain <= 20):
                    switch (true) {
                        case (wind > 30):
                            currentCost += hvacONOFF(actuator, hvacOn, isOkay, actuatorCost, selectedOption);
                            break;
                        case (wind <= 30):
                            environmentHandler.updateActions('window', 2, selectedOption);
                            break;
                        default:
                            break;
                    }
            }
            break;
        case false:
            currentCost += hvacONOFF(actuator, hvacOn, isOkay, actuatorCost, selectedOption);
            break;
        default:
            break;
    }
    return currentCost;
}

//isCold true means too cold, isCold false mean too hot
//isOkay true means no need to turn on heater or conditioner
//Add actuator name and its actuatorCost
function hvacONOFF(actuator, hvacOn, isOkay, actuatorCost, selectedOption) {
    var currentCost = 0;
    var heaterTurnedOn = false;
    var airConditionerTurnedOn = false;
    var fanTurnedOn = false;
    switch (isOkay) {
        case false:
            switch (hvacOn) {
                case 'true':
                    currentCost += actuatorCost;
                    environmentHandler.updateActions(actuator, 1, selectedOption);
                    break;
                case 'false':
                    currentCost += actuatorCost;
                    environmentHandler.updateActions(actuator, 2, selectedOption);
                    break;
                default:
                    break;
            }
            switch (actuator) {
                case 'heater':
                    heaterTurnedOn = true;
                    environmentHandler.updateSetActuators(actuator, selectedOption);
                    break;
                case 'air conditioner':
                    airConditionerTurnedOn = true;
                    environmentHandler.updateSetActuators(actuator, selectedOption);
                    break;
                case 'fan':
                    fanTurnedOn = true;
                    environmentHandler.updateSetActuators(actuator, selectedOption);
                    break;
                default:
                    break;
            }
            break;
        case true:
            break;
        default:
            break;
    }
    return currentCost;
}

// 'Fan', 34),('Air conditioner', 27),('Heater',24),('Light', 12),('Computer',3)
function calculateActuatorCost(actuator) {
    var actuatorCost = 0;
    switch (actuator) {
        case 'heater':
            actuatorCost = 24;
            break;
        case 'air conditioner':
            actuatorCost = 27;
            break;
        case 'fan':
            actuatorCost = 34;
            break;
        case 'light':
            actuatorCost = 5;
            break;
        case 'computer':
            actuatorCost = 3;
            break;
        default:
            break;
    }
    return actuatorCost;
}



