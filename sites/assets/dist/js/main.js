$(window).on('load', function () {
	showLoader('hide');
});

$(document).ready(function () {
	window.addEventListener("flutterInAppWebViewPlatformReady", function (event) {
		window.platformReady = true;
	});
});

function getSessionStorage() {
	var session = getUrlVars();
	if(session.hasOwnProperty('device')){
		session['URL'] =  "http://localhost:9104/filing/dynamicForm/userMembership";
	}else{
		session['URL'] =  "https://" + session.env_code.replace("#", "") + ".servicedx.com/filing/dynamicForm/userMembership";
	}
	//alert(JSON.stringify(session));
	return session;
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		var convert = convertType(decodeURI(value));
		vars[key] = convert;
	});
	if(vars.hasOwnProperty('clientId')){
		vars["clientId"] = vars.clientId;
	}
	if(vars.hasOwnProperty('env_code')){
		vars["env_code"] = vars.env_code.toLowerCase();
		if(vars.env_code.toLowerCase() == "pd"){
			vars["env_code"] = 'prod';
		}
	}
	if(vars.hasOwnProperty('loggedInRole') && vars.loggedInRole != null){
		vars["loggedInRole"] = vars.loggedInRole.toLowerCase();
	}
	return vars;
}

function isValidJSON(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		console.log("JSON Parsing error [" + str + "]\n" + e);
		return false;
	}
	return true;
}

var convertType = function (value) {
	var values = {
			undefined: undefined,
			null: null,
			true: true,
			false: false
		},
		isNumber = !isNaN(+(value));
	return isNumber && +(value) || !(value in values) && value || values[value];
};

function now() {
	return new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0];
}

function enable(id) {
	document.addEventListener("DOMContentLoaded", function (event) {
		document.getElementById(id).disabled = false;
		$('#' + id).removeClass('disable');
	});
}

function disable(id) {
	var comp = document.querySelectorAll("[id^=" + id + "]");
	for (var i = 0; i < comp.length; i++) {
		comp[i].disabled = true;
	}
	document.getElementById(id).disabled = true;
	$('#' + id).addClass('disable');
}

function showComponent(value, status) {
	if (status) {
		$('input[type="radio"][value="' + value + '"]').prop('disabled', false);
	} else {
		$('input[type="radio"][value="' + value + '"]').prop('disabled', true);
	}
}

function showLoader(loader) {
	if (loader == 'show') {
		$(".loader").show();
		$("#builder").addClass('hide');
	} else {
		$(".loader").hide();
		$("#builder").removeClass('hide');
	}
}

function URLBuilder(hasUser, hasMember) {
	var docvars = getSessionStorage();
	let url = new URL(docvars.URL);
	let params = '';
	params = url.searchParams;
	params.append("departmentName", docvars.departmentName);
	params.append("hasUser", hasUser);
	params.append("hasMember", hasMember);
	if(docvars.userName && docvars.userName != "null"){
		params.append("userName", docvars.userName);
	}
	if(docvars.loggedInRole && docvars.loggedInRole != "null"){
		params.append("role", docvars.loggedInRole.toLowerCase());
	}
	if (docvars.membershipId && docvars.membershipId != "null") {
		params.append("membershipId", docvars.membershipId);
	}
	console.log(url.toString());
	return url.toString();
}

function fetchRequest(form, URL, userObject, handlerName) {
	showLoader('show');
	fetchAPI(URL, JSON.stringify(userObject), handlerName).then(response => {
		showLoader('hide');
		if (!response.hasOwnProperty('errorCode')) {
			if(form){
				form.emit('submitDone', 'Success');
			}
		} else {
			if(form){
				form.emit('submitError', response.message);
			}
		}
	}).catch(function (error) {
		console.log("error fetch", error);
	});
}

