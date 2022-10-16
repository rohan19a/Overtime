var customer_model  = require('./customer_model');
var common          = require('../../../config/common');
var globals         = require('../../../config/constants');
var template        = require('../../../config/template');
var randomstring    = import("randomstring");
var datetime        = require('node-datetime');
const { t }         = require('localizify');

// /credentials
exports.credentials = (req, res) => {
    common.decryption(req.body,function(request){
        var keys = {
            BUCKET_NAME : globals.BUCKET_NAME,
            BUCKET_KEY : globals.BUCKET_KEY,
            BUCKET_SECRET : globals.BUCKET_SECRET,
            BUCKET_REGION : globals.BUCKET_REGION,
            BUCKET_PATH : globals.upload_url,
            API_KEY_MAP_ANDROID : globals.API_KEY_MAP_ANDROID,
            FACEBOOK_APP_ID : globals.FACEBOOK_APP_ID,
            FB_LOGIN_PROTOCOL_SCHEME : globals.FB_LOGIN_PROTOCOL_SCHEME,
            GOOGLE_ClientID : globals.GOOGLE_ClientID,
            GOOGLE_KEY_APP : globals.GOOGLE_KEY_APP,
            CUSTOMER_BUNDLE_ID : globals.CUSTOMER_BUNDLE_ID,
            DRIVER_BUNDLE_ID : globals.DRIVER_BUNDLE_ID,
            BROWSER_KEY     : globals.google_api_key
        }    
        common.sendresponse(res, '1', "Success", keys);
    });
}
// /send_otp
exports.sendOtp = (req, res) => {
    common.decryption(req.body, function(request) {
        var rules = {
            type    : 'required'
        }
        if (request.type == 'S') {
            rules['country_code']  = "required";
            rules['mobile_number'] = "required";
            rules['email']      = "required";
        }else if(request.type == 'E') {
            rules['user_id']       = "required";
            rules['country_code']  = "required";
            rules['mobile_number'] = "required";
        }else if(request.type == 'F') {
            rules['country_code']  = "required";
            rules['mobile_number'] = "required";
        }

        const messages = {
            'required'  : t('required'),
            'in'        : t('in')
        }

        var keywords = {
            'country_code'  : t('field_country_code'),
            'mobile_number' : t('field_mobile_number'),
            'email'         : t('field_email'),
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            var unique_key = {'country_code': request.country_code, 'mobile_number': request.mobile_number,'type':request.type};
            if (request.type == 'S') {
                unique_key['email'] = request.email;
            }
            if (request.social_id != undefined) {
                unique_key['social_id'] = request.social_id;
            }

            customer_model.check_fields(unique_key, function(result, msg) {
                if (result) {
                    var otp_code = randomstring.generate({length: 4, charset: 'numeric'});
                    // var otp_code = "1234";
                    var mobile_number = request.country_code+request.mobile_number;
                    var message = "Dear Customer, " + otp_code + " is your one time password (OTP). Please enter the OTP to proceed. Thank you, " + globals.APP_NAME;
                    common.sendSMS(mobile_number,message,function(response){
                        if (response) {
                            if (request.type == 'F') {
                                common.sendresponse(res,'1',t('test_sendingotp_success'),{otp:otp_code,user_id:result[0].id});
                            } else {
                                common.sendresponse(res, '1', t('test_sendingotp_success'), {otp:otp_code});
                            }
                        } else {
                            common.sendresponse(res, '0', t('text_rest_somethingwrong_sendingotp'), null);
                        }//end else
                    });//end send sms function
                } else {
                    common.sendresponse(res, '0', msg, null);
                }
            })
        }
    });
}
// /resend_otp
exports.resendOtp = (req, res) => {
    common.decryption(req.body,function(request){
        var rules = {
            country_code:'required',
            mobile_number:'required'
        }
        const messages = {
            'required'  : t('required'),
        }
        var keywords = {
            'country_code'  : t('field_country_code'),
            'mobile_number' : t('field_mobile_number'),
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            var otp = randomstring.generate({length: 4, charset: 'numeric'});
            // var otp = "1234";
            var mobile_number = request.country_code+request.mobile_number;
            var message = "Dear Customer, "+otp+" is your one time password (OTP). Please enter the OTP to proceed. Thank you, "+globals.APP_NAME;
            /*Send OTP*/
            common.sendSMS(mobile_number,message, function(otp_status){
                if(otp_status == true) {
                    common.sendresponse(res, '1', t('test_sendingotp_success'), {otp:otp});
                } else {
                    common.sendresponse(res, '0', t('text_rest_somethingwrong_sendingotp'), null);
                }
            });   
        }
    });
}
// /check_user
exports.checkUser = (req, res) => {
    common.decryption(req.body,function(request){
        var rules = {
        }
        if (request.user_id != undefined) {
            rules['user_id'] = "required";
        } else if(request.mobile_number != undefined) {
            rules['country_code'] = "required";
            rules['mobile_number'] = "required";
        } else if(request.social_id != undefined) {
            rules['social_id'] = "required";
        }
        const messages = {
            'required'  : t('required'),
        }

        var keywords = {
            'social_id'     : t('field_social_id'),
            'user_id'       : t('field_user_id'),
            'country_code'  : t('field_country_code'),
            'mobile_number' : t('field_mobile_number'),
        }
        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            customer_model.check_user_exist(request,function(response,msg,code){
                common.sendresponse(res,code,msg,response); 
            });
        }
    });
}
// /signup
exports.signup = (req, res) => {
    common.decryption(req.body, function(request) {
        var request = request
        var rules = {
            name            : 'required',
            lname           : 'required',
            country_id      : 'required',
            country_code    : 'required',
            mobile_number   : 'required',
            email           : 'required',
            device_type     : 'required|in:A,I',
            device_token    : 'required',
        }

        if (request.social_id != undefined) {
            rules['social_id']  = 'required';
            rules['login_type'] = 'required|in:F,S,G,A';
            if (request.login_type == 'A') {
                rules['country_code']  = '';
                rules['mobile_number'] = '';
            }
        }else{
            rules['password'] = 'required';
        }

        const messages = {
            'required'  : t('required'),
            'in'        : t('in')
        }

        var keywords = {
            'name'         : t('field_name'),
            'lname'         : t('field_lname'),
            'country_code'  : t('field_country_code'),
            'mobile_number' : t('field_mobile_number'),
            'email'         : t('field_email'),
            'login_type'    : t('rest_keywords_login_type'),
            'device_type'   : t('field_device_type'),
            'device_token'  : t('field_device_token'),
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            request.language = req.headers['accept-language'];
            customer_model.check_data(request,function (userdetails) {
                if (userdetails == null) {
                    customer_model.insertData(request, function(response, msg) {
                        if (response == null) {
                            common.sendresponse(res, '0', msg, null);
                        } else {
                            common.generate_session_code(response.id,"Customer",function(session_res) {
                                response.token = session_res;
                                common.sendresponse(res, '1', t('text_signup_success'), response);
                            });
                        }
                    });
                } else {
                    common.sendresponse(res, '0', t('text_customer_email_exists'), null);
                }
            })
        }
    });
}
// /login
exports.login = (req, res) => {
  //request method encryption
  common.decryption(req.body, function(request) {
    var request = request

    var rules = {
        login_type      : "required|in:S,F,G,A",
        device_type     : "required|in:A,I",    
        device_token    : "required",  
    }

    if (request.email != undefined) {
        rules['email']         = "required|email";
        rules['password']         = "required";
    } else {
        rules['social_id']     = "required";
    }

    const messages = {
        'required'  : t('required'),
        'email'     : t('email'),
        'in'        : t('in')
    }
    var keywords = {
        'social_id'     : t('field_social_id'),
        'email'         : t('field_email'),
        'country_code'  : t('field_country_code'),
        'mobile_number' : t('field_mobile_number'),
        'login_type'    : t('field_login_type'),
        'device_type'   : t('field_device_type'),
        'device_token'  : t('field_device_token'),
    }

    if (common.checkValidationRules(request,res,rules,messages,keywords))
    {
        customer_model.login_details(request, function(response, msg, code) {
            if (response == null) {
                common.sendresponse(res,code,msg,null);
            } else {
                common.generate_session_code(response.id,"Customer",function(session_res) {
                    response.token = session_res;
                    common.sendresponse(res,code,msg,response);
                });
            }
        });
    }
});
}
// /forgotpassword
exports.forgotPassword = (req, res) => {
  //request method encryption
  common.decryption(req.body,function(request){
    var request = request

    var rules = {
        user_id    : 'required',
        new_password   : 'required',
    }

    const messages = {
        'required': t('required'),
        'user_id'  : t('field_user_id'),
        'password' : t('field_password'),
    }

    var keywords = {
        'email': t('field_email'),
    }

    if (common.checkValidationRules(request,res,rules,messages,keywords)) {
        customer_model.change_password(request,"Forgot",function (check_password,msg,code) {
            if(check_password == null){
                common.sendresponse(res,'0',t('text_rest_something_went_wrong'),null);
            } else {
                common.sendresponse(res,'1',t('text_customer_changepassword_success'),true);
            }
        });
    }//end else

  });//end decryption
}
// /edit_profile
exports.editProfile = (req, res) => {
    var user_id = req.user_id
    common.decryption(req.body,function(request){
        var request = request
        var rules = {
            name            : 'required',
            lname           : 'required',
            email           : 'required',
            country_id      : 'required',
            country_code    : '',
            mobile_number   : '',
        }

        const messages = {
            'required'  : t('required'),
            'email'  : t('email')
        }

        var keywords = {
            'name'          : t('field_name'),
            'lname'         : t('field_lname'),
            'email'         : t('field_email'),
            'country_code'  : t('field_country_code'),
            'mobile_number' : t('field_mobile_number'),
        }
        
        if (common.checkValidationRules(request,res,rules,messages,keywords))
        {
            var unique_key = {
                email : request.email
            };
            if (request.mobile_number != undefined && request.mobile_number != '') {
                unique_key.mobile_number = request.mobile_number;
            }
            customer_model.edit_check_unique(unique_key,user_id,function(check_unique,message){
                if (check_unique == false) {
                    common.sendresponse(res,'0',message,null);
                } else {
                    var upd_customer = {
                        name : request.name,
                        lname : request.lname,
                        email : request.email,
                        country_id : request.country_id,
                    };
                    if (request.country_code != undefined && request.mobile_number != undefined) {
                        upd_customer.country_code = request.country_code;
                        upd_customer.mobile_number = request.mobile_number;
                    }
                    if (request.profile_image != undefined && request.profile_image != '') {
                        upd_customer.profile_image = request.profile_image;
                    }
                    customer_model.update_customer(upd_customer,user_id,function(response,error){
                        if (response) {
                            response.token = response.user_device_data.token;
                            common.sendresponse(res,'1',t('text_edit_profile_succ'),response);
                        } else {
                            common.sendresponse(res,'0',t('text_rest_something_went_wrong'),null);
                        }
                    });
                }
            });// end check unique function
        }//else
    });//end decryption
}
// /changepassword
exports.changePassword = (req, res) => {
    common.decryption(req.body,function (request) {
        var rules = {
            old_password : "required",
            new_password : "required",
        }

        const messages = {
            'required' : t('required'),
        }

        var keywords = {
            'old_password': t('field_old_password'),
            'new_password': t('field_new_password'),
        }
    
        if (common.checkValidationRules(request,res,rules,messages,keywords))
        {
            request.user_id = req.user_id;
            customer_model.change_password(request,"Reset",function (check_password,msg,code) {
                if(check_password == null){
                    common.sendresponse(res,code,msg,null);
                } else {
                    common.sendresponse(res,code,msg,null);
                }
            });
        }
    });
}
// /contact_us
exports.contactUs = (req, res) => {
    common.decryption(req.body, function(request) {
        var request = request
        var rules = {
            name: 'required',
            email: 'required',
            message: 'required',
        }

        const messages = {
            'required': t('required'),
        }

        var keywords = {
            'subject': t('field_subject'),
            'message': t('field_message'),
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            // customer_model.details(req.user_id,function (userdetails,msg,code) {
                template.contactus(request, function(result) {
                    var subject = "Contact Us Request";
                    common.send_email_app(subject, request.email, result, function(result) {
                        var params = {
                            name: request.name,
                            email: request.email,
                            user_type : "Customer",
                            message: request.message,
                        }
                        common.commonSingleInsert('tbl_contact_us', params, function(response, err) {
                            if (response == null) {
                                common.sendresponse(res, '0', t('text_try_again'), null);
                            } else {
                                common.sendresponse(res, '1', t('text_support_us_email_succ'), response);
                            }
                        });
                    });
                });
            // })
        }
    });
}
// /updatedevice_info
exports.updateDeviceInfo = (req, res) => {
    common.decryption(req.body, function(request) {

        var request = request

        var rules = {
            device_type: 'required|in:A,I',
            device_token: 'required'
        }

        const messages = {
            'required': t('required'),
            'device_type': t('in')
        }

        var keywords = {
            'device_type': t('field_device_type'),
            'device_token': t('field_device_token')
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            customer_model.update_device_info(request, req.user_id, function() {
                common.sendresponse(res, '1', t('rest_keywords_userdevice_infosuccess'), null);
            });
        }
    });
}
// /updatelatlng
exports.updateLatLng = (req, res) => {
    user_id = req.user_id
    common.decryption(req.body,function(request){
        var rules = {
            location: '',
            latitude: '',
            longitude: '',
        }
        const messages = {
            'required': t('required'),
        }
        var keywords = { 
            'location' : 'field_location',
            'latitude' : 'field_latitude',
            'longitude' : 'field_longitude',
        } 

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            request.user_id = user_id
            customer_model.update_location(request,function(response,msg,code){
                if(response == null){
                    common.sendresponse(res,code,msg,null);
                } else {
                    response.token = response.user_device_data.token;
                    common.sendresponse(res,code,msg,response);
                }
            });
        }
    });
}
// /countrylist
exports.countryList = (req, res) => {
    common.decryption(req.body, function(request) {
        var request = request
        var rules = {
            page    : '',
        }
        const messages = {
            'required': t('required'),
        }

        var keywords = {
            'page'  : t('rest_keywords_page'),
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            if (request.page != undefined && request.page != '') {
                if (request.page == '0' || request.page == undefined) {
                    request.page = 1
                }
                request.per_page = globals.per_page
                request.limit = ((request.page - 1) * request.per_page);
            }
            common.getCountryList(request,function(response, error) {
                if (error) {
                    common.sendresponse(res, '0', t('text_countrylist_notfound'), null);
                } else {
                    common.sendresponse(res, '1', t("text_countrylist_successfound"), response);
                }
            })
        }
    });
}
// /update_token
exports.updateToken = (req, res) => {
    common.decryption(req.body, function(request) {
        var request = request

        var rules = {
            device_token: 'required',
        }
        const messages = {
            'required': t('required'),
        }

        var keywords = {
            'device_token': t('field_device_token'),
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            customer_model.update_token(request, req.user_id,function(response, msg, code) {
                common.sendresponse(res, code, msg, response);
            });
        }
    });
}
// /seat_details
exports.seatDetails = (req, res) => {
  //request method decryption
  common.decryption(req.body,function(request){
    var request = request
    var rules = {
        stadium_id      : 'required',
        section         : 'required',
        row_number      : 'required',
        seat_number     : 'required',
    }

    const messages = {
        'required'  : t('required'),
    }

    var keywords = {
        'stadium_id'    : t('field_stadium_id'),
        'row_number'    : t('field_row_number'),
        'seat_number'   : t('field_seat_number')
    }
    
    if (common.checkValidationRules(request, res, rules, messages, keywords)) {
        request.user_id = req.user_id;
        customer_model.getSeatDetails(request,function(seat_details,error){
            if (seat_details != null) {
                common.sendresponse(res, '1', t('seat_details_found'), seat_details);
            } else {
                common.sendresponse(res, '2', t('seat_details_notfound'), null);
            }
        });
    }//end else              
});//end decryption
}
// /update_customer_seat
exports.updateCustomerSeat = (req, res) => {
    common.decryption(req.body, function(request) {
        var request = request
        var rules = {
            stadium_id  : 'required',
            seat_id     : 'required',
        }
        const messages = {
            'required': t('required'),
        }

        var keywords = {
            'seat_id': t('field_seat_id'),
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            var upd_customer = {
                seat_id : request.seat_id,
                stadium_id : request.stadium_id,
            }
            customer_model.update_customer(upd_customer, req.user_id,function(response, msg) {
                if (response != null) {
                    response.token = response.user_device_data.token;
                    common.sendresponse(res,'1',t("customer_seat_save_success"),response);
                } else {
                    common.sendresponse(res,'0',t('text_try_again'),null);
                }
            });
        }
    });
}
// /stadium_list
exports.stadiumList = (req, res) => {
    common.getStadiumList(function(response, error) {
        if (error) {
            common.sendresponse(res, '0', t('text_stadiumlist_notfound'), null);
        } else {
            common.sendresponse(res, '1', t("text_stadiumlist_successfound"), response);
        }
    })
}

