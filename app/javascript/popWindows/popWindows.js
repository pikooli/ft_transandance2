import {txt404,cat404,cat404big} from  '../Useless/funscript'


export function popWindows(message){
	
	var flash = $('#flashMessage')
	flash.stop(true, true)
	flash.html('<h2>' + message + '</h2>')
	flash.show()
	flash.fadeOut(5000)
}
export function pop404(){
    popWindows(cat404big())
}
export function popChoise(message, url, params)
{
    var flash = $('#flashMessage')
    flash.stop(true, true)
    flash.html('<h2>' + message + '</h2>'+
                "<button id='cancel'>cancel</button><button id='accept'>accept</button"
                )
    $('#flashMessage #accept').on('click', function(){send(url,params)})
    $('#flashMessage #cancel').on('click', function(){popWindows('refused')})
    flash.show()
    flash.fadeOut(7000)
}

export function popChoise2(message, url, params)
{
    var flash = $('#flashMessage')
    flash.stop(true, true)
    flash.html('<h2>' + message + '</h2>'+
                "<button id='cancel'>cancel</button><button id='accept'>accept</button"
                )
    $('#flashMessage #accept').on('click', function(){sendGet(url,params)})
    $('#flashMessage #cancel').on('click', function(){popWindows('refused')})
    flash.show()
    flash.fadeOut(7000)
}

function send(url, params){
    $.ajax({
        url: url,
        data: params,
        type: 'POST'
    })
    popWindows('accepted')
}

function sendGet(url, params){
    $.ajax({
        url: url,
        data: params,
        type: 'GET'
    })
    popWindows('accepted')
}