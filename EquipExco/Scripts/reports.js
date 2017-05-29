'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");


var hostweburl;
var appweburl;
var appContextSite;
var list;
var listItems;
var listItems2;
var context;
var user;
var web;
var user;
var lists;
var listItemCollection;  // This variable is used later when you add list items.
var activitycount,reportcount,repcount;

var grid, dialog, spdata; // grid system

var reportid;



function initializePage() {


    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {



        getUrl();
        getUserName();



        function fillActivities() {
            $('.activityNo').show();
        }




        $(document).ready(function () {




            // pupulate partners dropdown

            var dd = $("select[name='partner']");


            $(dd).empty();
            $(dd).append('<option value="0" selected="selected">--- ALL ---</option>');

            var options = "";

            var call = $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl.replace("EquipExco", "") + "/_api/Web/Lists/GetByTitle('Partners')/items?$select=Id,Title",
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }

            });
            call.done(function (data, textStatus, jqXHR) {
                var index = 0;
                for (index in data.d.results) {
                    options += "<option value='" + data.d.results[index].Id + "'>" +
                        data.d.results[index].Title + "</option>";
                }
                $(dd).append(options);

            });
            call.fail(function (jqXHR, textStatus, errorThrown) {
                alert("Error retrieving information from list Partners: " + jqXHR.responseText);
                $(dd).append(options);
            });






            HillbillyCascade({
                parentFormField: "partner", //Display name on form of field from parent list
                childList: "Partners_countries", //List name of child list
                childLookupField: "Title", //Internal field name in Child List used in lookup
                childFormField: "country", //Display name on form of the child field
                parentFieldInChildList: "Partners" //Internal field name in Child List of the parent field
            });

        });

        function HillbillyCascade(params) {

            var parent = $("select[name='" + params.parentFormField + "']");

            $(parent).change(function () {
                DoHillbillyCascade(this.value, params);
            });

            var currentParent = $(parent).val();
            if (currentParent != 0) {
                DoHillbillyCascade(currentParent, params);
            }

        }




        function DoHillbillyCascade(parentID, params) {

            var child = $("select[name='" + params.childFormField + "'], select[Title='" +
                params.childFormField + " Required Field']," +
                "select[Title='" + params.childFormField + " possible values']");

            $(child).empty();
            $(child).append('<option value="0" selected="selected">--- ALL ---</option>');

            var options = "";

            var call = $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl.replace("EquipExco", "") + "/_api/Web/Lists/GetByTitle('" + params.childList +
                "')/items?$select=Id," + params.childLookupField + "," + params.parentFieldInChildList +
                "/Id&$expand=" + params.parentFieldInChildList + "/Id&$filter=" + params.parentFieldInChildList +
                "/Id eq " + parentID,
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }

            });
            call.done(function (data, textStatus, jqXHR) {
                var index = 0;
                for (index in data.d.results) {
                    options += "<option value='" + data.d.results[index].Id + "'>" +
                        data.d.results[index][params.childLookupField] + "</option>";
                }
                $(child).append(options);

            });
            call.fail(function (jqXHR, textStatus, errorThrown) {
                alert("Error retrieving information from list: " + params.childList + jqXHR.responseText);
                $(child).append(options);
            });




        }
    });

    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {

        context = new SP.ClientContext(appweburl);
        user = context.get_web().get_currentUser();
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    // This function is executed if the above call is successful
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        //  $('#message').text('Hello ' + user.get_title());
    }

    // This function is executed if the above call fails
    function onGetUserNameFail(sender, args) {
        $.notify('Failed to get user name. Error:' + args.get_message(), "error", { position: "top center" });

    }


    function getUrl() {
        hostweburl = getQueryStringParameter("SPHostUrl");
        appweburl = getQueryStringParameter("SPAppWebUrl");
        hostweburl = decodeURIComponent(hostweburl);
        appweburl = decodeURIComponent(appweburl);
        if (hostweburl == "undefined") {
            appweburl = window.location.protocol + "//" + window.location.host
                + _spPageContextInfo.webServerRelativeUrl;
            hostweburl = _spPageContextInfo.webAbsoluteUrl.replace("EquipExco", "");

        }


        var scriptbase = hostweburl + "/_layouts/15/";
        $.getScript(scriptbase + "SP.RequestExecutor.js", console.log('requestexecutor'));
    }





    function execOperation(id) {


        var appweburl = window.location.protocol + "//" + window.location.host
            + _spPageContextInfo.webServerRelativeUrl;

        var hostweburl = _spPageContextInfo.siteAbsoluteUrl;


        context = new SP.ClientContext(appweburl);
        var factory =
            new SP.ProxyWebRequestExecutorFactory(
                appweburl
            );
        context.set_webRequestExecutorFactory(factory);
        appContextSite = new SP.AppContextSite(context, hostweburl);

        web = appContextSite.get_web();
        context.load(web);
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("<View><Query><Where><Geq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>" + id + "</Value></Geq></Where></Query><RowLimit>5</RowLimit></View>");
        list = web.get_lists().getByTitle("Partners_Reports");

        listItems = list.getItems(SP.CamlQuery.createAllItemsQuery());
        context.load(list);
        context.load(listItems, 'Include(ID, Title,Partners,Country)');
        context.executeQueryAsync(onSuccess, onFail);


    }
    function onSuccess() {
        console.log('in');
        // $("#message").empty();
        var listInfo = '';
        var count = 0;
        var count = listItems.get_count();
        console.log('count', count);
        var listEnumerator = listItems.getEnumerator();
        console.log('Enumerator', listEnumerator);




        while (listEnumerator.moveNext()) {

            var listItem = listEnumerator.get_current();
            $('#reporttitle').text(listItem.get_item('Title') + " - " + listItem.get_item('Partners').$5I_1);


        }



    }

    // This function is executed if the above call fails
    function onFail(sender, args) {
        console.log(args.get_message());
        alert(args.get_message());
    }
    function getQueryStringParameter(paramToRetrieve) {
        var params = "";
        try {
            var params =
                document.URL.split("?")[1].split("&");
        }
        catch (err) {

        }
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve)
                return singleParam[1];
        }
    }



}

