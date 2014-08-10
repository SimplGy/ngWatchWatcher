

describe 'scopeCounters.factory', ->

  scope = undefined
  scopeCounters = undefined
  sampleApp = undefined


  beforeEach ->
    angular.mock.module 'watchWatcher'
    angular.mock.inject (_scopeCounters_) ->
      scopeCounters = _scopeCounters_
#    sampleApp = angular.module('sampleApp',[ 'watchWatcher' ])
#    sampleApp.run ($rootScope) ->
#      scope = $rootScope
#      scope1 = $rootScope.$new()
#      scope2 = $rootScope.$new()

  it 'is defined', ->
    expect(scopeCounters).toBeDefined()

  describe 'byEl', ->
    it 'is a function', ->
      expect(typeof scopeCounters.byEl).toBeDefined()

  describe 'byScope', ->
    it 'is a function', ->
      expect(typeof scopeCounters.byScope).toBeDefined()

