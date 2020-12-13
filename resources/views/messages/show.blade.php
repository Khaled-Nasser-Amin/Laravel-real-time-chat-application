@extends('layouts.app')
@section('content')
    <div class="row">
        <div class="col-3 mr-3 border shadow py-3 d-flex flex-column" style="height: 500px">
            <h1>Online Users</h1>
            <hr class="mt-0">
            <div class="list-group flex-grow-1" id="online_users" style="overflow-y:scroll">
            </div>
        </div>{{--online users--}}
        <div class="col-8 border shadow p-0">{{--chat--}}
            <div class="card" style="height: 500px">{{--card of chat--}}
                <div class="card-header">
                    <h2>{{$receiver->name}}</h2>
                </div>{{--HEader--}}
                <div class="card-body border-top border-bottom h-75" style=" overflow-y:scroll; " id="chatBody" data-user="{{$receiver->id}}">
                    <div id="bodyOfChat" class="scrollingPagination">

                        @if ($messages->lastPage()	!= $messages->currentPage())
                            <a href="{{$messages->nextPageUrl()}}" class="clearfix d-block text-center showMore"  data-page-number="{{$messages->currentPage()}}">Show More</a>
                        @endif
                        @if ($messagesData)
                            @foreach ($messagesData as $message)
                                <div class="rounded w-50 m-2 p-2 text-white {{$message->user_id == auth()->user()->id ? 'bg-primary float-right' :'bg-danger float-left'}}">
                                    {{$message->message_body}}
                                    @if ($message->user_id == auth()->user()->id)
                                        <div class="row justify-content-center">
                                            <button class="btn btn-sm btn-danger " id="deleteMessage" data-message-id="{{$message->id}}"><i class="fa fa-trash"></i></button>
                                        </div>
                                    @endif
                                </div>

                                <div class="clearfix"></div>
                            @endforeach
                        @endif
                        @if (!$messages->onFirstPage())
                            <a href="{{$messages->previousPageUrl()}}"  class="clearfix d-block text-center showMore showMore" data-page-number="{{$messages->currentPage()}}">Show More</a>
                        @endif
                    </div>
                    <div id="scrollToBottom"></div>
                </div>{{--Body of card--}}
                <div class="card-footer">
                    <form id="formSubmit" >
                        <div class="form-group form-inline m-0 justify-content-between" >
                            <input type="text" name="message_body" class="form-control-sm col mr-2 border" id="messageBody">
                            <input type="submit" class="btn btn-primary btn-sm" value="send" id="btnSubmit" data-url="{{route('messages.store')}}" data-receiver="{{$receiver->id}}">
                        </div>
                    </form>
                </div>{{--FOoter--}}

            </div>
        </div>
    </div>

@stop

