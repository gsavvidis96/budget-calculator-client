import { beforeEach, describe, expect, it, vi } from 'vitest'

const setNavigatorProperty = (
  property: 'maxTouchPoints' | 'platform' | 'userAgent',
  value: unknown,
) => {
  Object.defineProperty(navigator, property, { configurable: true, value })
}

const mockDisplayMode = (standalone: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: standalone && query.includes('standalone'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

describe('PWA installation', () => {
  beforeEach(() => {
    vi.resetModules()
    mockDisplayMode(false)
    setNavigatorProperty('userAgent', 'Mozilla/5.0 Chrome/140.0.0.0 Safari/537.36')
    setNavigatorProperty('platform', 'Win32')
    setNavigatorProperty('maxTouchPoints', 0)
  })

  it('stays hidden when the browser does not expose an installation path', async () => {
    const { usePwaInstall } = await import('./usePwaInstall')

    expect(usePwaInstall().canInstall.value).toBe(false)
  })

  it('uses the browser installation prompt once and then hides the button', async () => {
    const { usePwaInstall } = await import('./usePwaInstall')
    const pwa = usePwaInstall()
    const prompt = vi.fn().mockResolvedValue(undefined)
    const event = Object.assign(new Event('beforeinstallprompt'), {
      platforms: ['web'],
      prompt,
      userChoice: Promise.resolve({ outcome: 'dismissed', platform: 'web' }),
    })

    window.dispatchEvent(event)
    expect(pwa.canInstall.value).toBe(true)

    await expect(pwa.requestInstall()).resolves.toBe('dismissed')
    expect(prompt).toHaveBeenCalledOnce()
    expect(pwa.canInstall.value).toBe(false)
  })

  it('stays hidden when opened as an installed app', async () => {
    mockDisplayMode(true)
    const { usePwaInstall } = await import('./usePwaInstall')

    expect(usePwaInstall().canInstall.value).toBe(false)
  })

  it('offers manual Add to Home Screen instructions on iOS', async () => {
    setNavigatorProperty('userAgent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')
    setNavigatorProperty('platform', 'iPhone')
    const { usePwaInstall } = await import('./usePwaInstall')
    const pwa = usePwaInstall()

    expect(pwa.canInstall.value).toBe(true)
    expect(pwa.manualInstallPlatform.value).toBe('ios')
  })
})
