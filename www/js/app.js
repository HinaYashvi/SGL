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
//document.addEventListener("deviceready", checkStorage, false); 
//document.addEventListener("deviceready", onDeviceReady, false);
//document.addEventListener("backbutton", onBackKeyDown, false);
// --------------------- C H E C K  I N T E R N E T  C O N N E C T I O N --------------------- //
function checkConnection(){  
  var networkState = navigator.connection.type;
  if(networkState=='none'){  
      mainView.router.navigate('/internet/');   
  }
}
// ------------------------------ MOBILE IMEI -------------------------------- //
function logincheck(){
  checkConnection();    
  var login_form = $(".login_form").serialize();  
  var mobile_num = $("#mobile_num").val();
  var pass = $("#pass").val();
  if(mobile_num==''){
    $("#passerror").html("");
    $("#umoberror").html("Mobile number is required.");
    return false;
  }else if(pass==''){
    $("#umoberror").html("");
    $("#passerror").html("Password is required.");
    return false;
  }else{    
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/authenticateUser',
      data:login_form,  
      success:function(authRes){
        var result = $.parseJSON(authRes);
        var parse_authmsg = result.auth_msg;
        alert(parse_authmsg);
        var user_session = result.user_session[0];
        //var imei_status = result.imei_status;
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
            console.log(error);            
            app.dialog.alert(error+" Unable to get IMEI of "+mobile_num);
            return false;
          });
          mainView.router.navigate("/dashboard/");
          window.localStorage.setItem("session_pid",result.user_session[0].user_id);
          window.localStorage.setItem("session_utype",result.user_session[0].user_type);
          window.localStorage.setItem("session_uclass",result.user_session[0].user_class);
          window.localStorage.setItem("session_uname",result.user_session[0].username);
          window.localStorage.setItem("session_stid",result.user_session[0].station_id);
          window.localStorage.setItem("session_email",result.user_session[0].email);
        }/*else if(parse_authmsg=="Inc_pass"){
          app.dialog.alert("Incorrect Password!");
          return false;
        }*/else if(parse_authmsg=="Inc_mobpass"){
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
  //alert(show);
  if(show=='show'){
    //$(".showpass span").html("");
    $(".pass").attr('type','text');    
    $(".showpass").html('<span class="f7-icons text-white fs-18" onclick="showpassword('+"'"+"hide"+"'"+')">eye_slash</span>');
  }else if(show=='hide'){
    //$(".showpass span").html("");
    $(".pass").attr('type','password');
    $(".showpass").html('<span class="f7-icons text-white fs-18" onclick="showpassword('+"'"+"show"+"'"+')">eye</span>');
  }
}

/*function getIMEI(mobile_no){
  var mob_len = mobile_no.length;
  if(mob_len == 10){
    $.ajax({
      type:'POST',
      url:base_url+"APP/Appcontroller/checkMobileNo",
      data:{'mobile_no':mobile_no},
      success:function(result){
        var mob_res = $.parseJSON(result);
        var msg = mob_res.msg;
        var imei_status = mob_res.imei_status;
        if(msg=='exist'){
          window.plugins.sim.getSimInfo(function(res){
            alert("IMEI 1 : "+res.cards[0].deviceId);
            alert("IMEI 2 : "+res.cards[1].deviceId);
            var imei_1 = res.cards[0].deviceId;
            var imei_2 = res.cards[1].deviceId;

            var db_imei_no = mob_res.imei_no;
            var db_imei_no_two = mob_res.imei_no_two;

            if(imei_status=='both_empty'){
              var imei_data={'imei_no':imei_1,'imei_no_two':imei_2}
            }else if(imei_status=='two_empty'){
              var imei_data={'imei_no_two':imei_2}
            }else if(imei_status=='one_empty'){
              var imei_data={'imei_no':imei_1}
            }else if(imei_status=='no_empty'){
              var imei_data={'imei_no':imei_1,'imei_no_two':imei_2}
            }
            $.ajax({
              type:'POST',
              url:base_url+"APP/Appcontroller/updateIMEI",
              data:imei_data+"&db_imei_no="+db_imei_no+"&db_imei_no_two"+db_imei_no_two,
              success:function(imei_result){
                alert(imei_result);
              }
            });
          }, function(error){
            console.log(error);
            alert("error "+error);
            app.dialog.alert(error+" Unable to get IMEI of "+mobile_no);
            return false;
          });
        }else if(msg=='no_exist'){
          app.dialog.alert("Your mobile no is not registered with Sabarmati Gas Limited.");
          return false;
        }
      }
    });
  }else{
    app.dialog.alert("Mobile no should be of 10 digits.Enter a valid mobile no.");
    return false;
  }
}*/
