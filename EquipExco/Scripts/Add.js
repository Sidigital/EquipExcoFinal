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
var user;
var lists;
var listItemCollection;  // This variable is used later when you add list items.

var grid, dialog, spdata; // grid system

var reportid;



function initializePage()
{


    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {



        getUrl();
        getUserName();
   reportid = getQueryStringParameter("id");
    console.log("report id:", reportid);
    if (reportid > 0)
    {
        $('#formtable').hide();

       /* var appWebUrl = window.location.protocol + "//" + window.location.host
            + _spPageContextInfo.webServerRelativeUrl;

        var hostweburl = _spPageContextInfo.siteAbsoluteUrl;
        hostweburl = decodeURIComponent(hostweburl);
        appweburl = decodeURIComponent(appweburl);
        execOperation(reportid); */


      /*  url: _spPageContextInfo.siteAbsoluteUrl + "/_api/Web/Lists/GetByTitle('" + params.childList +
            "')/items?$select=Id," + params.childLookupField + "," + params.parentFieldInChildList +
            "/Id&$expand=" + params.parentFieldInChildList + "/Id&$filter=" + params.parentFieldInChildList +
            "/Id eq " + parentID,*/


        var call = $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl.replace("EquipExco", "")+ "/_api/Web/Lists/GetByTitle('Partners_reports')/items?$select=Id,Title,Country/Title,Created,Number_x0020_of_x0020_Activities,Partners/Title&$expand=Author&$select=Author/Title&$expand=Partners/Title&$expand=Country/Title&$filter=Id eq " + reportid,     
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




        // pupulate partners dropdown

        var dd = $("select[name='partner']");


        $(dd).empty();
        $(dd).append('<option value="0" selected="selected">--- select ---</option>');

        var options = "";

        var call = $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl.replace("EquipExco","") + "/_api/Web/Lists/GetByTitle('Partners')/items?$select=Id,Title", 
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
            $(child).append('<option value="0" selected="selected">--- select ---</option>');

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
                var index=0;
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

        $.notify('The Report was saved!', { className: "success", position: "top center" });

        }



    }

function onItemCreationFail(sender, args) {
    // The item couldn’t be created – display an error message.

    $.notify('Failed to create the item. ' + args.get_message(), { className: "error", position: "top center" });

}


}


function getForms(id) {



    var call = $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl.replace("EquipExco", "") + "/_api/Web/Lists/GetByTitle('Partners_activities')/items?$select=Id,Title,Activity,Successes,Challenges,Related_x0020_Outputs,Others_x0020_Comments,Period,Report/Id&$expand=Report/Id&$filter=Report/Id eq " + id,
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

        retVal += '<div></div>';


        for (index in data.d.results) {
            id = data.d.results[index].Id;

            
            retVal += '<div style="clear: both;"></div>';
         //   options += "<option value='" + data.d.results[index].Id + "'>" +    data.d.results[index].Title + "</option>";
            var period = ['Jan-2017', 'Feb-2017', 'Mar-2017', 'Apr-2017', 'May-2017', 'Jun-2017', 'Jul-2017', 'Aug-2017', 'Sep-2017', 'Oct-2017', 'Nov-2017', 'Dec-2017', 'Jan-2018', 'Feb-2018', 'Mar-2018', 'Apr-2018', 'May-2018', 'Jun-2018', 'Jul-2018', 'Aug-2018', 'Sep-2018', 'Oct-2018', 'Nov-2018', 'Dec-2018'];
            var options = "";
            var Len = period.length;
     
            for (var ii = 0; ii < Len; ii++) {
                if (period[ii] == data.d.results[index].Period)
                    options += '<option value="' + period[ii] + '" selected>' + period[ii] + '</option>';
                else
                    options += '<option value="' + period[ii] + '">' + period[ii] + '</option>';
            }

            retVal += '<div  class="panel panel-primary panel-activity"> <div class="panel-heading"><div class="activity-title"><p class="panel-title" >'
                + '<a data-toggle="collapse" style="display:block" class="activity collapsed"  data-parent="#accordion" href= "#activity' + i + '" aria-expanded="false" >'
                + 'Activity ' + i + '</a ></p ></div ></div> <div id="activity' + i + '" class="panel-collapse collapse" style="height: 0px;" aria-expanded="false"><div class="panel-body"><div class="activity-form">'
                + '<form class="form-horizontal">' 
                +'   <div style="overflow: auto;" class="form-group"><label class="control-label col-sm-2" for="email">Period for reporting:</label> <div class="col-sm-10">'
                + '      <div > <select id= "period_' + id + '" name= "period_' + id + '" > ' + options+'</select > </div>   </div></div >'
                + '   <div style="overflow: auto;" class="form-group"><label class="control-label col-sm-2" for="email">Activity:</label> <div class="col-sm-10">'
                + '      <div><textarea id="activity_' + id + '" name="activity_' + id + '" cols="70" rows="3">' + data.d.results[index].Activity + '</textarea> </div>   </div></div >'
                + '   <div style="overflow: auto;" class="form-group"><label class="control-label col-sm-2" for="email">Successes:</label> <div class="col-sm-10">'
                + '      <div ><textarea id="success_' + id + '" name="success_' + id + '" cols="70" rows="3">' + data.d.results[index].Successes + '</textarea></div>   </div></div >'
                + '   <div style="overflow: auto;" class="form-group"><label class="control-label col-sm-2" for="email">Challenges:</label> <div class="col-sm-10">'
                + '      <div ><textarea id="challenge_' + id + '" name="challenge_' + id + '" cols="70" rows="3">' + data.d.results[index].Challenges + '</textarea> </div>   </div></div >'
                + '   <div style="overflow: auto;" class="form-group"><label class="control-label col-sm-2" for="email">Related Outputs:</label> <div class="col-sm-10">'
                + '      <div ><textarea id="output_' + id + '" name="output_' + id + '" cols="70" rows="3">' + data.d.results[index].Related_x0020_Outputs + '</textarea> </div>   </div></div >'
                + '   <div style="overflow: auto;" class="form-group"><label class="control-label col-sm-2" for="email">Other Comments:</label> <div class="col-sm-10">'
                + '      <div ><textarea id="comment_' + id + '" name="comment_' + id + '" cols="70" rows="3">' + data.d.results[index].Others_x0020_Comments + '</textarea> </div>   </div></div >'
                + ' <div style="overflow: auto;" class="form-group"> <div class="col-sm-offset-2 col-sm-10" ><input type="button" class="btn btn-primary follow" value="Save" onClick="return SaveChildForm(\'' + data.d.results[index].Id + '\');">  </div >  </div ></form ></div ></div ></div ></div >  ';
            i++;
        }
        retVal += '    <a id="sendemail"  class="btn btn-primary follow"  onClick="return processSendEmails(' + reportid + ')">Finish</a>';


        document.getElementById("activities_details").innerHTML = retVal;
        tinymce.init({
            selector: 'textarea',
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code'
            ],
            toolbar: 'bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',

        });



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
        body = "Good day <br> A new Exco report report was submitted by " + user.get_title() + ". You can view it at this url <a href='" + appweburl + "/Pages/view.aspx?id=" + reportid +"'>View report<a><br> Kind regards,<br>Sharepoint",
        subject = 'A new report Exco report was submitted by ' + user.get_title()+"";

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

