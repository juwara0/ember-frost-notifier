import {expect} from 'chai'
import Ember from 'ember'
const {run} = Ember
import NotifierService from 'ember-frost-notifier/pods/services/notifier'
import wait from 'ember-test-helpers/wait'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit / Service / notifier', function () {
  let service, sandbox, notification
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    service = new NotifierService()

    notification = {
      message: 'message',
      type: 'info',
      autoClear: true,
      clearDuration: 100
    }
  })

  afterEach(function () {
    sandbox.reset()
  })

  describe('addNotification', function () {
    beforeEach(function () {
      sandbox.stub(service, 'setupAutoClear')
      service.addNotification(notification)
    })

    it('should add to the notifications array', function () {
      expect(service.notifications).to.have.length(1)
    })

    it('should call setupAutoClear', function () {
      expect(service.setupAutoClear.called).to.equal(true)
    })

    it('should use the specified clear duration', function () {
      expect(service.notifications[0].clearDuration).to.equal(100)
    })

    describe('when setupAutoClear is false', function () {
      it('should not call setupAutoClear', function () {
        notification.autoClear = false
        service.addNotification(notification)
        expect(service.setupAutoClear.calledOnce).to.equal(true)
      })
    })

    describe('when clearDuration is not provided', function () {
      it('should use the default clear duration', function () {
        notification.clearDuration = undefined
        service.addNotification(notification)
        expect(service.notifications[1].clearDuration).to.equal(service.defaultClearDuration)
      })
    })
  })

  describe('removeNotification', function () {
    it('should remove from the notifications array', function (done) {
      run(function () {
        let emberObject = Ember.Object.create(notification)
        service.notifications.pushObject(emberObject)
        service.removeNotification(emberObject)

        wait().then(function () {
          expect(service.notifications).to.have.length(0)
          done()
        })
      })
    })
  })

  describe('clearAll', function () {
    beforeEach(function () {
      let emberObject = Ember.Object.create(notification)
      service.notifications.pushObject(emberObject)

      service.clearAll()
    })

    it('should remove all notifications', function () {
      expect(service.notifications).to.have.length(0)
    })
  })

  describe('setDefaultClearDuration', function () {
    beforeEach(function () {
      service.setDefaultClearDuration(1)
    })

    it('should set the defaultClearDuration', function () {
      expect(service.defaultClearDuration).to.equal(1)
    })
  })

  describe('setupAutoClear', function () {
    it('should remove the notification after clearDuration', function (done) {
      run(function () {
        let emberObject = Ember.Object.create(notification)
        service.notifications.pushObject(emberObject)
        service.setupAutoClear(emberObject)

        wait().then(function () {
          expect(service.notifications).to.have.length(0)
          done()
        })
      })
    })
  })
})
