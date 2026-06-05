<?php

namespace App\Http\Controllers;

use App\Traits\HasPermission;

abstract class Controller
{
    use HasPermission;
}
