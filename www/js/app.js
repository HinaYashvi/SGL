// Initialize your app
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState: true, 
  //popupCloseByOutside:true,
  name: 'SGL',// App Name 
  id: 'com.phonegap.sgl', // App id //
  panel: {
    //swipe: 'left', // Enable swipe panel //
    closeByBackdropClick : true,    
  },  
  input: {
    scrollIntoViewOnFocus: true,
    scrollIntoViewCentered: true,
  },
  animateNavBackIcon:true,  
  dynamicNavbar: true,  
  //theme:'material',
  //material: true, //enable Material theme
  //materialRipple: false,
  routes: routes, 
  clicks: { 
    externalLinks: '.external',
  },
  navbar: {     
    hideOnPageScroll: false,
    iosCenterTitle: false,
    closeByBackdropClick: true,
  },
  picker: {
    rotateEffect: true,
    //openIn: 'popover', 
  },
  popover: {
    closeByBackdropClick: true,
  },  
  on:{
    pageInit: function(e, page) {    
      //console.log(e+"-----"+page); 
    }
  },
  // Hide and show indicator during ajax requests
  onAjaxStart: function (xhr) {
    app.showIndicator();
  },
  onAjaxComplete: function (xhr) {
    app.hideIndicator();
  }
});
var base_url = 'http://oteqprojects.co.in/sabarmati/';
var mainView = app.views.create('.view-main');
document.addEventListener("deviceready", checkStorage, false); 
//document.addEventListener("deviceready", onDeviceReady, false);
//document.addEventListener("backbutton", onBackKeyDown, false);


function checkStorage(){
  //logOut();
  //console.log("hi");
  checkConnection();  
  var session_uid = window.localStorage.getItem("session_uid");
  //alert(session_uid);
  if(session_uid!=null){
    mainView.router.navigate("/dashboard/");
  }else{
    mainView.router.navigate("/index/"); 
  }
}
// --------------------- C H E C K  I N T E R N E T  C O N N E C T I O N --------------------- //
function checkConnection(){  
  var networkState = navigator.connection.type;
  if(networkState=='none'){  
      mainView.router.navigate('/internet/');   
  }
}
// ------------------------------ MOBILE IMEI -------------------------------- //
function logincheck(){
  //alert("hi");
  checkConnection();    
  var lform = $(".lform").serialize();  
  console.log(lform+"***");
  var mobile_num = $("#mob_login").val();
  var pass = $("#pass").val();

  //alert(mobile_num+"-----"+pass);
  if(mobile_num==''){
    $("#passerror").html("");
    $("#umoberror").html("Mobile number is required.");
    return false;
  }else if(pass==''){
    $("#umoberror").html("");
    $("#passerror").html("Password is required.");
    return false;
  }else{ 
  //alert("else");
  alert(base_url+'APP/Appcontroller/authenticateUser');
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/authenticateUser',
      data:lform,  
      success:function(authRes){
        var result = $.parseJSON(authRes);
        var parse_authmsg = result.auth_msg;        
        var user_session = result.user_session[0];
        var imei_no = result.imei_no;
        var imei_no_two = result.imei_no_two;
        if(parse_authmsg=="success"){
          var user_id = result.user_session[0].user_id;
          window.plugins.sim.getSimInfo(function(res){
            //alert("IMEI 1 : "+res.cards[0].deviceId);
            //alert("IMEI 2 : "+res.cards[1].deviceId);
            var imei_1 = res.cards[0].deviceId;
            var imei_2 = res.cards[1].deviceId;
            $.ajax({ 
              type:'POST', 
              url:base_url+'APP/Appcontroller/updateIMEI',
              data:{'imei_no':imei_no,'imei_no_two':imei_no_two,'imei_1':imei_1,'imei_2':imei_2,'user_id':user_id},  
              success:function(imei_result){
              }
            });           
          }, function(error){
            //console.log(error);
            //alert("error "+error);
            app.dialog.alert(error+" Unable to get IMEI of "+mobile_num);
            return false;
          });  
          mainView.router.navigate("/dashboard/"); 
          window.localStorage.setItem("session_uid",result.user_session[0].user_id);
          window.localStorage.setItem("session_utype",result.user_session[0].user_type);
          window.localStorage.setItem("session_uclass",result.user_session[0].user_class);
          window.localStorage.setItem("session_uname",result.user_session[0].username);
          window.localStorage.setItem("session_stid",result.user_session[0].station_id);
          window.localStorage.setItem("session_email",result.user_session[0].email);
        }else if(parse_authmsg=="Inc_mobpass"){
          app.dialog.alert("Mobile no or password Incorrect");
          return false;
        }
      }
    });
  }
}
function showeye(){
  $(".showpass span").removeClass("display-none");
  $(".showpass span").addClass("display-block");
}
function showpassword(show){
  if(show=='show'){
    $(".pass").attr('type','text');    
    $(".showpass").html('<span class="f7-icons text-white fs-18" onclick="showpassword('+"'"+"hide"+"'"+')">eye_slash</span>');
  }else if(show=='hide'){
    $(".pass").attr('type','password');
    $(".showpass").html('<span class="f7-icons text-white fs-18" onclick="showpassword('+"'"+"show"+"'"+')">eye</span>');
  }
}
/*$(document).on('page:init', '.page[data-name="dashboard"]', function (e) {
  checkConnection();   
  var session_uid = window.localStorage.getItem("session_uid"); 
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getModules',
    data:{'session_uid':session_uid},
    success:function(){

    }
  });
});  */
$(document).on('page:init', '.page[data-name="vst"]', function (e) {
  checkConnection();
  cordova.plugins.barcodeScanner.scan(function (result) {
    var qr_code = result.text;
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/checkVehicleQR',
      data:{'qr_code':qr_code},
      success:function(data){
        var parseData = $.parseJSON(data);
        var veh_msg = parseData.veh_msg;
        if(veh_msg=='not_exist'){
          //alert("IF");
          mainView.router.navigate("/no_vehdata/"); 
        }else if(veh_msg=='allow'){

        }else if(veh_msg=='deny'){

        }
      }
    });                
    alert("Barcode/QR code data\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
    //$("#barcode_result").html("Format "+result.format+"\n"+"Result: " + result.text);
  }
    ,function (error) {
      alert("Scanning failed: " + error);
      //$("#barcode_result").html("Scanning failed: " + error);
    },
    {
      preferFrontCamera : false, // iOS and Android
      //showFlipCameraButton : true, // iOS and Android
      //showTorchButton : true, // iOS and Android
      //torchOn: true, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt : "Place a barcode inside the scan area", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations : true, // iOS
      disableSuccessBeep: false // iOS and Android
    }
  );
});
$(document).on('page:init', '.page[data-name="add_vst"]', function (e) {
  checkConnection();
});
// -------------------------------- L O G O U T -------------------------------- //
function logOut(){
  checkConnection();
  window.localStorage.removeItem("session_uid"); 
  window.localStorage.removeItem("session_utype"); 
  window.localStorage.removeItem("session_uclass"); 
  window.localStorage.removeItem("session_uname"); 
  window.localStorage.removeItem("session_stid"); 
  window.localStorage.removeItem("session_email"); 
  mainView.router.navigate('/index/');  
}