import { computed, readonly, ref, shallowRef } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt: () => Promise<void>
}

type ManualInstallPlatform = 'ios' | 'macos-safari' | null

const installPrompt = shallowRef<BeforeInstallPromptEvent | null>(null)
const isInstalled = ref(false)
const manualInstallPlatform = ref<ManualInstallPlatform>(null)
let initialized = false

const detectsStandaloneMode = () => {
  const standaloneNavigator = navigator as Navigator & { standalone?: boolean }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    standaloneNavigator.standalone === true
  )
}

const detectManualInstallPlatform = (): ManualInstallPlatform => {
  const userAgent = navigator.userAgent
  const isAppleMobile =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  if (isAppleMobile) return 'ios'

  const safariVersion = userAgent.match(/Version\/(\d+)/)?.[1]
  const isDesktopSafari =
    /Macintosh/i.test(userAgent) &&
    /Safari/i.test(userAgent) &&
    !/Chrome|Chromium|CriOS|Edg|OPR/i.test(userAgent)

  return isDesktopSafari && Number(safariVersion) >= 17 ? 'macos-safari' : null
}

export const initializePwaInstall = () => {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  isInstalled.value = detectsStandaloneMode()
  manualInstallPlatform.value = detectManualInstallPlatform()

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installPrompt.value = event as BeforeInstallPromptEvent
  })

  window.addEventListener('appinstalled', () => {
    isInstalled.value = true
    installPrompt.value = null
  })

  window.matchMedia('(display-mode: standalone)').addEventListener('change', (event) => {
    isInstalled.value = event.matches || detectsStandaloneMode()
  })
}

export const usePwaInstall = () => {
  initializePwaInstall()

  const canInstall = computed(
    () =>
      !isInstalled.value && (installPrompt.value !== null || manualInstallPlatform.value !== null),
  )

  const requestInstall = async () => {
    const prompt = installPrompt.value
    if (!prompt) return null

    await prompt.prompt()
    const choice = await prompt.userChoice
    installPrompt.value = null
    return choice.outcome
  }

  return {
    canInstall,
    hasNativePrompt: computed(() => installPrompt.value !== null),
    isInstalled: readonly(isInstalled),
    manualInstallPlatform: readonly(manualInstallPlatform),
    requestInstall,
  }
}
