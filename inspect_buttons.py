from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 960})
    page.goto('http://127.0.0.1:8000/workspace?view=simulation')
    page.wait_for_timeout(2500)
    buttons = page.evaluate("() => Array.from(document.querySelectorAll('button')).map(b => (b.innerText || '').trim()).filter(Boolean)")
    print('Buttons found count:', len(buttons))
    print('First 15 buttons:', buttons[:15])
    sim_controls = page.evaluate("() => Array.from(document.querySelectorAll('[data-action=\"sim-section\"]')).map(b => ({text: (b.innerText || '').trim(), sec: b.dataset.section}))")
    print('Sim controls:', sim_controls)
    cards = page.evaluate("() => Array.from(document.querySelectorAll('.netizen-bridge-card, .unified-sim-tabs, .social-network-card')).map(el => el.className)")
    print('Cards found:', cards)
    page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\current_view.png')
    print('Saved current_view.png')
    browser.close()