var fetchAPI = async function (url, formdata, handlerName) {
	var docvars = getSessionStorage();
	var platformReady = true;
	var options = {
		method: 'POST',
		body: formdata,
		redirect: 'follow',
		headers: new Headers({
			'content-type': 'application/json',
			'clientid': docvars.clientId
		})
	};
	let response = await fetch(url, options)
	console.log('response', JSON.stringify(response));
	alert(JSON.stringify(response));
	if (response.ok) {
		let json = await response.json();
		console.log('response body', json, "flutterPlatformReady ", platformReady);
		try {
			if (platformReady && handlerName) {
				window.flutter_inappwebview.callHandler(handlerName, response.status, json, false);
			}
		} catch (e) {
			console.log("flutter_inappwebview error");
		}
		return json;
	} else {
		let json = await response.json();
		console.log('error', json.message, json.errorCode);
		if(!platformReady){
			WarningAlert(json.errorCode, json.message);
		}
		try {
			if (platformReady  && handlerName) {
				window.flutter_inappwebview.callHandler(handlerName, response.status, json, false);
			}
		} catch (e) {
			console.log("flutter_inappwebview error");
		}
		return json;
	}
}

function getFormInfo() {
	var session = getSessionStorage();
	var param = {};
	if(session.departmentName && session.departmentName != "null"){
		param["departmentName"] = session.departmentName;
	}
	if(session.rootdepartmentName && session.rootdepartmentName != "null"){
		param["rootdepartmentName"] = session.rootdepartmentName;
	}
	if(session.loggedInRole && session.loggedInRole != "null"){
		param["role"] = session.loggedInRole.toLowerCase();
	}
	if (session.userName && session.userName != "null") {
		param["userName"] = session.userName;
	}
	if (session.membershipId && session.membershipId != "null"){
		param["membershipId"] = session.membershipId;
	}
	var formObj = {};
	$.ajax({
		url: session.URL,
		type: "GET",
		data: param,
		async: false,
		success: function (result) {
			result["formDefinition"] = JSON.parse(result.formDefinition);
			if (session.page.toLowerCase() == "adduser" || session.page.toLowerCase() == "signup" ){
				var formData = JSON.parse(result.formData);
				result["formData"] = {"hasUser":false, "hasMember":false, "membershipSchemeType" : formData.membershipSchemeType};
			}else {
				result["formData"] = JSON.parse(result.formData);
			}
			var schemeInfo = membershipCard(result.formData, result.schemeDefinition);
			if(schemeInfo){
				result.formData["scheme"] = schemeInfo;
				result["formData"] = schemeCard(schemeInfo.schemeId, result.schemeDefinition, result.formData);
			}
			formObj = result;
		},
		beforeSend: function (request) {
			request.setRequestHeader("clientid", session.clientId);
			showLoader('show');
		},
		complete: function () {
			showLoader('hide');
		},
		error: function (textStatus) {
			console.log(textStatus);
			WarningAlert(textStatus.responseJSON.errorCode, textStatus.responseJSON.message);
			formObj = textStatus.responseJSON;
		}
	});
	return formObj;
}

