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
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);
var pictureSource; // picture source
var destinationType;
function onDeviceReady() { 
  //alert("HELLO");  

  pictureSource = navigator.camera.PictureSourceType;
  destinationType = navigator.camera.DestinationType;  
}
function onBackKeyDown() {
  checkConnection(); 
  if(app.views.main.router.history.length==2 || app.views.main.router.url=='/'){
    app.dialog.confirm('Do you want to Exit ?', function () {
      navigator.app.clearHistory(); navigator.app.exitApp();
    });
  }else{ 
    $$(".back").click();
  } 
}
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
  //console.log(lform+"***");
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
  //alert(base_url+'APP/Appcontroller/authenticateUser');
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
          /*window.plugins.sim.getSimInfo(function(res){
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
          });  */
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
function gotonext(txtval){
  var txtlen = txtval.value.length;
  if(txtlen==2){
    $('#np_two').focus();
  }else if(txtlen>2){
    $('#np_two').val('');
    app.dialog.alert("Enter valid vehicle number");
  }
}
function gotonext_two(txtval){
  var txtlen = txtval.value.length;
  if(txtlen==2){
    $('#np_three').focus();
  }else if(txtlen>2){
    $('#np_three').val('');
    app.dialog.alert("Enter valid vehicle number");
  }
}
function gotonext_three(txtval){
  var txtlen = txtval.value.length;
  if(txtlen==2 || txtlen==3){
    $('#np_four').focus();
  }else if(txtlen>3){
    $('#np_four').val('');
    app.dialog.alert("Enter valid vehicle number");
  }
}
function gotonext_four(txtval){
  var txtlen = txtval.value.length;
  if(txtlen>5){
    $("#np_four").val('');
    app.dialog.alert("Enter valid vehicle number");
  }
}
/*$(document).on('page:init', '.page[data-name="dashboard"]', function (e) {
  checkConnection(); 
  //logOut();  
  var session_uid = window.localStorage.getItem("session_uid"); 
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getModules',
    data:{'session_uid':session_uid},
    success:function(){

    }
  });
});  */
$(document).on('page:init', '.page[data-name="index"]', function (e) {
  //console.log(e);
});
$(document).on('page:init', '.page[data-name="vst"]', function (e) {
  checkConnection();
  cordova.plugins.barcodeScanner.scan(function (result) {

    var qr_code = result.text;
    alert(qr_code);
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/checkVehicleQR',
      data:{'qr_code':qr_code},
      success:function(data){
        var parseData = $.parseJSON(data);
        var veh_msg = parseData.veh_msg;
        var checkQR = parseData.checkQR;
        var status = parseData.status;
        console.log(checkQR);
        var vst_html = '';
        if(status=='success'){
          var owner_name = checkQR[0].owner_name;
          var mobile_one = checkQR[0].mobile_one;
          var mobile_two = checkQR[0].mobile_two;
          var email = checkQR[0].email;
          var vehicle_type = checkQR[0].vehicle_type;
          var att_hydrotest_metal_plate_cirty = checkQR[0].att_hydrotest_metal_plate_cirty;
          var att_rcbook = checkQR[0].att_rcbook;
          var att_form24 = checkQR[0].att_form24;
          var att_number_plate = checkQR[0].att_number_plate;

          if(mobile_two!='' || mobile_two!=undefined || mobile_two!=null){
            var mob2 = mobile_two=mobile_two;
          }else{
            var mob2='';
          }
          var vehicle_no = checkQR[0].vehicle_no;
          var hydrotest_due_date = checkQR[0].hydrotest_due_date;
          var split_duedt = hydrotest_due_date.split("-");
          var due_yr = split_duedt[0];
          var due_mm = split_duedt[1];
          var due_dd = split_duedt[2];
          var hydro_due_dt = due_dd+" - "+due_mm+" - "+due_yr;
          vst_html+='<div class="block-title">Name of Owner / Driver</div><div class="block"><p class="text-uppercase">'+owner_name+'</p></div><div class="block-title">Mobile No</div><div class="block"><p class="text-uppercase">'+mobile_one+'</p></div><div class="block-title">Vehicle No</div><div class="block"><p class="text-uppercase">'+vehicle_no+'</p></div><div class="block-title">Hydrotest Due Date</div><div class="block"><p class="text-uppercase">'+hydro_due_dt+'</p></div>';
          if(veh_msg=='allow'){
            vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';

            vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+att_hydrotest_metal_plate_cirty+"'"+','+"'"+att_rcbook+"'"+','+"'"+att_form24+"'"+','+"'"+att_number_plate+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+veh_msg+"'"+')" href="#">View Details</a>';
          $(".vstdata").html(vst_html);
          }else if(veh_msg=='deny'){
            vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/wrong.jpg" width="200" /></div>';
            vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+att_hydrotest_metal_plate_cirty+"'"+','+"'"+att_rcbook+"'"+','+"'"+att_form24+"'"+','+"'"+att_number_plate+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+veh_msg+"'"+')" href="#">View Details</a>';          
            $(".vstdata").html(vst_html);
          }
        }else if(status=='fail'){
          $(".vstdata").html('');
          if(veh_msg=='not_exist'){
            //alert("IF");
            mainView.router.navigate("/no_vehdata/"+qr_code+"/"); 
          }
        }
      }
    });                
    //alert("Barcode/QR code data\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
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

function openpopup(owner,mob1,mob2,email,vtype,metal_plate,rcbook,form24,num_plate,veh_no,hydro_date,veh_msg){
  if(veh_msg=="allow"){
    var filling_img = '<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';
  }else if(veh_msg=="deny"){
    var filling_img = '<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/wrong.jpg" width="200" /></div>';
  }
  var dynamicPopup = app.popup.create({
  content: '<div class="popup over_scroll">'+'<div class="block"><p><a href="#" class="link popup-close text-red fw-600">CLOSE ME</a></p><div class="block-title">Name of Owner / Driver</div><div class="block"><p class="text-uppercase">'+owner+'</p></div><div class="block-title">Mobile No 1</div><div class="block"><p class="text-uppercase">'+mob1+'</p></div><div class="block-title">Mobile No 2</div><div class="block"><p class="text-uppercase">'+mob2+'</p></div><div class="block-title">Email</div><div class="block"><p class="text-uppercase">'+email+'</p></div><div class="block"><p class="text-uppercase">'+email+'</p></div><div class="block-title">Vehicle Type</div><div class="block"><p class="text-uppercase">'+vtype+'</p></div><div class="block-title">Hydrotest Due Date</div><div class="block"><p class="text-uppercase">'+hydro_date+'</p></div>'+filling_img+'</div>',
  });
  dynamicPopup.open();
}
$(document).on('page:init', '.page[data-name="no_vehdata"]', function (page) {
  var qr_code = page.detail.route.params.qr_code;
  $("#hidd_qrtxt").val(qr_code);
});
function addvstPage(){
  var hidd_qrtxt = $("#hidd_qrtxt").val();
  mainView.router.navigate("/add_vst/"+hidd_qrtxt+"/");  
}
$(document).on('page:init', '.page[data-name="add_vst"]', function (page) {
  checkConnection();
  //$("#np_one").focus();    
  var calendarModal = app.calendar.create({
    inputEl: '#demo-calendar-modal',
    openIn: 'customModal',
    dateFormat: 'dd-mm-yyyy',
    header: true,
    footer: true,
    renderToolbar: function () {   
      return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
    }
  });  
  var qrcode_txt = page.detail.route.params.qr_code_txt;
  $("#barcode_code").val(qrcode_txt);
});
function add_vst(){
  checkConnection();
  var form_vst = $("#form_vst").serialize();
  //var v_type = $('input[name="vtype"]').val();
  var v_type = $("#vtype").val();
  //alert(" v_type "+v_type);
  var barcode_code = $('input[name="barcode_code"]').val();
  //console.log(form_vst);
  var old_metalplate='NULL';
  var old_rcbook='NULL';
  var old_from24='NULL';
  var old_numplate='NULL';
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/addVST',
    data:form_vst,
    success:function(lastid){
      upload_metalplate(lastid,old_metalplate,v_type,barcode_code);
      //upload_rcbook(lastid,old_rcbook,v_type,barcode_code);
      //upload_form24(lastid,old_from24,v_type,barcode_code);
      //upload_numplate(lastid,old_numplate,v_type,barcode_code);
    }
  });
}
function upload_metalplate(lastid,old_metalplate,v_type,barcode_code){
  //alert("called");
  var session_uid = window.localStorage.getItem("session_uid");
  //alert("session_uid "+session_uid);
  var img = document.getElementById('image');
  var imageURI = img.src;
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";
  options.chunkedMode = false;
  options.headers = {
     Connection: "close" 
  };
  var params = {};  
  params.fullpath =imageURI;
  params.name = options.fileName;
  var imgfilename = params.name; 
  var split_imgfilename = imgfilename.split("?");
  var ft = new FileTransfer();
  var actual_imgname1 = split_imgfilename[0];
  var img_filename1 = actual_imgname1.split('%20').join('_');
  var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+img_filename1; 
  //alert(uploadControllerURL);
  console.log(uploadControllerURL);
  ft.upload(imageURI,uploadControllerURL, win, fail, options,true);
}
function win(r) { 
  checkConnection();       
  var responseCode = r.responseCode;
  if(responseCode==200){     
    app.dialog.close(); 
  }
}
function fail(error) {
  checkConnection();  
  app.dialog.alert("An error has occurred: Code = " + error.code);
  app.dialog.alert("upload error source " + error.source);
  app.dialog.alert("upload error target " + error.target);
}
// ------------------------------------ BROWSE/CAPTURE IMAGE ------------------------------------------ //
function capturePhoto() {
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  }); 
}
function onPhotoDataSuccess(imageURI){
  //alert("in success "+imageURI);
  checkConnection();  
  var cameraImage = document.getElementById('image');
  //alert(cameraImage);
  //cameraImage.style.display = 'block';
  $("#imageblock").removeClass("display-none");
  $("#imageblock").addClass("display-block");
  cameraImage.src = imageURI;
}
function getPhoto(source) {
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
} 
function onPhotoURISuccess(imageURI_gallery) {
  checkConnection();  
  var galleryImage = document.getElementById('image');
  //alert("galleryImage "+galleryImage);
  //galleryImage.style.display = 'block';
  $("#imageblock").removeClass("display-none");
  $("#imageblock").addClass("display-block");
  galleryImage.src = imageURI_gallery;
}
//********************************* RC BOOK *************************************//
function capturePhoto_rc(){
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess_rc, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  });
}
function onPhotoDataSuccess_rc(imageURI_rc){
  //alert("in success "+imageURI_rc);
  checkConnection();  
  var cameraImage_rc = document.getElementById('image_rc');
  //alert(cameraImage_rc);
  //cameraImage_rc.style.display = 'block';
  $("#imageblock_rc").removeClass("display-none");
  $("#imageblock_rc").addClass("display-block");
  cameraImage_rc.src = imageURI_rc;
}
function getPhoto_rc(source) {
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess_rc, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
} 
function onPhotoURISuccess_rc(imageURI_gallery_rc) {
  checkConnection();  
  var galleryImage_rc = document.getElementById('image_rc');
  //alert("galleryImage "+galleryImage_rc);
  //galleryImage_rc.style.display = 'block';
  $("#imageblock_rc").removeClass("display-none");
  $("#imageblock_rc").addClass("display-block");
  galleryImage_rc.src = imageURI_gallery_rc;
}
// ******************************* FORM - 24 **************************************** //
function capturePhoto_formtf(){
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess_formtf, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  });
}
function onPhotoDataSuccess_formtf(imageURI_formtf){
  //alert("in success "+imageURI_rc);
  checkConnection();  
  var cameraImage_formtf = document.getElementById('image_formtf');
  //alert(cameraImage_rc);
  //cameraImage_rc.style.display = 'block';
  $("#imageblock_formtf").removeClass("display-none");
  $("#imageblock_formtf").addClass("display-block");
  cameraImage_formtf.src = imageURI_formtf;
}
function getPhoto_formtf(source){
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess_formtf, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
}
function onPhotoURISuccess_formtf(imageURI_gallery_formtf) {
  checkConnection();  
  var galleryImage_formtf = document.getElementById('image_formtf');
  //alert("galleryImage "+galleryImage_rc);
  //galleryImage_rc.style.display = 'block';
  $("#imageblock_formtf").removeClass("display-none");
  $("#imageblock_formtf").addClass("display-block");
  galleryImage_formtf.src = imageURI_gallery_formtf;
}
// ************************************* NUMBER PLATE **************************************** // 
function capturePhoto_noplt(){
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess_noplt, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  });
}
function onPhotoDataSuccess_noplt(imageURI_noplt){
  //alert("in success "+imageURI_rc);
  checkConnection();  
  var cameraImage_noplt = document.getElementById('image_noplt');
  //alert(cameraImage_rc);
  //cameraImage_rc.style.display = 'block';
  $("#imageblock_noplt").removeClass("display-none");
  $("#imageblock_noplt").addClass("display-block");
  cameraImage_noplt.src = imageURI_noplt;
}
function getPhoto_noplt(source){
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess_noplt, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
}
function onPhotoURISuccess_noplt(imageURI_gallery_noplt){
  checkConnection();  
  var galleryImage_noplt = document.getElementById('image_noplt');
  //alert("galleryImage "+galleryImage_rc);
  //galleryImage_rc.style.display = 'block';
  $("#imageblock_noplt").removeClass("display-none");
  $("#imageblock_noplt").addClass("display-block");
  galleryImage_noplt.src = imageURI_gallery_noplt;
}
function onFail(message) {
  checkConnection();  
  app.dialog.alert('Failed because: ' + message);
}
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