exports.logout = (req, res) => {
    common.decryption(req.body, function(request) {
        var user_id = req.user_id;
        customer_model.delete_user_session(user_id,function (response, err) {
            if (response) {
                common.sendresponse(res,'1',t("text_logout"),null);
            } else {
                common.sendresponse(res,'0',t('text_try_again'),err);
            }
        })
    });
}

// /encryption
exports.encryption = (req, res) => {
    common.encryption(req.body, function(response) {
        res.status(200);
        res.json(response);
    });
}
// /decryption
exports.decryption = (req, res) => {
    common.decryption(req.body, function(request) {
        res.status(200);
        res.json(request);
    });
}
// /add_card
exports.addCard = (req, res) => {
    var user_id = req.user_id
    common.decryption(req.body,function(request){ 
        var rules = {
            cardholder_name: 'required',
            card_number: 'required',
            expiry_month: 'required',
            expiry_year: 'required',
            cvv_number: 'required',
        }
        const messages = {
          'required': t('required')
        }
        var keywords = {
            'cardholder_name': 'field_card_holder',
            'card_number': 'field_card_number',
            'expiry_month': 'field_expiry_month',
            'expiry_year': 'field_expiry_year',
            'cvv_number': 'field_cvv',
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            request.user_id = user_id
            customer_model.addCard(request,function(code,msg,response){
                common.sendresponse(res,code,msg,response);
            });
        }
    }); 
}
// /delete_card
exports.deleteCard = (req, res) => {
    var user_id = req.user_id
    common.decryption(req.body,function(request){ 
        var rules = {
            card_id: 'required',
        }
        const messages = {
          'required': t('required')
        }
        var keywords = {
            'card_id': 'field_card_id',
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            request.user_id = user_id
            customer_model.deleteCard(request,function(response,msg,code){
                common.sendresponse(res,code,msg,null);
            });
        }
    }); 
}
// /default_card
exports.defaultCard = (req, res) => {
    var user_id = req.user_id
    common.decryption(req.body,function(request){ 
        var rules = {
            card_id : 'required',
        }
        const messages = {
          'required': t('required')
        }
        var keywords = {
            'card_id': 'field_card_id',
        }

        if (common.checkValidationRules(request, res, rules, messages, keywords)) {
            request.user_id = user_id;
            customer_model.update_default_card(request,function(response,msg){
                if (response == null) {
                    common.sendresponse(res, '0', t('customer_card_default_fails'), null);
                } else {
                    response.token = response.user_device_data.token;
                    common.sendresponse(res, '1', t("customer_card_default_succ"), response);
                }
            });
        }
    }); 
}
// /get_cards
exports.getCards = (req, res) => {
    var user_id = req.user_id
    common.decryption(req.body,function(request){ 
        customer_model.getCardList(user_id,function(response,msg,code){
            common.sendresponse(res,code,msg,response);
        });
    });
}
// /userdetails
exports.userDetails = (req, res) => {
    customer_model.details(req.user_id, function (userprofile) {
        common.sendresponse(res, '1', t('rest_keywords_userdetails_foundsuccess'), userprofile);
    });
}
// /notification_list
exports.notificationList = (req, res) => {
  //request method encryption
  common.decryption(req.body,function(request){
    var request = request
    var rules = {
        page: 'required|integer',
    }
    const messages = {
        'required': t('required'),
        'integer': t('integer'),
    }
    var keywords = {
        'page'      : t('rest_keywords_page'),
    }
    if (common.checkValidationRules(request,res,rules,messages,keywords)) {
        if (request.page == '0' || request.page == undefined) {
            request.page = 1
        }
        request.per_page = globals.per_page
        request.limit = ((request.page - 1) * request.per_page);

        request.user_id = req.user_id;
        request.user_type = 'User';
        common.notificationList(request,function(response,error){
            if (response == null) {
                common.sendresponse(res,'2',t('text_no_notification_data'),null);
            } else {
                common.sendresponse(res,'1',t('test_rest_notificationlistfound_success'),response);
            }
        });
    }//else
  });//end decryption
}
// /remove_notification_by_id
exports.removeNotificationById = (req, res) => {
  /* Decrypt request raw data */
  common.decryption(req.body,function(request){
    /* Set validation rules */
    var rules = {
        notification_id  : 'required',
    }

    /* Set validation messages */
    const messages = {
        'required': t('required')
    }

    var keywords = {
        'notification_id' : t('field_notification_id'),
    }

    if (common.checkValidationRules(request, res, rules, messages, keywords)) {
        request.user_id = req.user_id;
        common.delete_notification_byid(request, function(notification_delete){
            common.sendresponse(res, '1', t('text_notification_removed_byid_success'), null);
        });
    }
});
}
// /remove_notifications
exports.removeNotifications = (req, res) => {
  /* Decrypt request raw data */
  common.decryption(req.body,function(request){
    var user_id = req.user_id;
    common.delete_notification(user_id, function(notification_delete){
        common.sendresponse(res, '1', t('text_notification_removed_success'), null);
    });
});
}
