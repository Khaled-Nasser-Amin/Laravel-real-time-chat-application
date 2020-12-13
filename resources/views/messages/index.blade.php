@extends('layouts.app')
@section('content')
    <section class="row">
        <div class="col-3 mr-3 border shadow py-3 d-flex flex-column" style="height: 500px">
            <h1>Online Users</h1>
            <hr class="mt-0">
            <div class="list-group flex-grow-1" id="online_users" style="overflow-y:scroll;">
            </div>
        </div>
        <div class="col-8 border shadow p-0 d-none " id="showChat">

        </div>
    </section>

@stop
