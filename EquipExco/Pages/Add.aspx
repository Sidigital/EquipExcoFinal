<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
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
       <script src="https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.5.6/tinymce.min.js"></script>
  <script>tinymce.init({ selector: 'textarea' });</script>
  
    <script type="text/javascript" src="../Scripts/add.js"></script>
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
   <h2>Add/Edit Report</h2>
</div>
<br />
<div id="starter">
    <p>

    </p>
</div>
        
        <div id="message">
            <div id="notification"></div>
           <form class="form-horizontal" name="activities" id="activities" method="post" action="action"> 
               <div id="formtable">
                    <div style="overflow: auto;" class="form-group">
    <label class="control-label col-sm-2" for="email">Partner:</label>
    <div class="col-sm-10">

        <select class="form-control" id="partner" name="partner" onchange="">
						<option value="0" selected="selected">--- select ---</option>

					</select>
    </div>
  </div>
              
                                       <div style="overflow: auto;" class="form-group">
    <label class="control-label col-sm-2" for="email">Country:</label>
    <div class="col-sm-10">

       <div class="country">
						<select class="form-control" id="country" name="country" onchange="fillActivities()">
							<option value="0" selected="selected">--- select partner first ---</option>
							<option value="1">Country</option>
						</select>
					</div>
    </div>
  </div>
                                       <div style="overflow: auto;" class="form-group">
    <label class="activityNo control-label col-sm-2"  style="display: none;" for="email">Number of Activities being Reported on:</label>
    <div class="col-sm-10">
        <input class="activityNo form-control"  style="display: none;" name="activityNo" id="activityNo" type="number">

    </div>
  </div>
        <p>&nbsp;</p>             <div class="form-group"> 
    <div class="col-sm-offset-2 col-sm-10">
    <input type="button" class="btn btn-primary follow" value="Next" onClick="return createitem()"></input>
    </div>


               </div>



            
	</form>
	 </div>
	   <h3 id="reporttitle"></h3>
               <p id="activities_details"></p>


        
   
<script>	

 
    function fillActivities() {
        $('.activityNo').show();
    }


        $(document).ajaxSend(function (event, jqxhr, settings) {
            $.LoadingOverlay("show");
        });
        $(document).ajaxComplete(function (event, jqxhr, settings) {
            $.LoadingOverlay("hide");
        });
      
    </script>


    </div>

</asp:Content>

