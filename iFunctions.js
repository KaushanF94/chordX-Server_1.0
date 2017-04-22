//Author-Kaushan Fernando-2014288
var db=require('./connection'); //reference of dbconnection.js
var FCM = require('fcm-push');
	var mailer = require("nodemailer");
var connect;
db.getConnection(function(err,connection){
	console.log(err)
	        if (err) {
	          	connect = 'true';
	        }else{
	        	connect = 'g';
	        }
    	});
var serverKey = 'AIzaSyDdSCwfD85uuuBNc3yIGsMCxrJI3G72sgQ';
var fcm = new FCM(serverKey);

var ifunctions={

getAllDrivers:function(callback){
 	return db.query("SELECT vehicle.driver_id, vehicle.last_lat, vehicle.last_lng FROM tbl_vehicle vehicle left OUTER join tbl_shedule shed on shed.driver_id=vehicle.driver_id left outer join tbl_ride ride on ride.driver_id=shed.driver_id  WHERE vehicle.status=1",callback);
},

deleteSong:function(id,callback){
 return db.query("delete from `tbl_songs` where `user_id`=?",[id],callback);
},
checkTokenbyUser:function(user_id, callback){
 return db.query("SELECT * FROM `tbl_tokens` WHERE (`user_id`=?) AND isAvailable=1",[user_id], callback);
},
checkTokenbyToken:function(token, callback){
 return db.query("SELECT * FROM `tbl_tokens` WHERE (`tokens`=?) AND isAvailable=1",[token], callback);
},
createToken:function(user_id, token, callback){
 return db.query("INSERT INTO `tbl_tokens` (`user_id`,`tokens`) VALUES (?,?)",[user_id, token], callback);
},
expireToken:function(token,callback){
 return db.query("update `tbl_tokens` set isAvailable=0,updatedDate=NOW() WHERE tokens=? AND isAvailable=1",[token],callback);
},
registerDevice:function(user_id, device, api_key, callback){
 return db.query("INSERT INTO `tbl_devices` (`user_id`, `device_unique`, `api_key`, `isAndroid`, `isIOS`, `push_ref`) VALUES (?,?,?,?,?,?)",[user_id, device.device_unique, api_key, device.isAndroid, device.isIOS, device.push_ref], callback);
},
checkDeviceAlreadyRegistered:function(device_id, callback){
 return db.query("SELECT * FROM `tbl_devices` WHERE device_unique=?",[device_id], callback);
},
getUserbyAPIKEY:function(key, callback){
	return db.query("SELECT d.idDevices, d.user_id, u.`fName`, v.vehicle_id, u.`lName`, u.phone, v.plate_no, v.model, u.pro_pic FROM tbl_devices d inner join tbl_users u on u.user_id=d.user_id left outer join tbl_vehicle v on v.driver_id=u.user_id WHERE d.api_key=?", key, callback);
	//return db.query("SELECT d.idDevices, d.user_id, u.`fName`, u.`lName`, u.phone FROM tbl_devices d inner join tbl_users u on u.user_id=d.user_id WHERE d.api_key=?", key, callback);
},
getDriverDeviceFromID:function(driver_id, callback){
	return db.query("SELECT `push_ref` FROM `tbl_devices` WHERE `user_id`=? ORDER BY `updated_date` DESC LIMIT 1", driver_id, callback);
},
uploadProPic:function(user_id, image, callback){
	return db.query("UPDATE `expo_db`.`tbl_users` SET `pro_pic`=? WHERE `user_id`=?", [image, user_id], callback);
}

}

send:function(fcm_id, title_message, body_message, type, data_b, callback){
	var message = {
	    to: fcm_id, 
	    collapse_key: 'likuid_data', 
	    data: data_b,
	    notification: {
	        title: title_message,
	        body: body_message
	    }
	};
	
	fcm.send(message, function(err, response){
	    if (err) {
	    	console.log(err);
	        console.log("Something has gone wrong!");
	        callback(0);
	    } else {
	        console.log("Successfully sent with response: ", response);
	        callback(1);
	    }
	});

},
emailer:function(subject_body, text_body, callback){
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////var html = "";
		// Use Smtp Protocol to send Email
		var transporter = mailer.createTransport({
	        service: 'Gmail',
	        auth: {
	            user: 'chordx@gmail.com', // Your email id
	            pass: 'chordx@2017' // Your password
	        }
	    });

	  var mail = {
	      from: "Chordx  <chordx@gmail.com>",
	      to: "chordx@gmail.com",
	      subject: subject_body,
	      text: text_body
	  }

	  transporter.sendMail(mail, function(error, response){
	      if(error){
	      		callback(0);
	          //console.log(error);
	      }else{
	      		callback(1);
	          //console.log("Message sent: " + response.message);
	      }
	      transporter.close();
	  });
}
};
 module.exports=ifunctions;