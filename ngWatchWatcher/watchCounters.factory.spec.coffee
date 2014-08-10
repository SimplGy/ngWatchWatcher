

describe 'watchCounters.factory', ->

  scope = undefined
  watchCounters = undefined
  $rootScope = undefined
  childScope = undefined
  el = undefined

  beforeEach ->
    angular.mock.module 'watchWatcher'
    angular.mock.inject (_watchCounters_, _$rootScope_, $compile) ->
      watchCounters = _watchCounters_
      $rootScope = _$rootScope_
      # Make some root child scopes
      $rootScope.$new()
      childScope = $rootScope.$new()
      # ...and a couple of nested ones
      childScope.$new()
      childScope.$new()

      $rootScope.$watch -> # Add 2 watches to root
      $rootScope.$watch ->

      # Test element with two watches
      childScope.testVal = 'Scope is working'
      el = $compile('<div ng-class="{ hasVal: testVal }">{{testVal}}</div>')(childScope)
      $rootScope.$digest()


  it 'is defined', ->
    expect(watchCounters).toBeDefined()

  describe 'test scope preparation', ->
    it '$rootScope is available and looks like an angular scope', ->
      expect($rootScope).toBeDefined()
      expect(typeof $rootScope.$new).toBe 'function'
    it '$rootScope has other scopes in it', ->
      expect($rootScope.$$childHead).toBeDefined()
      expect($rootScope.$$childHead.$$nextSibling).toBeDefined()

  describe '.byScope()', ->
    it 'counts the correct number of watches on a scope', ->
      expect(watchCounters.byScope(childScope).length).toBe 2
    it 'counts watches on the scope and all it\'s children', ->
      expect(watchCounters.byScope($rootScope).length).toBe 4

  describe '.byEl()', ->
    it 'counts by element correctly', ->
      expect(watchCounters.byEl(el).length).toBe 2