import { cleanup } from '@testing-library/react'// @ts-ignore
afterEach(() => {
  cleanup()
  localStorage.clear()
})