function membershipCard(formData, scheme) {
	var session = getSessionStorage();
	var selectedScheme = null;
	var basicScheme = null;
	scheme = schemeByRole(scheme, formData);
	let card = "<div id='scheme-card' class='container-fluid'>";
	card += "<div class='u-pos--rel' id='banner'>";
	card += "<div class='u-p--16 text-white text-bold c-banner-container__content'>";
	//card += "<img alt='Plus Logo' class='u-columns u-two u-m-b--10 ' effect='blur' src='../assets/brand/plus-logo.png''>";
	card += "<div class='u-text--bold text-large'>Unlimited benefits with "+ session.departmentName +" Member+";
	card += "</div>";
	card += "</div>";
	card += "</div>";
	card += "<div id='scheme' class=''>";
	card += "<div class=''>";
	card += "<div class='u-p-v--10 container scroll' style=''>";
	card += "<div class='wrapper'>";
	card += "<ul class='list' id='myTab'>";
	scheme.forEach(function (data) {
		if (data.schemeName == "Basic") {
			basicScheme = data;
		}
		if(data.schemeId == formData.schemeId){
			selectedScheme = data;
		}else if(formData.hasMember && formData.fees && data.schemeActivePrice == parseInt(formData.fees)){
			selectedScheme = data;
		}
		
        card += "<li class='item'>";
		card += "<div class='col-auto mb-3'>";
		card += "<div class='card card-pricing text-center px-3 mb-4 u-m-h--8' style='width: 8rem;' aria-haspopup='true' id=" + data.schemeId + ">";
		if(data.schemeBenefitsHighlights){
			card += "<div class='card-ribbon'>";
			card += "<span>"+data.schemeBenefitsHighlights+"</span>";
			card += "</div>";
		}
		
		card += "<span class='mx-auto px-4 py-1 rounded-bottom bg-primary-card text-white shadow-sm text-zeta u-text--bold'>" + data.schemeName + "</span>";
		if(data.schemeName != "Basic"){
			card += "<div class='scheme-badge-spinner'></div>";
		}
		card += "<div class='u-text--uppercase u-p-t--20 u-p-b--15 u-border-bottom--paleGrey u-text--bold text-mt u-pos--rel'>" + getTitle(data) + "<br>";
		if(data.schemeName != "Basic"){
			card += "<div class='u-text--uppercase text-mt u-pos--rel u-text--bold' style='font-size: 12px;'>Membership</div>";
		}else{
			card += "<div class='u-text--uppercase text-mt u-pos--rel u-text--bold' style='font-size: 12px;'><br></div>";
		}
		card += "</div>";
		card += "<div class='plan-details u-d-flex u-d-flex--center u-border-bottom--paleGrey'>";
		card += "<div class='u-p-b--20 u-p-t--8'>";
		card += "<div class='text-gre u-text--striked text-epsilon u-m-r--4 il-f'>";
		card += "<div class='text-currency-symbol'>" + data.schemeCurrencySymbol + "</div>";
		card += "<div class=''>" + data.schemeActualPrice + "</div>";
		card += "</div>";
		card += "<div class='card_container'>";
		card += "<sup class='text-currency-symbol'>" + data.schemeCurrencySymbol + "</sup><span class='text-delta text-currency text-center u-text--bold u-align--vm cardBlock'>" + data.schemeActivePrice + "</span>";
		//card += "<span class='text-theta text-gre u-align--vtt cardBlock'>/ " + data.schemeDuration + "</span>";
		card += "</div>";
		card += "<div class='text-green u-m-t--4 text-zeta u-text--bold'>" + data.schemeOfferEnforced + "";
		card += "</div>";
		card += "</div>";
		card += "</div>";
		card += "<div class='card-footer-member'>";
			getContent(data.schemeContent).forEach(function (content) {
			content = content.trimStart();
			if(!content.startsWith("#")){
				card += "<div class='u-p-v--12 text-gre text-zeta-lf'><img class='text-info' src='../assets/brand/mark.svg'> "+content+"</div>";
			}else{
				card += "<div class='u-p-v--12 text-gre text-zeta-lf ct-st'><img class='text-info' src='../assets/brand/x-mark.svg'> "+content.replace("#","")+"</div>";
			}	
			});
		card += "<a href='#' class='btn read' style='display: none;'><i id='card-icon' class='fa fa-angle-right'></i></a>";
		card += "</div>";
		card += "</div>";
		card += "</div>";
		card += "</li>";
	});
	card += "</ul>";
	card += "<a class='btn read scroller scroller-left vertical-center'><i class='fa fa-angle-left'></i></a>";
    card += "<a class='btn read scroller scroller-right vertical-center'><i class='fa fa-angle-right'></i></a>";
	card += "</div>";
	card += "</div>";
	card += "</div>";
	card += "</div>";
	card += "</div>";
	
	let renewalDetails = '';
	if(formData.membershipSchemeType == "RENEWAL"){
	   var exipry = formData.expiryDays;
	    var expiryClass = '';
	    var expiryPrefixText = '';
		var expirySuffixText = '';
		if (exipry > 0){
		   expiryClass = 'alt-inf';
	       expiryPrefixText = 'Expiry Days : ';
		   expirySuffixText = ' Days left';
		} else if (exipry == 0){
		   expiryClass = 'alt-wrn';
	       expiryPrefixText = 'Expiry Days : ';
		   expirySuffixText = '';
		} else{
		   expiryClass = 'alt-dg';
	       expiryPrefixText = 'Expired Before : ';
		   expirySuffixText = ' Days';
		}
		renewalDetails += "<div class='ep-status "+expiryClass+" m-2'>";
		renewalDetails += "<p class='float-left'>Membership : <p>&ensp;"+  formData.membershipSchemeType +"</p></p>";
		renewalDetails += "<p class='float-left'>Expiry Date : <p>&ensp;"+ new Date(formData.expiryDate).toISOString().split("T")[0]; +"</p></p>";
		renewalDetails += "<p class='float-left'>" + expiryPrefixText +"<p>&ensp;"+ Math.abs(formData.expiryDays) + expirySuffixText + "</p></p>";
		renewalDetails += "</div>";
	}
	$("#renewal-details").show().empty().append(renewalDetails);
	
	// Append the new article card to the article section div
	if(session.page != "signup"){
		if(formData.membershipSchemeType == "ONBOARD"){
			console.log('if scheme');
			if(formData.receiptNo){
				$("#description").hide();
				return selectedScheme;
			}else{
				return createMembershipCard(card, basicScheme, selectedScheme);
			}
		}else if(formData.membershipSchemeType == "RENEWAL"){
			console.log('else if scheme', formData);
			if(formData.expiryDate && formData.expiryPeriod && formData.expiryDays <= formData.expiryPeriod){
				return createMembershipCard(card, basicScheme, selectedScheme);
			}else{
				console.log('selectedScheme', selectedScheme);
				$("#description").hide();
				return selectedScheme;
			}
		}else{
			console.log('else scheme', formData);
		}
	}
	return null;
}

