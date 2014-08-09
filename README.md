# ngWatchWatcher

## Keep an eye on your Angular Watchers

> The check engine light for your ng-code.

Tools for helping you understand what's going on with Angular Watchers and scopes.

Getting the count of scopes and watchers in an angular application is non-trivial. There are isolate scopes.

"The WatchWatcher" (I almost called it "Every Little Step You Take") helps you keep an eye on what your app is doing.
You can use this to premempt performance issues, or identify which components are causing them after the fact.

## Notes

An accurate count of all scopes in an angular application is tricky.

* Finding scopes by element, even if you start at the body tag, won't find the `$rootScope`, so it'll always be at least one scope short.
* Finding scopes by element also won't find scopes that are not drawn, say, a lightbox/modal.
* Finding scopes by scope can not find isolate scopes, such as those in directives.
* Counting watchers has the same challenges because they are accessed through scope.

## TODO

* Merge and dedupe scopes and watchers found by both methods to get the best possible superset of items
