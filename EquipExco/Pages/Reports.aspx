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

           <script src="https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js"></script>

    <script type="text/javascript" src="../Scripts/FileSaver.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.wordexport.js"></script>

    

    


    <script type="text/javascript" src="../Scripts/reports.js"></script>
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

 <div class="col-md-1" style="display:none">
      <span>   <a id="btnAdd" href="default.aspx"  class="static ms-quicklaunch-dropNode menu-item ms-core-listMenu-item ms-displayInline ms-navedit-linkNode">Submissions</a></span> 
     <br />  <a id="btnAdd2" href="Reports.aspx"  class="static ms-quicklaunch-dropNode menu-item ms-core-listMenu-item ms-displayInline ms-navedit-linkNode">Report</a>
            </div>
            <div class="col-md-11">
                <div id="starter">
 
    <p>
  <h2>Reports</h2>  
</p>
</div>

                          <div class="container-full">

        <div class="row" style="margin-top: 10px">
            <div class="col-xs-12">
              <form class="form-horizontal" name="activities" id="activities" method="post" action="action"> 
               <div id="formtable">
                    <div style="overflow: auto;" class="form-group">
    <label class="control-label col-sm-2" for="email">Partner:</label>
    <div class="col-sm-10">

        <select class="form-control" id="partner" name="partner" onchange="">
						<option value="0" selected="selected">--- ALL ---</option>

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

                   
                                       <div style="overflow: auto;" class="form-group">
    <label class="control-label col-sm-2" for="email">Period:</label>
    <div class="col-sm-10">
        <div class="country">
            <label class="control-label col-sm-2" for="email">From:</label>
       
						<select class="form-control" id="fromPeriod" name="fromPeriod" onchange="">
 <option value="Jan-2017" selected="">Jan-2017</option><option value="Feb-2017">Feb-2017</option><option value="Mar-2017">Mar-2017</option><option value="Apr-2017">Apr-2017</option><option value="May-2017">May-2017</option><option value="Jun-2017">Jun-2017</option><option value="Jul-2017">Jul-2017</option><option value="Aug-2017">Aug-2017</option><option value="Sep-2017">Sep-2017</option><option value="Oct-2017">Oct-2017</option><option value="Nov-2017">Nov-2017</option><option value="Dec-2017">Dec-2017</option><option value="Jan-2018">Jan-2018</option><option value="Feb-2018">Feb-2018</option><option value="Mar-2018">Mar-2018</option><option value="Apr-2018">Apr-2018</option><option value="May-2018">May-2018</option><option value="Jun-2018">Jun-2018</option><option value="Jul-2018">Jul-2018</option><option value="Aug-2018">Aug-2018</option><option value="Sep-2018">Sep-2018</option><option value="Oct-2018">Oct-2018</option><option value="Nov-2018">Nov-2018</option><option value="Dec-2018">Dec-2018</option>
						</select>
					</div>  
        
        <div class="country">
              <label class="control-label col-sm-2" for="email">To:</label>
						<select class="form-control" id="toPeriod" name="toPeriod" onchange="">
				 <option value="Jan-2017" selected="">Jan-2017</option><option value="Feb-2017">Feb-2017</option><option value="Mar-2017">Mar-2017</option><option value="Apr-2017">Apr-2017</option><option value="May-2017">May-2017</option><option value="Jun-2017">Jun-2017</option><option value="Jul-2017">Jul-2017</option><option value="Aug-2017">Aug-2017</option><option value="Sep-2017">Sep-2017</option><option value="Oct-2017">Oct-2017</option><option value="Nov-2017">Nov-2017</option><option value="Dec-2017">Dec-2017</option><option value="Jan-2018">Jan-2018</option><option value="Feb-2018">Feb-2018</option><option value="Mar-2018">Mar-2018</option><option value="Apr-2018">Apr-2018</option><option value="May-2018">May-2018</option><option value="Jun-2018">Jun-2018</option><option value="Jul-2018">Jul-2018</option><option value="Aug-2018">Aug-2018</option><option value="Sep-2018">Sep-2018</option><option value="Oct-2018">Oct-2018</option><option value="Nov-2018">Nov-2018</option><option value="Dec-2018" selected>Dec-2018</option>
						</select>
					</div>


        <p>&nbsp;</p>             <div class="form-group"> 
    <div class="col-sm-offset-2 col-sm-10">
    <input type="button" class="btn btn-primary follow" value="Generate Report" onClick="return createitem()"></input>
         <input type="button" id="wordbtn" disabled class="btn btn-primary follow" value="Download Word" onClick="word()"></input>
    </div>


               </div>

    </div>
  </div>





            
	</form>
            </div>

            <div id="Reports"></div>


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
