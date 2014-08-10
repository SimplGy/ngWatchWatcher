
describe 'watchLight.controller', ->

  controller = undefined
  sleep = (amount) ->
    amount = amount || 10
    startTime = Date.now()
    while(Date.now() - startTime < amount)
      startTime

  beforeEach ->
    angular.mock.module 'watchWatcher'
    angular.mock.inject ($controller) ->
      controller = $controller('WatchLightController')

  describe '.countWatch()', ->
    it 'Adds measurements', ->
      expect(controller.getRecentDigests().length).toBe 0
      controller.countWatch()
      controller.countWatch()
      controller.countWatch()
      expect(controller.getRecentDigests().length).toBe 3
    it 'measures duration', ->
      expect(controller.getRecentDigests().length).toBe 0
      controller.countWatch()
      sleep 10 # simulate blocking $digest churn
      lastDigest = controller.getRecentDigests()[0]
      expect(lastDigest).toBeDefined()
      waits 20
      runs -> expect(10 <= lastDigest.duration < 15).toBe true # if it churned for 10, we should have measured in this range

  describe '.getDigestsPerSecond()', ->
    it 'averages out digests over time', ->
      expect(controller.getRecentDigests().length).toBe 0
      # We're going to do 10 watches in a tenth of a second so we expect a 100 watches per second score
      controller.countWatch() for i in [1..5]
      waits 1000 / 10
      runs ->
        controller.countWatch() for i in [1..5]
        expect(controller.getRecentDigests().length).toBe 10
        expect(95 < controller.getDigestsPerSecond() < 105).toBe true # should be exactly 100, but CPU timing could bump it a little

  describe '.getAverageDigestDuration()', ->

    it 'gets the average duration of one digest', ->
      expect(controller.getRecentDigests().length).toBe 0
      controller.countWatch()
      sleep 50
      waits 0
      runs ->
        expect(controller.getRecentDigests().length).toBe 1
        expect(45 < controller.getAverageDigestDuration() < 55).toBe true

    it 'gets the average duration of many digests', ->
      expect(controller.getRecentDigests().length).toBe 0
      # One fast and one slow "digest"
      waits 0
      runs ->
        controller.countWatch()
        sleep 10

      waits 0
      runs ->
        controller.countWatch()
        sleep 100

      waits 0
      runs ->
        expect(controller.getRecentDigests().length).toBe 2
        fast = controller.getRecentDigests()[0].duration
        slow = controller.getRecentDigests()[1].duration
        avg  = controller.getAverageDigestDuration()
        console.log "fast: #{fast}. slow: #{slow}, avg: #{avg}" # Print it out, this is a tricky test.
        expect(5 < fast < 15).toBe true
        expect(95 < slow < 120).toBe true
        expect(Math.round avg).toBe Math.round (fast + slow ) / 2

