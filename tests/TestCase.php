<?php

namespace Agelgil\FilamentEthiopic\Tests;

use Agelgil\FilamentEthiopic\FilamentEthiopicServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

class TestCase extends Orchestra
{
    protected function getPackageProviders($app): array
    {
        return [
            FilamentEthiopicServiceProvider::class,
        ];
    }
}
