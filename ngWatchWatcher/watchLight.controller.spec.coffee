
describe 'watchLight.controller', ->

  controller = undefined

  beforeEach ->
    angular.mock.module 'watchWatcher'
    angular.mock.inject (WatchLightController) ->
      controller = WatchLightController

  describe '.countWatch()', ->
    it 'Adds measurements', ->
      expect(controller.getRecentDigests().length).toBe 43