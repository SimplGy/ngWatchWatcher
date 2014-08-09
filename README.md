# ngWatchWatcher

> Keep an eye on your Angular Watchers.

> The check engine light for your ng-code.

![Counts logged to console](/screenshot1.png?raw=true)

Tools for helping you understand what's going on with Angular Watchers and scopes. You can think of it like:

##### [Live Demo (Look at the Console for the logs)](http://simpleascouldbe.github.io/ngWatchWatcher/)

`ngWatchWatcher`(I almost called it "[Every Breath You Take](https://www.youtube.com/results?search_query=every+breath+you+take)") helps you keep an eye on what your app is doing.
You can use this to premempt performance issues, or identify which components are causing them after the fact.

### Notes

An accurate count of all scopes in an angular application is tricky.

* Finding scopes by element, even if you start at the body tag, won't find the `$rootScope`, so it'll always be at least one scope short.
* Finding scopes by element also won't find scopes that are not drawn, say, a lightbox/modal.
* Finding scopes by scope can not find isolate scopes, such as those in directives.
* Counting watchers has the same challenges because they are accessed through scope.