function word() {





    // for demo purposes only we are using below workaround with getDoc() and manual
    // HTML string preparation instead of simple calling the .getContent(). Becasue
    // .getContent() returns HTML string of the original document and not a modified
    // one whereas getDoc() returns realtime document - exactly what we need.
    var contentDocument = $("#Reports").html();
    var content = '<!DOCTYPE html>' + contentDocument;
    var orientation = "portrait";
    var converted = htmlDocx.asBlob(content, { orientation: orientation });

    saveAs(converted, 'test.docx');




}


function createitem() {
    // Retrieve the list that the user chose, and add an item to it.
    $("#Reports").empty();
    $('#wordbtn').prop('disabled', false);
    hostweburl = decodeURIComponent(hostweburl);
    appweburl = decodeURIComponent(appweburl);
    if (hostweburl == "undefined") {
        appweburl = window.location.protocol + "//" + window.location.host
            + _spPageContextInfo.webServerRelativeUrl;
        hostweburl = _spPageContextInfo.siteAbsoluteUrl;

    }



    context = new SP.ClientContext(appweburl);


    var factory =
        new SP.ProxyWebRequestExecutorFactory(
            appweburl
        );


    context.set_webRequestExecutorFactory(factory);

    appContextSite = new SP.AppContextSite(context, hostweburl);
    web = appContextSite.get_web();
    context.load(web);



    context = new SP.ClientContext(appweburl);
    var factory =
        new SP.ProxyWebRequestExecutorFactory(
            appweburl
        );
    context.set_webRequestExecutorFactory(factory);
    appContextSite = new SP.AppContextSite(context, hostweburl);

    web = appContextSite.get_web();
    context.load(web);
    var camlQuery = new SP.CamlQuery();
    var querytxt = "";
    var idpartner = $("select[name='partner']").val();
    if (idpartner > 0) {

        querytxt = "<View><Query> <Where><Eq> <FieldRef Name='Partners' LookupId='True' /> <Value Type='Integer'>" + idpartner + "</Value> </Eq>"
            + "  </Where></Query>   <OrderBy>   <FieldRef Name='Title' />  </OrderBy></View>";
    }
    var idcountry = $("select[name='country']").val();
    if (idcountry > 0) {
        querytxt = "<View><Query><Where><And><Eq><FieldRef Name='Partners' LookupId='True' /> <Value Type='Integer'>" + idpartner + "</Value> </Eq >"
            + " <Eq><FieldRef Name='Country' LookupId='True' /> <Value Type='Integer'>" + idcountry + "</Value> </Eq></And >"
            + "  </Where></Query>   <OrderBy>   <FieldRef Name='Title' />  </OrderBy></View>";
    }


    camlQuery.set_viewXml(querytxt);
    list = web.get_lists().getByTitle("Partners_Reports");
    if (querytxt == "")
        listItems = list.getItems(SP.CamlQuery.createAllItemsQuery());
    else
        listItems = list.getItems(camlQuery);
    context.load(list);
    context.load(listItems, 'Include(ID, Title,Partners,Country,Number_x0020_of_x0020_Activities)');
    context.executeQueryAsync(onSuccess, onFail);



    function onSuccess() {
        console.log('in');
        // $("#message").empty();
        var listInfo = '';
        var count = 0;
        activitycount = 0;
        repcount = 0;
        count = listItems.get_count();
        reportcount = count;
        console.log('count', count);
        var listEnumerator = listItems.getEnumerator();
        console.log('Enumerator', listEnumerator);

        if (count == 0) {
            var reporttxt = "<div id='report0'><div style='display: block; height: 90px; text-align: center; width: 100 %; background: #e95420; vertical-align: middle; margin-top: auto; line-height: 90px; font-size: 30px; color: #ffffff;'>NO DATA TO DISPLAY</div><div style='display: block;height: 45px;text-align: center;width: 100 %;vertical-align: middle;margin-top: auto;line-height: 45px;font-size: 20px;'></div > </div >";
            $("#Reports").append(reporttxt);
        }


        // grid.data = spdata;



        while (listEnumerator.moveNext()) {

            var listItem = listEnumerator.get_current();
            console.log(listItem.get_item('Partners'));
            var obj = listItem.get_item('Partners');
            var objCountry = listItem.get_item('Country');
            console.log(obj[Object.keys(obj)[1]] + "  " + objCountry[Object.keys(objCountry)[1]]);
            // document.getElementById("Reports").innerHTML = "<div id='repHeader'>" + obj[Object.keys(obj)[1]] + "  " + objCountry[Object.keys(objCountry)[1]] + "</div>";
            var reporttxt = "<div id='report" + listItem.get_item('ID') + "'><div style='display: block; height: 90px; text-align: center; width: 100 %; background: #e95420; vertical-align: middle; margin-top: auto; line-height: 90px; font-size: 30px; color: #ffffff;'>" + obj[Object.keys(obj)[1]] + " - " + objCountry[Object.keys(objCountry)[1]] + "</div><div style='display: block;height: 45px;text-align: center;width: 100 %;vertical-align: middle;margin-top: auto;line-height: 45px;font-size: 20px;'>Reporting Period: " + $("select[name='fromPeriod']").val() + " to " + $("select[name = 'toPeriod']").val() + " </div ><div class='repactivity' id='rep" + listItem.get_item('ID') +"'> </div > </div >";
            $("#Reports").append(reporttxt);
            console.log("appended");
            //running the loop to have the activity


            //  $("#rep" + listItem.get_item('ID')).append('<div class="activityheader">Activity ' + (iii + 1) + '<div id="activity' + listItem.get_item('ID') +'"></div></div>');

            getForms(listItem.get_item('ID'));

            /*
            context = new SP.ClientContext(appweburl);
            var factory =
                new SP.ProxyWebRequestExecutorFactory(
                    appweburl
                );
            context.set_webRequestExecutorFactory(factory);
            appContextSite = new SP.AppContextSite(context, hostweburl);

            web = appContextSite.get_web();
            context.load(web);
            var camlQuery = new SP.CamlQuery();
            var reportid = listItem.get_item('ID');
      

            camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'Report\' LookupId=\'True\'/>' +
                '<Value Type=\'Number\'>' + listItem.get_item('ID') + '</Value></Eq></Where></Query><OrderBy>'
                +' < FieldRef Name= "Title" /></OrderBy ></View>');

        //  camlQuery.set_viewXml('<View><Query><Where> < Eq > <FieldRef Name="Report" LookupId="True" /> <Value Type="Number">' + listItem.get_item('ID') + '</Value> </Eq ></Where ></View>');

            list = web.get_lists().getByTitle("Partners_Activities");

            listItems = list.getItems(camlQuery);
            context.load(list);
            context.load(listItems, 'Include(ID,Title,Activity,Successes,Challenges,Related_x0020_Outputs,Others_x0020_Comments,Period,Report)');
            context.executeQueryAsync(onSuccess1, onFail);

            */



            function onQuerySucceeded(sender, args) {
                console.log('in success1 - bis');
                var listItemInfo = '';

                var listItemEnumerator = listItems.getEnumerator();

                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    listItemInfo += '\nTitle: ' + oListItem.get_item('Title') +
                        '\nBody: ' + oListItem.get_item('Period');
                }
                console.log(listItemInfo);


            }

            function onSuccess1() {
                console.log('in success1');
                // $("#message").empty();
                var listInfo = '';
                var count = 0;
                var count = listItems.get_count();
               
                console.log('count', count);

                var listEnumerator2 = listItems.getEnumerator();
                console.log('count', count);

                while (listEnumerator2.moveNext()) {




                    var listItem = listEnumerator2.get_current();



                    var objrep = listItem.get_item('Report');
                    var repid = objrep[Object.keys(objrep)[0]];
                    console.log('rep id', repid);


                    $("#rep" + repid).append('<span class="activityHeader">' + listItem.get_item('Title') + '</span><br>');


                    $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Period</span><br>');
                    $("#rep" + objrep[Object.keys(objrep)[0]]).append('<div class="details">' + listItem.get_item('Period') + '</div>');


                    $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Discription</span><br>');
                    $("#rep" + objrep[Object.keys(objrep)[0]]).append('<div class="details">' + listItem.get_item('Activity') + '</div>');


                    $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Successes</span><br>');
                    $("#rep" + objrep[Object.keys(objrep)[0]]).append('<div class="details">' + listItem.get_item('Successes') + '</div>');

                    $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Challenges</span><br>');
                    $("#rep" + objrep[Object.keys(objrep)[0]]).append('<div class="details">' + listItem.get_item('Challenges') + '</div>');

                    $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Related Outputs</span><br>');
                    $("#rep" + objrep[Object.keys(objrep)[0]]).append('<div class="details">' + listItem.get_item('Related_x0020_Outputs') + '</div>');

                    $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Others Comments</span><br>');
                    $("#rep" + objrep[Object.keys(objrep)[0]]).append('<div class="details">' + listItem.get_item('Others_x0020_Comments') + '</div>');






                    //  $("#rep" + listItem.get_item('ID')).append('<div class="activityheader">Activity ' + (iii + 1) + '<div id="activity' + listItem.get_item('ID') + '"></div></div>');



                }



            }


        }
        $.LoadingOverlay("hide");



    }






    // This function is executed if the above call fails
    function onFail(sender, args) {
        console.log(args.get_message());
        // alert(args.get_message());
        $.LoadingOverlay("hide");
    }

}


