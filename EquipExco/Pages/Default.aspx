<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/gijgo.min.js"></script>
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
        <link rel="Stylesheet" type="text/css" href="../Content/gijgo.min.css" />

    
       <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" type="text/css" />

    <link rel="Stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/united/bootstrap.min.css" />

    <!-- Add your JavaScript to the following file -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
 <script src="https://cdn.jsdelivr.net/jquery.loadingoverlay/latest/loadingoverlay.min.js"></script>
 <script src="https://cdn.jsdelivr.net/jquery.loadingoverlay/latest/loadingoverlay_progress.min.js"></script>

    


    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    EXCO Meetings Submissions
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div>
        <br />
<div>

</div>
<br />

        

        <div id="message">

       <div class="container-full">
<div class="row">

 <div class="col-md-1" style="display:none" >
      <span>   <a id="btnAdd" href="Add.aspx"  class="static ms-quicklaunch-dropNode menu-item ms-core-listMenu-item ms-displayInline ms-navedit-linkNode">Submissions</a></span> 
     <br />  <a id="btnAdd2" href="Reports.aspx"  class="static ms-quicklaunch-dropNode menu-item ms-core-listMenu-item ms-displayInline ms-navedit-linkNode">Report</a>
            </div>
            <div class="col-md-11">
                <div id="starter">
 
    <p>
  <h2>Reports</h2>  
</p>
</div>

                          <div class="container-full">
        <div class="row">
            <div class="col-xs-8">
         
            </div>
            <div class="col-xs-4">
                <a id="btnAdd" href="Add.aspx" style="color:white" class="btn btn-primary pull-right">Add New Report</a>
            </div>
        </div>
        <div class="row" style="margin-top: 10px">
            <div class="col-xs-12">
                <table id="grid"></table>
            </div>
        </div>
    </div>



            </div>

</div>
           
</div>


            <!-- The following content will be replaced with the user name when you run the app - see App.js -->
       
        </div>




    <script type="text/javascript">

        $(document).ajaxSend(function (event, jqxhr, settings) {
            $.LoadingOverlay("show");
        });
        $(document).ajaxComplete(function (event, jqxhr, settings) {
            $.LoadingOverlay("hide");
        });
      
    </script>


    </div>

</asp:Content>
