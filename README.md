# tennu-conversion

A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Allows the bot to perform unit conversions.

Driven by [js-quanitites](https://github.com/gentooboontoo/js-quantities).

## Getting information on what you can work with

- To see all the kinds of supported coversions do ```!con kinds```
- To see all units of a specific kind do ```!con units <kind>``` IE: ```!con units force```
- To see all aliases of a specific unit do ```!con aliases <unit>``` IE: ```!con aliases m```

### Conversions
This is the meat and bones of the plugin.

- Usage: ```!con <qty> to <unit>``` IE: ```!con 10 feet to meters```

### Comparisons
- Usage: ```!con <qty> compare-gt <qty>``` IE: ```!con 14 feet compare-gt 3 meters``` = true
- You can use these:
    - "eq"
    - "same"
    - "lt"
    - "lte"
    - "gt"
    - "gte"


### Extras
base values
- Usage: ```!con <qty> inverse``` IE: ```100 m/s inverse``` = 0.01 s/m
inversions
- Usage: ```!con <qty> tobase``` IE: ```10 cm base``` = 0.1 m

### Installing Into Tennu

See Downloadable Plugins [here](https://tennu.github.io/plugins/).