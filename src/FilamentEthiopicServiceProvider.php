<?php

namespace Agelgil\FilamentEthiopic;

use Filament\Forms\Components\DateTimePicker;
use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentEthiopicServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package
            ->name('filament-ethiopic-calendar')
            ->hasViews('filament-ethiopic-calendar')
            ->hasTranslations();
    }

    public function packageBooted(): void
    {
        FilamentAsset::register([
            AlpineComponent::make('filament-ethiopic-calendar', __DIR__.'/../resources/js/dist/components/filament-ethiopic-calendar.js'),
        ], 'agelgil/filament-ethiopic-calendar');

        DateTimePicker::macro('ethiopic', function (bool $weekdaysShort = true) {
            $this
                ->native(false)
                ->firstDayOfWeek(0)
                ->extraAttributes(['data-weekdays-short' => ($weekdaysShort ? 'short' : 'long')], true)
                ->view('filament-ethiopic-calendar::date-time-picker');

            return $this;
        });
    }
}