function getactivities(id) {


}


function getForms(id) {

    var repid = id;

    var period = ['Jan-2017', 'Feb-2017', 'Mar-2017', 'Apr-2017', 'May-2017', 'Jun-2017', 'Jul-2017', 'Aug-2017', 'Sep-2017', 'Oct-2017', 'Nov-2017', 'Dec-2017', 'Jan-2018', 'Feb-2018', 'Mar-2018', 'Apr-2018', 'May-2018', 'Jun-2018', 'Jul-2018', 'Aug-2018', 'Sep-2018', 'Oct-2018', 'Nov-2018', 'Dec-2018'];

    var indexmin = period.indexOf($("select[name='fromPeriod']").val());

    var indexmax = period.indexOf($("select[name='toPeriod']").val());

    var periodfilter = "";
    var periods = [];

    for (var jjj = indexmin; jjj <= indexmax; jjj++) {
        periods.push("Period eq '" + period[jjj] + "'");
    }
    periodfilter = periods.join("or ");



    var call = $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl.replace("EquipExco", "") + "/_api/Web/Lists/GetByTitle('Partners_activities')/items?$select=Id,Title,Activity,Successes,Challenges,Related_x0020_Outputs,Others_x0020_Comments,Period,Report/Id&$expand=Report/Id&$filter=(Report/Id eq " + id + "and (" + periodfilter + "))&$orderby=Title asc",
        type: "GET",
        dataType: "json",
        headers: {
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        }

    });
    call.done(function (data, textStatus, jqXHR) {
        var index = 0;
        var retVal = "";
        var i = 0;
        var id;
        i = 1;
        repcount++;

        retVal += '<div></div>';

        console.log("count activity", data.d.results.length);
        if (data.d.results.length == 0) {
            $("#report" + repid).empty();
        }

        for (index in data.d.results) {
            id = data.d.results[index].Id;




            $("#rep" + repid).append('<span style="color:#e95420;font-size:14px;font-weight:bold;text-decoration:underline;">' + data.d.results[index].Title + '</span><br>');


            $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Period</span><br>');
            $("#rep" + repid).append('<div style="padding-left:20px;">' + data.d.results[index].Period + '</div>');


            $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Discription</span><br>');
            $("#rep" + repid).append('<div style="padding-left:20px;">' + data.d.results[index].Activity + '</div>');


            $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Successes</span><br>');
            $("#rep" + repid).append('<div style="padding-left:20px;">' + data.d.results[index].Successes + '</div>');

            $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Challenges</span><br>');
            $("#rep" + repid).append('<div style="padding-left:20px;">' + data.d.results[index].Challenges + '</div>');

            $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Related Outputs</span><br>');
            $("#rep" + repid).append('<div style="padding-left:20px;">' + data.d.results[index].Related_x0020_Outputs + '</div>');

            $("#rep" + repid).append('<br><span style="color: #e95420;font-size: 14px;font-style:italic;padding-left:20px;">Others Comments</span><br>');
            $("#rep" + repid).append('<div style="padding-left:20px;">' + data.d.results[index].Others_x0020_Comments + '</div>');

            i++;
            activitycount++;
        }

        if (activitycount == 0 && reportcount==repcount)
        {
            var reporttxt = "<div id='report0'><div style='display: block; height: 90px; text-align: center; width: 100 %; background: #e95420; vertical-align: middle; margin-top: auto; line-height: 90px; font-size: 30px; color: #ffffff;'>NO DATA TO DISPLAY</div><div style='display: block;height: 45px;text-align: center;width: 100 %;vertical-align: middle;margin-top: auto;line-height: 45px;font-size: 20px;'> </div > </div >";
            $("#Reports").append(reporttxt);
        }




    });
    call.fail(function (jqXHR, textStatus, errorThrown) {

        $.notify('Error retrieving information from list', { className: "error", position: "top center" });


    });





}

