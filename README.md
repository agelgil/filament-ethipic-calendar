# Add "Ethiopic calendar" pickers to Filament

## Installation

You can install the package via composer:

```bash
composer require agelgil/filament-ethiopic-calendar
```

## Usage

To add ethiopic date and date-time pickers to your forms, just add `ethiopic` to your `DatePicker` and `DateTimePicker`.

```php
// Yes! Just use Filament's original DatePickers and DateTimePickers!
use Filament\Forms;

Forms\Components\DatePicker::make('moderated_at')
    ->ethiopic(),
Forms\Components\DateTimePicker::make('published_at')
    ->ethiopic(),
```

## Ignoring Jalali Conversion
If you want to ignore ethiopic conversion you can use the `when` and `unless` methods:

```php
use Filament\Forms;
use Illuminate\Support\Facades\App;

Forms\Components\DatePicker::make('birthday')
    ->when(App::isLocale('am'), fn (Forms\Components\DatePicker $column) => $column->ethiopic()),
```

## Credits

- [Mo Khosh](https://github.com/mokhosh)
- [mokhosh/filament-jalali](https://github.com/mokhosh/filament-jalali)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
