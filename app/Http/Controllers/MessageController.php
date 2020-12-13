<?php

namespace App\Http\Controllers;

use App\Events\MessageDelivered;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;


class MessageController extends Controller
{
    public function index(){
        return view('messages.index');
    }
    public function show($id){
        $receiver=User::find($id);
        $messages=Message::where([['user_id',auth()->user()->id], ['receiver_id',$id]])->orWhere([['receiver_id',auth()->user()->id], ['user_id',$id]])->orderByDesc('created_at')->paginate(10);
        $messagesData=$messages->reverse();
        return view('messages.show',compact(['receiver','messagesData','messages']));
    }

    public function store(Request $request){
        $message=auth()->user()->messages()->create($request->all());
        broadcast(new MessageDelivered($message))->toOthers();
        return $request;
    }
    public function destroy($id){
        $message=auth()->user()->messages()->find($id);
        return  $message  ? $message->delete() : response(false,404);
    }
}