function SaveChildForm(formName) {


    hostweburl = decodeURIComponent(hostweburl);
    appweburl = decodeURIComponent(appweburl);
    if (hostweburl == "undefined") {
        appweburl = window.location.protocol + "//" + window.location.host
            + _spPageContextInfo.webServerRelativeUrl;
        hostweburl = _spPageContextInfo.siteAbsoluteUrl;

    }



    context = new SP.ClientContext(appweburl);


    var factory =
        new SP.ProxyWebRequestExecutorFactory(
            appweburl
        );


    context.set_webRequestExecutorFactory(factory);

    appContextSite = new SP.AppContextSite(context, hostweburl);
    web = appContextSite.get_web();
    context.load(web);

    var selectedList = web.get_lists().getByTitle("Partners_Activities");


    var newActivity = selectedList.getItemById(formName);
    tinyMCE.get("activity_" + formName).focus();
    var txtactivity = tinyMCE.get("activity_" + formName).getContent();

    tinyMCE.get("success_" + formName).focus();
    var txtsuccess = tinyMCE.get("success_" + formName).getContent();

    tinyMCE.get("challenge_" + formName).focus();
    var txtchallenge = tinyMCE.get("challenge_" + formName).getContent();

    tinyMCE.get("output_" + formName).focus();
    var txtoutput = tinyMCE.get("output_" + formName).getContent();

    tinyMCE.get("comment_" + formName).focus();
    var txtcomment = tinyMCE.get("comment_" + formName).getContent();

    newActivity.set_item('Activity', txtactivity);
    newActivity.set_item('Successes', txtsuccess);
    newActivity.set_item('Challenges', txtchallenge);
    newActivity.set_item('Related_x0020_Outputs', txtoutput);
    newActivity.set_item('Others_x0020_Comments', txtcomment);
    newActivity.set_item('Period', $("#period_" + formName).val());


    newActivity.update();
    context.load(newActivity);
    context.executeQueryAsync(onItemCreationSuccess1, onItemCreationFail);
    function onItemCreationSuccess1() {
        // Refresh the list of items.
        console.log(newActivity.get_id());
        $.notify('The activity was saved!', { className: "success", position: "top center" });

    }
    function onItemCreationFail(sender, args) {
        // The item couldn’t be created – display an error message.


        $.notify('Failed to create the item. ' + args.get_message(), { className: "error", position: "top center" });
    }


}

