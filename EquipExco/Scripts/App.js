'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");


var hostweburl;
var appweburl;
var appContextSite;
var list;
var listItems;
var context;
var user = context.get_web().get_currentUser();
var web;
var lists;
var listItemCollection;  // This variable is used later when you add list items.

var grid, dialog,spdata; // grid system



function initializePage()
{
     $.LoadingOverlay("show");
    var spdata ;

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {

        getUrl();
    });

    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    // This function is executed if the above call is successful
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        $('#message').text('Hello ' + user.get_title());
    }

    // This function is executed if the above call fails
    function onGetUserNameFail(sender, args) {
        alert('Failed to get user name. Error:' + args.get_message());
    }


    function getUrl() {

        
        hostweburl = getQueryStringParameter("SPHostUrl");
        appweburl = getQueryStringParameter("SPAppWebUrl");
        hostweburl = decodeURIComponent(hostweburl);
        appweburl = decodeURIComponent(appweburl);
        if (hostweburl == "")
        {
            appweburl = window.location.protocol + "//" + window.location.host
                + _spPageContextInfo.webServerRelativeUrl;
            hostweburl = _spPageContextInfo.siteAbsoluteUrl;

        }


        var scriptbase = hostweburl + "/_layouts/15/";
        $.getScript(scriptbase + "SP.Runtime.js",
            function () {
                $.getScript(scriptbase + "SP.js",
                    function () { $.getScript(scriptbase + "SP.RequestExecutor.js", execOperation); }
                );
            }
        );

    }

    function execOperation() {
       
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
        camlQuery.set_viewXml("<View><RowLimit>100</RowLimit></View>");
        list = web.get_lists().getByTitle("Partners_Reports");

        listItems = list.getItems(SP.CamlQuery.createAllItemsQuery());
       context.load(list);
       context.load(listItems, 'Include(ID, Title,Partners,Country,Number_x0020_of_x0020_Activities)');
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
        

       // grid.data = spdata;
        
   

        while (listEnumerator.moveNext()) {

            var listItem = listEnumerator.get_current();
            console.log(listItem.get_item('Partners'));
            var obj = listItem.get_item('Partners');
            var objCountry = listItem.get_item('Country');
            grid.addRow({ 'ID': listItem.get_item('ID'), 'Title': listItem.get_item('Title'), 'Partners': obj[Object.keys(obj)[1]], 'Country': objCountry[Object.keys(objCountry)[1]], 'No': listItem.get_item('Number_x0020_of_x0020_Activities') });
          
        }
            $.LoadingOverlay("hide");


    }

    // This function is executed if the above call fails
    function onFail(sender, args) {
        console.log(args.get_message());
        alert(args.get_message());
        $.LoadingOverlay("hide");
    }
    function getQueryStringParameter(paramToRetrieve) {
        var params = "";
        try
        {
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

 
    console.log('spdata before grid:', spdata);
    grid = $('#grid').grid({
        primaryKey: 'ID',
        dataSource:spdata,
        uiLibrary: 'bootstrap',
        columns: [
            { field: 'ID', width: 48 },
            { field: 'Title', sortable: true },
            { field: 'Partners', title: 'Partners', sortable: true },
            { field: 'Country', title: 'Countries', sortable: true },
            { field: 'No', title: 'Number of activities', sortable: true },
           
            { title: '', field: 'Edit', width: 34, type: 'icon', icon: 'glyphicon-pencil', tooltip: 'Edit', events: { 'click': Edit } },
            { title: '', field: 'View', width: 34, type: 'icon', icon: 'glyphicon-menu-hamburger', tooltip: 'View', events: { 'click': View } }
           // { title: '', field: 'Delete', width: 34, type: 'icon', icon: 'glyphicon-remove', tooltip: 'Delete', events: { 'click': Delete } }
        ],
        pager: { limit: 10, sizes: [2, 5, 10, 20] }
    });


    function Edit(e) {

        window.location = "add.aspx?id=" + e.data.record.ID ;

    }

    function Delete(e) {
        alert('not yet implemented');
    }

    function View(e) {
        window.location = "view.aspx?id=" + e.data.record.ID;
    }

   

    $('#btnSearch').on('click', function () {
        grid.reload({ name: $('#txtQuery').val() });
    });
    $('#btnClear').on('click', function () {
        $('#txtQuery').val('');
        grid.reload({ name: '' });
    });



  

}

function add()
    {

    window.location = "add.aspx";
}



$(document).ready(function () {
    //SP.SOD.executeFunc('sp.js', 'SP.ClientContext', getUrl);
    getUrl();
    console.log("in ready");

       
});