function schemeDescription(scheme){
	let card = '';
	if(scheme && scheme.schemeDescription){
		card = "<div style='margin: 5px 5px 5px;'>";
		card += "<p class=''><p>"+  scheme.schemeDescription +"</p></p>";
		card += "</div>";
		$("#description").show().empty().append(card);
	}else{
		$("#description").hide();
	}
}

function createMembershipCard(card, basicScheme, selectedScheme){
	$("#membership-card").append(card);
	cardActivation();
	//scrollx();
	
	if(selectedScheme && selectedScheme.schemeId){
		var id = $('#'+selectedScheme.schemeId);
		id.addClass('price-filter-active');
		id[0].scrollIntoView({ block: "start", behavior: 'smooth'});
		return selectedScheme;
	}else if (basicScheme) {
		$('#'+basicScheme.schemeId).addClass('price-filter-active');
		return basicScheme;
	}
}

function schemeCard(id, scheme, formData){
	//var planChange = InfoAlert('Do you Want to Upgrade the Plan', '');
	//$('.price-filter-active').addClass('no-hover');
	var schema = getScheme(id, scheme);
	var userObj = formData;
	console.log('schemeCard bf', userObj);
	userObj["scheme"] = schema;
	schemeDescription(userObj.scheme);
	console.log(userObj.fees, schema);
	var fees = 0;
	if(!userObj.fees){
		fees = schema.schemeActivePrice;
	}else{
		fees = parseInt(userObj.fees);
	}
	userObj["fees"] = fees;
	if(schema.schemeType == "ONBOARD"){
		userObj["newMemberFees"] = membershipFees(schema);
		userObj["fees"] = schema.schemeActivePrice;
	}else if (schema.schemeType == "RENEWAL"){ // TODO
		userObj["renewalFees"] = membershipFees(schema);
		userObj["renewalPayableFees"] = schema.schemeActivePrice;
	}
	userObj["schemeId"] = schema.schemeId;
	
	if(schema && schema.schemeActivePrice != 0){
		userObj["isOnboardPlan"] = true;
	}else{
		userObj["isOnboardPlan"] = false;
	}
	console.log('schemeCard',userObj);
	return userObj;
}

