require('./bootstrap');

import Echo from "laravel-echo"

window.io = require('socket.io-client');

//obj of echo library
window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
});

//show online user
window.Echo.join(`chat`)
    .here((users) => {
        let userid=$('meta[name=user_id]').attr('content');
        users.forEach(function (user){
            if (user.id != userid)
                $('#online_users').append('' +
                    '<li id="user_'+user.id+'" class="list-group-item list-group-item-action mx-2 listItem">' +
                        '<a id="userLink" href="/messages/'+user.id+'" style="text-decoration: none">' +
                        '<i class="text-success fa fa-circle "></i> '+user.name+'</a> ' +
                        '<span class="badge badge-pill badge-danger ml-3" id="badgeUser_'+user.id+'"></span>' +
                    '</li>\n');
        });
    })
    .joining((user) => {
        if ($('#user_'+user.id).length == 0 ){
            $('#online_users').append(
                '<li id="user_'+user.id+'" class="list-group-item list-group-item-action mx-2 listItem">' +
                '<a id="userLink" href="/messages/'+user.id+'" style="text-decoration: none">' +
                '<i class="text-success fa fa-circle "></i> '+user.name+'</a>' +
                ' <span class="badge badge-pill badge-danger ml-3" id="badgeUser_'+user.id+'"></span>' +
                '</li>\n');
        }
    })
    .leaving((user) => {
        $('#user_'+user.id).remove();
    });


//ajax and jq send message
$(document).on("click","#btnSubmit",function (e){
    e.preventDefault();
    let url=$('#btnSubmit').data('url');
    let receiver_id=$("#btnSubmit").data('receiver');
    let message =$('#messageBody').val();
    let CurrentPageNumber=$('.showMore:first').data('page-number');
    if (CurrentPageNumber == 1 || CurrentPageNumber ==null ) {
        $('#bodyOfChat').append('' +
            '<div class="rounded w-50 m-2 p-2 text-white bg-primary float-right">' + message +
            '<div class="row justify-content-center">' +
            '<button class="btn btn-sm btn-danger " id="deleteMessage" data-message-id=""><i class="fa fa-trash"></i></button>' +
            '</div></div><div class="clearfix"></div>\n');
    }
    if (message){
        let data = {
            '_token':$('meta[name=csrf-token]').attr('content'),
            'message_body':message,
            'receiver_id':receiver_id,
        }
        $.ajax({
            method:'POST',
            url:url,
            data:data,
        });
        $('#messageBody').val("");
    }
    scrollToBottom();
});


//real time channel for every user to listen message
let userid=$('meta[name=user_id]').attr('content');
window.Echo.channel(`laravel_database_chatForOne.${userid}`)
    .listen('MessageDelivered',(e) => {
        let sender_id=$('#chatBody').data('user');
        let CurrentPageNumber=$('.showMore:first').data('page-number');
        if(sender_id == e.message.user_id){
            if (CurrentPageNumber == 1 || CurrentPageNumber == null){
                $('#bodyOfChat').append('<div class="rounded w-50 m-2 p-2 text-white bg-danger float-left ">'+e.message.message_body+'</div><div class="clearfix"></div>\n');
                $('#badgeUser_'+e.message.user_id).empty();
            }else {
                $('#badgeUser_'+e.message.user_id).text('New');
            }
        }else {
            $('#badgeUser_'+e.message.user_id).text('New');
        }
});


//press on a link to send ajax request
$(document).on('click','#userLink',function (e){
    e.preventDefault();
    senRequest($(this).attr('href'));
});



//show more link prevent and use ajax to send request
$(document).on('click','a.showMore',function (e){
    e.preventDefault();
    let url = $(this).attr('href');
   senRequest(url);
});


//click on list to submit link
$(document).on('click','.listItem',function (){
    let url = $('#userLink',$(this)).attr('href');
    $(this).children('span:first').html('');
    senRequest(url);

});

//function send ajax request to get message
function senRequest(url){
    $.ajax({
        method:'get',
        url: url,
        success:function (result){
            $('#showChat').removeClass('d-none');
            $('#showChat').html($('.col-8',result).html());

        },
        complete:function(){
            scrollToBottom();
            let sender_id=$('#chatBody').data('user');
            let CurrentPageNumber=$('.showMore:first').data('page-number');
            if (CurrentPageNumber == 1) {
                $('#badgeUser_'+sender_id).empty();
            }
        }
    });
}


//scroll bottom chat
function scrollToBottom(){
    let element= document.getElementById("scrollToBottom");
    element.scrollIntoView(false);

}


//send request to delete message
$(document).on('click','#deleteMessage',function (e){
    e.preventDefault();
    let url = '/messages/'+$(this).data('message-id');
    let parentDiv = $(this).parent();
    $.ajax({
        type:'DELETE',
        url:url,
        data:{
            '_token':$('meta[name=csrf-token]').attr('content'),
        },
        success:function (){
            parentDiv.parent().remove();
        },
        complete:function() {
            scrollToBottom();
        }
    });

});


