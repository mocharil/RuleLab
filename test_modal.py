import time
from playwright.sync_api import sync_playwright

print('Starting playwright...', flush=True)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 850})
    page.goto('http://127.0.0.1:8000/workspace?view=history')
    page.wait_for_selector('.history-timeline')
    print('History loaded', flush=True)
    
    # Find social run row
    social_btn = page.locator('.history-row:has-text("Forum netizen") button[data-action="run-detail"]').first
    print('Found social button count:', social_btn.count(), flush=True)
    if social_btn.count() > 0:
        social_btn.click()
        page.wait_for_selector('#modal[open]')
        time.sleep(1)
        print('Modal opened!', flush=True)
        page.screenshot(path='c:/Users/Aril Indra Permana/RuleLab/modal_screenshot.png')
        print('Screenshot saved to modal_screenshot.png', flush=True)
        
        # Test tab switching to Skenario B
        b_tab = page.locator('button[data-modal-scenario="B"]')
        if b_tab.count() > 0:
            b_tab.click()
            time.sleep(0.5)
            page.screenshot(path='c:/Users/Aril Indra Permana/RuleLab/modal_scenario_b.png')
            print('Screenshot saved to modal_scenario_b.png', flush=True)
            
        # Test round filter to Putaran 1
        r1_btn = page.locator('.modal-scenario-content[data-scenario="B"] button[data-modal-round="1"]')
        if r1_btn.count() > 0:
            r1_btn.click()
            time.sleep(0.5)
            page.screenshot(path='c:/Users/Aril Indra Permana/RuleLab/modal_round_1.png')
            print('Screenshot saved to modal_round_1.png', flush=True)
    browser.close()