function getScheme(id, scheme) {
	return scheme.filter(function(data){return (data['schemeId'] == id);})[0];
}

function getSymbol(name){
    let symbol = {
      'USD': '$', // US Dollar
      'EUR': '€', // Euro
      'CRC': '₡', // Costa Rican Colón
      'GBP': '£', // British Pound Sterling
      'ILS': '₪', // Israeli New Sheqel
      'INR': '₹', // Indian Rupee
      'JPY': '¥', // Japanese Yen
      'KRW': '₩', // South Korean Won
      'NGN': '₦', // Nigerian Naira
      'PHP': '₱', // Philippine Peso
      'PLN': 'zł', // Polish Zloty
      'PYG': '₲', // Paraguayan Guarani
      'THB': '฿', // Thai Baht
      'UAH': '₴', // Ukrainian Hryvnia
      'VND': '₫', // Vietnamese Dong
    }
    if(symbol[name] !== undefined) {
        return symbol[name];
    }
}

function getContent(data){
	var array = data.split(',');
	return array;
}

function getTitle(data){
	var duration = data.schemeDuration;
	if(data.schemeBilingType == "MONTHLY"){
		if(duration){
			return duration +" "+"MONTHS";
		}else{
			return "MONTHLY";
		}
			
	}else if(data.schemeBilingType == "YEARLY"){
		if(duration){
			return duration +" "+"YEAR";
		}else{
			return "YEARLY";
		}
	}
	return data.schemeBilingType;
}

function cardActivation() {
	$('.card-pricing').click(function () {
	
		$('.price-filter-active').not(this).removeClass('price-filter-active').removeClass('fa-angle-right');
		$(this).addClass('price-filter-active');
		$(this).find('#card-icon').addClass('fa-check');
		
		var id = $(this).attr('id');
		console.log(id);
	})
	var view = $("#scheme");
	var sliderLimit = 120;
	console.log(view);
	$("#right-button").click(function () {
		view.animate({
			scrollLeft: "+=" + sliderLimit
		}, {
			duration: 400
		});
	});

	$("#left-button").click(function () {
		view.animate({
			scrollLeft: "-=" + sliderLimit
		}, {
			duration: 400
		});
	});
	
	

}

function scrollx(){
	var hidWidth;
	var scrollBarWidths = 40;

	var widthOfList = function(){
	  var itemsWidth = 0;
	  $('.list li').each(function(){
		var itemWidth = $(this).outerWidth();
		itemsWidth+=itemWidth;
	  });
	  return itemsWidth;
	};
	
	var widthOfHidden = function(){
	  return (($('.wrapper').outerWidth())-widthOfList()-getLeftPosi())-scrollBarWidths;
	};

	var getLeftPosi = function(){
	  return $('.list').position().left;
	};

	var reAdjust = function(){
	  if (($('.wrapper').outerWidth()) < widthOfList()) {
		$('.scroller-right').show();
		$('.scroller-right').hide();
	  }
	  
	  if (getLeftPosi()<0) {
		$('.scroller-left').show();
	  }
	  else {
		$('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
	$('.scroller-left').hide();
	  }
	}

	$('.scroller-right').click(function() {
	  
	  $('.scroller-left').fadeIn('slow');
	  $('.scroller-right').fadeOut('slow');
	  
	  $('.list').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){

	  });
	});

	$('.scroller-left').click(function() {
	  
		$('.scroller-right').fadeIn('slow');
		$('.scroller-left').fadeOut('slow');
	  
		$('.list').animate({left:"-="+getLeftPosi()+"px"},'slow',function(){
		
		});
	});
}

