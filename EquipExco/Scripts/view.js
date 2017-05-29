'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");


var hostweburl;
var appweburl;
var appContextSite;
var list;
var listItems;
var context;
var user;
var web;
var lists;
var listItemCollection;  // This variable is used later when you add list items.

var grid, dialog,spdata; // grid system



function initializePage()
{


    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {



    getUrl();
    var reportid = getQueryStringParameter("id");
    console.log("report id:", reportid);
    if (reportid > 0)
    {
        $('#formtable').hide();

      


        var call = $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl.replace("EquipExco","") + "/_api/Web/Lists/GetByTitle('Partners_reports')/items?$select=Id,Title,Country/Title,Created,Number_x0020_of_x0020_Activities,Partners/Title&$expand=Author&$select=Author/Title&$expand=Partners/Title&$expand=Country/Title&$filter=Id eq " + reportid,     
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
                $('#reporttitle').text(data.d.results[index].Partners.Title + " - " + data.d.results[index].Country.Title + " by " + data.d.results[index].Author.Title + " - Submitted: " + data.d.results[index].Created);

                var ActivityNo = data.d.results[index].Number_x0020_of_x0020_Activities;
                console.log(ActivityNo);
                getForms(data.d.results[index].Id);
            
              //  document.getElementById("activities_details").innerHTML = $forms;
               // $('#activities_details').text('landry');
 
            }


        });
        call.fail(function (jqXHR, textStatus, errorThrown) {
            alert("Error retrieving information from list: " + jqXHR.responseText);
           
        });


        function fillActivities() {
            $('.activityNo').show();
        }
 


    }

    function fillActivities() {
        $('.activityNo').show();
    }

    $(document).ready(function () {




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



    });

    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {
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
        alert('Failed to get user name. Error:' + args.get_message());
    }


    function getUrl() {
        var appWebUrl = window.location.protocol + "//" + window.location.host
            + _spPageContextInfo.webServerRelativeUrl;

        var hostweburl = _spPageContextInfo.webAbsoluteUrl.replace("EquipExco","");
        hostweburl = decodeURIComponent(hostweburl);
        appweburl = decodeURIComponent(appweburl);
        var scriptbase = hostweburl + "/_layouts/15/";
        $.getScript(scriptbase + "SP.RequestExecutor.js", console.log('requestexecutor'));
    }
               
        

 

    function execOperation(id) {


        var appweburl = window.location.protocol + "//" + window.location.host
            + _spPageContextInfo.webServerRelativeUrl;

        var hostweburl = _spPageContextInfo.webAbsoluteUrl.replace("EquipExco","");


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
        camlQuery.set_viewXml("<View><Query><Where><Geq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>"+id+"</Value></Geq></Where></Query><RowLimit>5</RowLimit></View>");
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
            $('#reporttitle').text(listItem.get_item('Title')+" - "+ listItem.get_item('Partners').$5I_1);
          
          
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


function createitem() {
    // Retrieve the list that the user chose, and add an item to it.


    var appweburl = window.location.protocol + "//" + window.location.host
        + _spPageContextInfo.webServerRelativeUrl;

    var hostweburl = _spPageContextInfo.webAbsoluteUrl.replace("EquipExco","");


   
    context = new SP.ClientContext(appweburl);

  
 var factory =
        new SP.ProxyWebRequestExecutorFactory(
            appweburl
        ); 

   
 context.set_webRequestExecutorFactory(factory);

 appContextSite = new SP.AppContextSite(context, hostweburl);
 web = appContextSite.get_web();
    context.load(web);



  


    var selectedList = web.get_lists().getByTitle("Partners_Reports");

    var listItemCreationInfo = new SP.ListItemCreationInformation();
    var newItem = selectedList.addItem(listItemCreationInfo);
    var nbractivities = $("#activityNo").val();
    newItem.set_item('Title', "EXCO Meetings Submissions");
    newItem.set_item('Partners', $("select[name='partner']").val());
    newItem.set_item('Country', $("select[name='country']").val());
    
    newItem.set_item('Number_x0020_of_x0020_Activities', $("#activityNo").val());

    newItem.update();
    context.load(newItem);
    context.executeQueryAsync(onItemCreationSuccess, onItemCreationFail);
    console.log('just to make sure im at the end');

function onItemCreationSuccess() {
    // Refresh the list of items.
    console.log(newItem.get_id());
    var selectedList = web.get_lists().getByTitle("Partners_Activities");

    var listItemCreationInfo = new SP.ListItemCreationInformation();
    for (var i = 0; i < nbractivities; i++) {

        var newActivity = selectedList.addItem(listItemCreationInfo);
        newActivity.set_item('Title', "Activity " + (i + 1));
        newActivity.set_item('Report', newItem.get_id() );
        newActivity.update();
        context.load(newActivity);
        context.executeQueryAsync(onItemCreationSuccess1, onItemCreationFail);
    }
    window.location = "add.aspx?id="+newItem.get_id();

    function onItemCreationSuccess1() {
        // Refresh the list of items.
        console.log(newActivity.get_id());

        }



    }

function onItemCreationFail(sender, args) {
    // The item couldn’t be created – display an error message.
    alert('Failed to create the item. ' + args.get_message());
}


}


function getForms(id) {



    var call = $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl.replace("EquipExco","") + "/_api/Web/Lists/GetByTitle('Partners_activities')/items?$select=Id,Title,Activity,Successes,Challenges,Related_x0020_Outputs,Others_x0020_Comments,Period,Report/Id&$expand=Report/Id&$filter=Report/Id eq " + id,
        type: "GET",
        dataType: "json",
        headers: {
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        }

    });
    call.done(function (data, textStatus, jqXHR) {
        var index = 0;
        var retVal="";
        var i = 0;
        var id;
        i = 1;

        


        for (index in data.d.results) {
            id = data.d.results[index].Id;
            
         //   options += "<option value='" + data.d.results[index].Id + "'>" +    data.d.results[index].Title + "</option>";

        

            retVal += '<div class="panel panel-primary panel-activity"> <div class="panel-heading"><div class="activity-title"><p class="panel-title" >'
                + '<a data-toggle="collapse" style="display:block" class="activity collapsed"  data-parent="#accordion" href= "#activity' + i + '" aria-expanded="false" >'
                + 'Activity ' + i + '</a ></p ></div ></div > <div id="activity' + i + '" class="panel-collapse collapse" style="height: 0px;" aria-expanded="false"><div class="panel-body"><div class="activity-form">'

                + '    <div class="list-group"> <a  class="list-group-item" >'
                + '   <h4 class="list-group-item-heading">Period</h4>'
                + '    <p class="list-group-item-text">' + data.d.results[index].Period + '</p>  </a > </div >'
            
                + '    <div class="list-group"> <a  class="list-group-item" >'
                + '   <h4 class="list-group-item-heading">Activity</h4>'
                + '    <p class="list-group-item-text">' + data.d.results[index].Activity + '</p>  </a > </div >'

                + '    <div class="list-group"> <a  class="list-group-item" >'
                + '   <h4 class="list-group-item-heading">Successes</h4>'
                + '    <p class="list-group-item-text">' + data.d.results[index].Successes + '</p>  </a > </div >'

                + '    <div class="list-group"> <a  class="list-group-item" >'
                + '   <h4 class="list-group-item-heading">Challenges</h4>'
                + '    <p class="list-group-item-text">' + data.d.results[index].Challenges + '</p>  </a > </div >'

                + '    <div class="list-group"> <a  class="list-group-item" >'
                + '   <h4 class="list-group-item-heading">Related Outputs</h4>'
                + '    <p class="list-group-item-text">' + data.d.results[index].Related_x0020_Outputs + '</p>  </a > </div >'

                + '    <div class="list-group"> <a  class="list-group-item" >'
                + '   <h4 class="list-group-item-heading">Others Comments</h4>'
                + '    <p class="list-group-item-text">' + data.d.results[index].Others_x0020_Comments + '</p>  </a > </div ></div ></div ></div ></div >';
            i++;
        }


        document.getElementById("activities_details").innerHTML = retVal;



    });
    call.fail(function (jqXHR, textStatus, errorThrown) {
        alert("Error retrieving information from list: ");

    });





}

