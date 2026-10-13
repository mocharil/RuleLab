import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 960})
        page = context.new_page()
        page.goto('http://127.0.0.1:8000')
        page.wait_for_selector('#nav button[data-view="simulation"]')
        time.sleep(1)

        # Select the maritime draft
        page.evaluate('''() => {
            const select = document.querySelector('#current-draft');
            if (select) {
                for (let opt of select.options) {
                    if (opt.text.toLowerCase().includes('nelayan') || opt.text.toLowerCase().includes('perikanan')) {
                        select.value = opt.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }
            }
        }''')
        time.sleep(1)

        # Navigate to simulation view
        page.evaluate('() => document.querySelector(\'#nav button[data-view="simulation"]\').click()')
        time.sleep(1.5)

        # Tab 1: Proyeksi Skenario & Bridge Card with 8 maritime personas
        page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\maritime_tab1_bridge_8personas.png')
        print('Captured Tab 1 Proyeksi & 8-persona Bridge Card')

        # Click Tab 2: Forum Netizen & Persona AI
        page.evaluate('() => document.querySelector(\'button[data-action="sim-section"][data-section="social"]\').click()')
        time.sleep(2)
        page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\maritime_tab2_social_8nodes_network.png')
        print('Captured Tab 2 8-node Network Graph & Netizen Forum')

        # Click on a specific persona node in SVG (e.g. Pak Rusli)
        page.evaluate('() => { const node = document.querySelector(\'g[data-person="rusli_nelayan"]\'); if (node) node.click(); }')
        time.sleep(1)
        page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\maritime_tab2_inspector_rusli.png')
        print('Captured Tab 2 Inspector with Pak Rusli detail')

        # Click Tab 3: Tinjauan Terpadu (Sintesis)
        page.evaluate('() => document.querySelector(\'button[data-action="sim-section"][data-section="unified"]\').click()')
        time.sleep(1.5)
        page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\maritime_tab3_synthesis_unified.png')
        print('Captured Tab 3 Unified Synthesis')

        browser.close()

if __name__ == '__main__':
    run()
