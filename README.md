# ngWatchWatcher  ([Demo](http://simpleascouldbe.github.io/ngWatchWatcher/))

> The check engine light for your ng-code.


### Why Watch `$watch`es?

It helps you answer questions about your Angular application's performance:

* Know how many `$digest`s per second your app churns
* Know your average `$digest` processing time.
* Track the impact to your `$digest` cycle as your app grows
* Know if you're cleaning up watches and scopes properly

You can use this to premempt performance issues, or identify which components are causing them.
Let me know if you think I should rename this project "[Every Breath You Take](https://www.youtube.com/results?search_query=every+breath+you+take)"

### Features

Visually monitor `$digest` activity:

![$digest activity light](/blinky.gif?raw=true)

Click the blinky light for info on your `$digest` performance:

![detailed $digest info](/screenshot3.png?raw=true)

Keep an eye on your scope and watcher counts:

![Counts logged to console](/screenshot1.png?raw=true)


### Usage

Include `ngWatchWatcher.min.js` and make the `ngWatchWatcher` module a dependency of your app.

If you'd like the activity light, add a `<watch-light></watch-light>` directive tag anywhere in your markup.

To print scope or watch information, just inject the factory and use the method you'd like:

```javascript
app.run(function(watchCounters, scopeCounters){

    watchCounters.byEl();    // An array of watchers, found by traversing elements
    watchCounters.byScope(); // An array of watchers found by traversing from $rootScope

    scopeCounters.byEl();    // Array of scopes found by scope traversal
    scopeCounters.byScope(); // Array of scopes found by $rootScope traversal

  });
});
```

##### [Live Demo (Look at the Console for the logs)](http://simpleascouldbe.github.io/ngWatchWatcher/)

### Notes

An accurate count of all scopes in an angular application is tricky.

* Finding scopes by element, even if you start at the body tag, won't find the `$rootScope`, so it'll always be at least one scope short.
* Finding scopes by element also won't find scopes that are not drawn, say, a lightbox/modal.
* Finding scopes by scope can not find isolate scopes, such as those in directives.
* Counting watchers has the same challenges because they are accessed through scope.
