/* eslint-disable no-underscore-dangle */
import * as jsCookie from 'js-cookie'
import * as MockDate from 'mockdate'

import MobXCookie from './mobx-cookie'

jest.useFakeTimers()

describe('mobx-cookie', () => {
  beforeEach(() => {
    // Freeze time
    MockDate.set('Tue Jan 02 2018 00:00:00 GMT+0000 (Greenwich Mean Time)')
  })

  afterEach(() => {
    MockDate.reset()
  })

  const setup = () => {
    const mockJsCookie = jsCookie
    jest.spyOn(mockJsCookie, 'get').mockImplementation()
    jest.spyOn(mockJsCookie, 'set').mockImplementation()
    jest.spyOn(mockJsCookie, 'remove').mockImplementation()
    const COOKIE_NAME = 'COOKIE_NAME'
    const mobxCookie = new MobXCookie(COOKIE_NAME)
    return {
      mockJsCookie,
      COOKIE_NAME,
      mobxCookie,
    }
  }

  it('checks if cookie is set on load', () => {
    const { mockJsCookie, COOKIE_NAME } = setup()
    expect(mockJsCookie.get).toHaveBeenCalledWith(COOKIE_NAME)
  })

  it('sets the internal _name property on load', () => {
    const { COOKIE_NAME, mobxCookie } = setup()
    expect(mobxCookie._name).toBe(COOKIE_NAME)
  })

  it('checks if expiry cookie is set on load', () => {
    const { mockJsCookie, COOKIE_NAME } = setup()
    expect(mockJsCookie.get).toHaveBeenCalledWith(`${COOKIE_NAME}-expires`)
  })

  it('sets cookie value when expiry set to one day', () => {
    const { mobxCookie, mockJsCookie, COOKIE_NAME } = setup()
    const VALUE = 'VALUE'
    const options = { expires: 1 }
    mobxCookie.set(VALUE, options)
    expect(mockJsCookie.set).toHaveBeenCalledWith(COOKIE_NAME, VALUE, options)
    expect(mockJsCookie.set).toHaveBeenCalledWith(
      `${COOKIE_NAME}-expires`,
      new Date('2018-01-03').toString(),
      options,
    )
    expect(mobxCookie.value).toBe(VALUE)
  })

  it('sets cookie value when expiry set by date', () => {
    const { mobxCookie, mockJsCookie, COOKIE_NAME } = setup()
    const VALUE = 'VALUE'
    const options = {
      expires: new Date(
        'Wed Jan 03 2018 00:00:00 GMT+0000 (Greenwich Mean Time)',
      ),
    }
    mobxCookie.set(VALUE, options)
    expect(mockJsCookie.set).toHaveBeenCalledWith(COOKIE_NAME, VALUE, options)
    expect(mockJsCookie.set).toHaveBeenCalledWith(
      `${COOKIE_NAME}-expires`,
      options.expires,
      options,
    )
    expect(mobxCookie.value).toBe(VALUE)
  })

  it('calls remove method when expiry is up', () => {
    const { mobxCookie } = setup()
    const VALUE = 'VALUE'
    const options = {
      expires: new Date(
        'Tue Jan 02 2018 00:00:10 GMT+0000 (Greenwich Mean Time)',
      ),
    }
    jest.spyOn(mobxCookie, 'remove').mockImplementation()
    mobxCookie.set(VALUE, options)
    jest.runAllTimers()
    expect(mobxCookie.remove).toHaveBeenCalledTimes(1)
  })

  it('removes cookie', () => {
    const { mobxCookie, mockJsCookie, COOKIE_NAME } = setup()
    mobxCookie.set('VALUE')
    mobxCookie.remove()
    expect(mockJsCookie.remove).toHaveBeenCalledWith(COOKIE_NAME)
    expect(mockJsCookie.remove).toHaveBeenCalledWith(`${COOKIE_NAME}-expires`)
    expect(mobxCookie.value).toBeUndefined()
    expect(mobxCookie._timeout).toBeUndefined()
  })
})
