# ngWatchWatcher

> Keep an eye on your Angular Watchers.

> The check engine light for your ng-code.

## Why Use `ngWatchWatcher`?

It helps you answer questions about your Angular application's performance:

* How many $digests per second does my app use?
* When I add a component, how much does it add to the `$digest` cycle?
* Am I cleaning up scopes for this component when I add and remove it?

`ngWatchWatcher`(I almost called it "[Every Breath You Take](https://www.youtube.com/results?search_query=every+breath+you+take)") helps you keep an eye on what your app is doing.
You can use this to premempt performance issues, or identify which components are causing them after the fact.

Tools for helping you understand what's going on with Angular Watchers and scopes. You can think of it like:

## Features

Visually monitor `$digest` activity:

![$digest activity light](/screenshot2.png?raw=true)

Click the light to for info on your `$digest` performance:

![$digest activity light](/screenshot3.png?raw=true)

Keep an eye on your scope and watcher counts:

![Counts logged to console](/screenshot1.png?raw=true)


## Usage

Include the `ngWatchWatcher` module.

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

## Notes

An accurate count of all scopes in an angular application is tricky.

* Finding scopes by element, even if you start at the body tag, won't find the `$rootScope`, so it'll always be at least one scope short.
* Finding scopes by element also won't find scopes that are not drawn, say, a lightbox/modal.
* Finding scopes by scope can not find isolate scopes, such as those in directives.
* Counting watchers has the same challenges because they are accessed through scope.