function SaveChildForm(formName) {


    var appweburl = window.location.protocol + "//" + window.location.host
        + _spPageContextInfo.webServerRelativeUrl;

    var hostweburl = _spPageContextInfo.webAbsoluteUrl.replace("EquipExco","");



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

    newActivity.set_item('Activity', $("#activity_" + formName).val());
    newActivity.set_item('Successes', $("#success_" + formName).val());
    newActivity.set_item('Challenges', $("#challenge_" + formName).val());
    newActivity.set_item('Related_x0020_Outputs', $("output_" + formName).val());
    newActivity.set_item('Others_x0020_Comments', $("#comment_" + formName).val());
    newActivity.set_item('Period', $("#period_" + formName).val());


    newActivity.update();
    context.load(newActivity);
    context.executeQueryAsync(onItemCreationSuccess1, onItemCreationFail);
    function onItemCreationSuccess1() {
        // Refresh the list of items.
        console.log(newActivity.get_id());

    }
    function onItemCreationFail(sender, args) {
        // The item couldn’t be created – display an error message.
        alert('Failed to create the item. ' + args.get_message());
    }


}






$(document).ready(function () {
    //SP.SOD.executeFunc('sp.js', 'SP.ClientContext', getUrl);
   // getUrl();
    console.log("in ready");

       
});

