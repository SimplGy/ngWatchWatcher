

describe 'scopeCounters.factory', ->

  scope = undefined
  scopeCounters = undefined
  $rootScope = undefined
  childScope = undefined
  el = undefined

  beforeEach ->
    angular.mock.module 'watchWatcher'
    angular.mock.inject (_scopeCounters_, _$rootScope_, $compile) ->
      scopeCounters = _scopeCounters_
      $rootScope = _$rootScope_
      # Make some root child scopes
      $rootScope.$new()
      childScope = $rootScope.$new()
      # ...and a couple of nested ones
      childScope.$new()
      childScope.$new()
      childScope.$new()

      childScope.testVal = 'Scope is working'
      el = $compile('<div>{{testVal}}</div>')(childScope)
      $rootScope.$digest()


  it 'is defined', ->
    expect(scopeCounters).toBeDefined()

  describe 'test scope preparation', ->
    it '$rootScope is available and looks like an angular scope', ->
      expect($rootScope).toBeDefined()
      expect(typeof $rootScope.$new).toBe 'function'
    it '$rootScope has other scopes in it', ->
      expect($rootScope.$$childHead).toBeDefined()
      expect($rootScope.$$childHead.$$nextSibling).toBeDefined()

  describe '.countChildren(scope)', ->
    it 'is a function', ->
      expect(typeof scopeCounters.countChildren).toBe 'function'
    it 'gets correct counts of immediate children', ->
      expect(scopeCounters.countChildren $rootScope).toBe 2
      expect(scopeCounters.countChildren childScope).toBe 3
      childScope.$new()
      expect(scopeCounters.countChildren childScope).toBe 4
    it "detects isolate scope", ->
      expect(scopeCounters.countChildren childScope).toBe 3
      childScope.$new true
      expect(scopeCounters.countChildren childScope).toBe 4

  describe '.byScope()', ->
    it 'is a function', ->
      expect(typeof scopeCounters.byScope).toBe 'function'
    it 'finds the right number of scopes', ->
      expect(scopeCounters.byScope().length).toBe 6 # 1 rootscope, 2 children, 3 grand-children
    it 'detects the results of destorying scope', ->
      expect(scopeCounters.byScope().length).toBe 6
      childScope.$$childHead.$destroy()
      expect(scopeCounters.byScope().length).toBe 5
      childScope.$destroy()
      expect(scopeCounters.byScope().length).toBe 2


  describe 'byEl', ->
    it 'is a function', ->
      expect(typeof scopeCounters.byEl).toBeDefined()
    it 'has an element to test against', ->
      expect(el.html()).toBe 'Scope is working'
    it 'Finds scopes by element', ->
      expect(scopeCounters.byEl(el).length).toBe 1 # Only 1 because by design, this method looks for children by DOM traversal.