(function () {

	var scrollHandle = 0,
		scrollStep = 5,
		parent = $(window);

	//Start the scrolling process
	$(".panner").on("mouseenter", function () {
		var data = $(this).data('scrollModifier'),
			direction = parseInt(data, 10);

		$(this).addClass('active');

		startScrolling(direction, scrollStep);
	});

	//Kill the scrolling
	$(".panner").on("mouseleave", function () {
		stopScrolling();
		$(this).removeClass('active');
	});

	//Actual handling of the scrolling
	function startScrolling(modifier, step) {
		if (scrollHandle === 0) {
			scrollHandle = setInterval(function () {
				var newOffset = parent.scrollLeft() + (scrollStep * modifier);

				parent.scrollLeft(newOffset);
			}, 10);
		}
	}

	function stopScrolling() {
		clearInterval(scrollHandle);
		scrollHandle = 0;
	}

}());

var payee = async function payButton(data) {
	console.log('payButton', data);
	var session = getSessionStorage();
	var formData = data;
	var description;
	var Renewal = false;
	var platformReady = getDevice();
	var totalFees = 0;
	if (data.renewalEligible) {
		description = "Membership Renewal Fee for " + data.firstName +' '+ data.lastName;
		Renewal = true;
		if(data.renewalPreviousMonths){
			totalFees = calculatePayableMonths(data);
		}else{
			totalFees = data.renewalPayableFees;
		}
	} else {
		description = "Membership Fee for " + data.firstName +' '+ data.lastName;
		totalFees =  parseInt(data.fees) + parseInt(data.scheme.schemeBaseAmount);
	}
	var json = {
		"totalAmount": totalFees,
		"payeePhoneNumber": data.mobileNo,
		"payeeName": data.firstName +' '+ data.lastName,
		"payeeEmail": data.emailId,
		"paymentDescription": description
	};
	console.log(json, data.isMember);
	console.log('flutterPlatformReady', window.platformReady);
	//alert('window flutterPlatformReady', platformReady);
	let transaction = null;
	if (platformReady) {
		await window.flutter_inappwebview.callHandler('userMembershipHandlerWithArgs', null, json, true).then(await
			function (handlerResponse) {
				console.log("handlerPayResponseWithArgs" + JSON.stringify(handlerResponse));
				var isCancelled = handlerResponse["isCancelled"];
				if (Array.isArray(handlerResponse.response)) {
					handlerResponse["response"] = handlerResponse.response[0];
				}
				var receiptNo = null;
				var paymentMode = null;
				var transactionStatus = null;
				if (handlerResponse.response) {
					receiptNo = handlerResponse.response.transactionId;
					paymentMode = handlerResponse.response.paymentMode;
					transactionStatus = handlerResponse.response.transactionStatus;
				}
				if (!handlerResponse.response && !isCancelled && getUrlVars().loggedInRole == 'user') {
					paymentMode = 'CASH';
					transactionStatus = 'success';
				}

				if (handlerResponse.receiptNumber) {
					receiptNo = handlerResponse.receiptNumber;
				}
				transaction = {"receiptNo": receiptNo, "paymentMode": paymentMode, "paymentStatus": transactionStatus};
				data["receiptNo"] = transaction.receiptNo;
				data["paymentMode"] = transaction.paymentMode;
				data["paymentStatus"] = transaction.paymentStatus;
				if(data.paymentStatus === 'success'){
					if(Renewal){
						data["isRenewedMembership"] = true;
						data["fees"] = data.renewalPayableFees;
						data["currentPaidPlan"] = data.renewalFees;
					}else {
						data["membershipApprovalStatus"] = 'Pending Approval';
						data["memberStatus"] = 'Pending Approval';
						data["currentPaidPlan"] = data.newMemberFees;
					}
					data["approvedDate"] = now();
					update(data);
				}
				console.log(data);
			});
		return data;
	} else {
		transaction = {"receiptNo": "order_" +randomUUID(15), "paymentMode": "CASH", "paymentStatus": "success"};
		data["receiptNo"] = transaction.receiptNo;
		data["paymentMode"] = transaction.paymentMode;
		data["paymentStatus"] = transaction.paymentStatus;
		if(data.paymentStatus === 'success'){
			if(Renewal){
				data["isRenewedMembership"] = true;
				data["fees"] = data.renewalPayableFees;
			}else {
				data["membershipApprovalStatus"] = 'Pending Approval';
				data["memberStatus"] = 'Pending Approval';
			}
			update(data);
		}
		console.log(data);
		return data;
	}
}

