import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'

const SCREENSHOTS = 'C:/Users/write/multi-tenant/screenshots'
await mkdir(SCREENSHOTS, { recursive: true })

const TENANT_A_USER = 'tenanta.user@newdemotestissueance.onmicrosoft.com'
const TENANT_B_USER = 'tenantb.user@write2aravindrgmail.onmicrosoft.com'
const PASSWORD      = 'TempPass@2026!'

const shot = (page, path) => page.screenshot({ path }).catch(() => {})

async function msLogin(page, username, password) {
  await page.waitForURL(/login\.microsoftonline\.com/, { timeout: 15000 })
  console.log('  → Microsoft login page loaded')

  await page.locator('input[type="email"]').fill(username)
  await page.locator('input[type="submit"]').click()
  await page.waitForTimeout(2000)

  // Handle "pick an account" screen
  const accountPicker = page.locator(`[data-test-id="${username}"], [data-loginid="${username}"]`)
  if (await accountPicker.isVisible({ timeout: 2000 }).catch(() => false)) {
    await accountPicker.click()
    await page.waitForTimeout(1500)
  }

  await page.locator('input[type="password"]').fill(password)
  await page.locator('input[type="submit"]').click()
  await page.waitForTimeout(2000)

  // "Stay signed in?" prompt
  const staySignedIn = page.locator('input[type="submit"][value="Yes"], #idSIButton9')
  if (await staySignedIn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await staySignedIn.click()
  }
}

const browser = await chromium.launch({ headless: true })

// ─────────────────────────────────────────────────────────────
// TEST 1: Tenant A user → App A dashboard
// ─────────────────────────────────────────────────────────────
console.log('\n=== TEST 1: Tenant A user → App A dashboard ===')
{
  const ctx  = await browser.newContext()
  const page = await ctx.newPage()

  await page.goto('http://localhost:5173')
  console.log('  → Opened App A (5173)')
  await page.waitForURL(/login\.microsoftonline\.com/, { timeout: 15000 })
  await shot(page, `${SCREENSHOTS}/01-login-page.png`)

  await msLogin(page, TENANT_A_USER, PASSWORD)

  await page.waitForURL('http://localhost:5173/**', { timeout: 30000 })
  await page.waitForTimeout(2000)
  await shot(page, `${SCREENSHOTS}/02-app-a-dashboard.png`)

  const url  = page.url()
  const body = await page.textContent('body')
  console.log(`  → Final URL  : ${url}`)
  console.log(`  → Has "App A": ${body.includes('App A')}`)
  console.log(`  → Has "Tenant A — test-demo": ${body.includes('Tenant A')}`)
  console.log(`  → Has user name: ${body.includes('Tenant A User') || body.includes('tenanta')}`)
  console.log(`  → Stayed on 5173 (not 5174): ${!url.includes('5174')}`)

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// TEST 2: Tenant B user logs into App A → cross-redirected to App B
// ─────────────────────────────────────────────────────────────
console.log('\n=== TEST 2: Tenant B user via App A → App B ===')
{
  const ctx  = await browser.newContext()
  const page = await ctx.newPage()

  await page.goto('http://localhost:5173')
  console.log('  → Opened App A (5173) as Tenant B user')
  await page.waitForURL(/login\.microsoftonline\.com/, { timeout: 15000 })
  await shot(page, `${SCREENSHOTS}/03-login-tenant-b.png`)

  await msLogin(page, TENANT_B_USER, PASSWORD)

  try {
    // Step 1: App A receives token, TenantGate detects Tenant B, hard-redirects to App B
    await page.waitForURL(/localhost:5174/, { timeout: 25000 })
    console.log(`  → App A redirected to App B: ${page.url()}`)
    await shot(page, `${SCREENSHOTS}/04a-app-b-landing.png`)

    // Step 2: App B starts its own MSAL auth — sign in again
    const onMsLogin = await page.waitForURL(/login\.microsoftonline\.com/, { timeout: 8000 })
      .then(() => true).catch(() => false)

    if (onMsLogin) {
      console.log('  → App B triggered MSAL login, completing it…')
      await msLogin(page, TENANT_B_USER, PASSWORD)
    }

    // Step 3: App B dashboard
    await page.waitForURL('http://localhost:5174/**', { timeout: 25000 })
    await page.waitForTimeout(2000)
    await shot(page, `${SCREENSHOTS}/04b-app-b-dashboard.png`)

    const url  = page.url()
    const body = await page.textContent('body')
    console.log(`  → Final URL     : ${url}`)
    console.log(`  → On App B port : ${url.startsWith('http://localhost:5174')}`)
    console.log(`  → Has "App B"   : ${body.includes('App B')}`)
    console.log(`  → Has "EKYCPOC" : ${body.includes('EKYCPOC')}`)
    console.log(`  → Has user name : ${body.includes('Tenant B User') || body.includes('tenantb')}`)
  } catch (e) {
    await shot(page, `${SCREENSHOTS}/04-failed.png`)
    console.log(`  ❌ Failed. URL: ${page.url()}`)
    console.log(`  Error: ${e.message}`)
  }

  await ctx.close()
}

// ─────────────────────────────────────────────────────────────
// TEST 3: Tenant B user → App B directly
// ─────────────────────────────────────────────────────────────
console.log('\n=== TEST 3: Tenant B user → App B directly ===')
{
  const ctx  = await browser.newContext()
  const page = await ctx.newPage()

  await page.goto('http://localhost:5174')
  console.log('  → Opened App B (5174) directly')
  await page.waitForURL(/login\.microsoftonline\.com/, { timeout: 15000 })

  await msLogin(page, TENANT_B_USER, PASSWORD)

  try {
    await page.waitForURL('http://localhost:5174/**', { timeout: 25000 })
    await page.waitForTimeout(2000)
    await shot(page, `${SCREENSHOTS}/05-app-b-direct.png`)

    const url  = page.url()
    const body = await page.textContent('body')
    console.log(`  → Final URL     : ${url}`)
    console.log(`  → Has "App B"   : ${body.includes('App B')}`)
    console.log(`  → Has "EKYCPOC" : ${body.includes('EKYCPOC')}`)
    console.log(`  → Has user name : ${body.includes('Tenant B User') || body.includes('tenantb')}`)
  } catch (e) {
    await shot(page, `${SCREENSHOTS}/05-failed.png`)
    const url = page.url()
    console.log(`  ❌ Timeout. URL: ${url}`)
    const body = await page.textContent('body').catch(() => '')
    console.log(`  Page snippet: ${body.replace(/\s+/g,' ').substring(0, 200)}`)
  }

  await ctx.close()
}

await browser.close()
console.log('\nDone. Screenshots →', SCREENSHOTS)