function processSendEmails(id) {

    var from = 'no-reply@sharepointonline.com',
        to = _spPageContextInfo.userLoginName,
        body = "Good day <br> A new Exco report report was submitted by " + user.get_title() + ". You can view it at this url <a href='" + appweburl + "/Pages/view.aspx?id=" + reportid + "'>View report<a><br> Kind regards,<br>Sharepoint",
        subject = 'A new report Exco report was submitted by ' + user.get_title() + "";

    // Call sendEmail function
    //
    sendEmail(from, to, body, subject);
}


function sendEmail(from, to, body, subject) {
    //Get the relative url of the site
    var siteurl = _spPageContextInfo.webAbsoluteUrl.replace("EquipExco", "");
    var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: "POST",
        data: JSON.stringify({
            'properties': {
                '__metadata': {
                    'type': 'SP.Utilities.EmailProperties'
                },
                'From': from,
                'To': {
                    'results': [to]
                },
                'Body': body,
                'Subject': subject
            }
        }),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
        },
        success: function (data) {

            $.notify('Email Sent Successfully', { className: "success", position: "top center" });
            window.location = window.location.protocol + "//" + window.location.host + _spPageContextInfo.webServerRelativeUrl;;


        },
        error: function (err) {
            $.notify('Error in sending Email: ' + JSON.stringify(err), { className: "error", position: "top center" });
        }
    });
}

$(document).ready(function () {

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', processSendEmails);

});






$(document).ready(function () {
    //SP.SOD.executeFunc('sp.js', 'SP.ClientContext', getUrl);
    // getUrl();
    console.log("in ready");


});