function membershipFees(data){
	console.log(data);
	var fees = "";
	if(data.schemeBilingType == "MONTHLY"){
		fees = "1 Month - " + data.schemeCurrencySymbol + " "+ data.schemeActivePrice;
	}else if(data.schemeBilingType == "QUARTERLY"){
		fees = "3 Months - " + data.schemeCurrencySymbol + " "+ data.schemeActivePrice;
	}else if(data.schemeBilingType == "HALFYEARLY"){
		fees = "6 Months - " + data.schemeCurrencySymbol + " "+ data.schemeActivePrice;
	}else if(data.schemeBilingType == "YEARLY"){
		fees = "1 year - " + data.schemeCurrencySymbol + " "+ data.schemeActivePrice;
	}
	return fees;
}

function calculatePayableMonths(formData) {
	var payableFees = parseInt(formData.fees) * Math.abs(formData.expiredMonths) + parseInt(formData.renewalPayableFees);
	console.log('calculatePayableMonths ', parseInt(formData.fees),' : ', Math.abs(formData.expiredMonths),' : ', parseInt(formData.renewalPayableFees));
	return payableFees;
}


var update = async function (submission){
	var data = toObject(submission);
	console.log(data);
	var formURL = URLBuilder(data.hasUser, data.hasMember);
	var handlerName =  'userMembershipHandlerWithArgs';
	var responce = await fetchRequest(null, formURL, data, handlerName);
	return responce;
}

function submit(form, submission){
	$('#formSubmit').attr('disabled','disabled');
	var data = toObject(submission);				
	var handlerName =  'userMembershipHandlerWithArgs';				
	var formURL = URLBuilder(data.hasUser, data.hasMember);				
	var responce = fetchRequest(form, formURL, data, handlerName);
}
function setObject(info){
	var userObj = {};
	if(info.formData != null){
		userObj = editObject(info.formData);
	}
	userObj["page"] = getSessionStorage().page;
	if(getSessionStorage().mode){
		userObj["mode"] = getSessionStorage().mode;
	}
	return userObj;
}
function toObject(userObject){

		//delete userObject["submit"];
		//delete userObject["confirmPassword"];
		//delete userObject["hobbies"];
		//delete userObject["sameAsPresentAddress"];
		//delete userObject["phoneNo"];
		//delete userObject["secondPhoneNo"];
		//delete userObject["countrys"];
		//delete userObject["secondaryCountrys"];
		//delete userObject["page"];
		//delete userObject["anniversaryDate1"];
		//delete userObject["birthDate1"];
		//delete userObject["specialSkills"];
		//delete userObject["maritalStatus1"];
		//delete userObject["others"];
		
		console.log("Request : " + JSON.stringify(userObject))
		return userObject;
}

function getParentForm(info) {
	var def = info.formDefinition;
	return def;
}

function randomUUID(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

function SuccessAlert(title, msg){
	swal({title: title, text: msg, icon: 'success'});
}

function WarningAlert(title, msg){
	swal({title: title, text: msg, icon: 'error'});
}

function InfoAlert(title, confirmMsg){
	swal({title: title, buttons: {  confirm: 'Yes', cancel: 'No'}, confirmButtonText: `yes`, icon: 'info'}).then((result) => {
	  if (result.isConfirmed) {
		//swal(confirmMsg, '', 'success');
		return true;
	  } else if (result.isDenied) {
		return false;
	  }
	})
}


function getDevice(){
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
	  return true;
	}else{
	  return false;
	}
}