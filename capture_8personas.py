import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 960})
        page = context.new_page()
        page.goto('http://127.0.0.1:8000/workspace?view=simulation')
        page.wait_for_timeout(3000)

        # Tab 1: Proyeksi Skenario & Bridge Card with 8 maritime personas
        page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\maritime_tab1_bridge_8personas.png')
        print('Captured Tab 1 Proyeksi & 8-persona Bridge Card')

        # Click Tab 2: Forum Netizen & Persona AI
        page.evaluate('''() => {
            const btn = document.querySelector('button[data-action="sim-section"][data-section="social"]');
            if (btn) btn.click();
        }''')
        page.wait_for_timeout(2500)
        page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\maritime_tab2_social_8nodes_network.png')
        print('Captured Tab 2 8-node Network Graph & Netizen Forum')

        # Click on Pak Rusli node in the SVG graph to inspect
        page.evaluate('''() => {
            const node = document.querySelector('g[data-person="rusli_nelayan"]') || document.querySelector('.social-node.persona');
            if (node) {
                node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
        }''')
        page.wait_for_timeout(1500)
        page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\maritime_tab2_inspector_rusli.png')
        print('Captured Tab 2 Inspector with Pak Rusli detail')

        # Click Tab 3: Tinjauan Terpadu (Sintesis)
        page.evaluate('''() => {
            const btn = document.querySelector('button[data-action="sim-section"][data-section="unified"]');
            if (btn) btn.click();
        }''')
        page.wait_for_timeout(2500)
        page.screenshot(path=r'C:\Users\Aril Indra Permana\.gemini\antigravity\brain\3e7d2b46-3f15-4db8-90be-0e4ead6b2037\maritime_tab3_synthesis_unified.png')
        print('Captured Tab 3 Unified Synthesis')

        browser.close()

if __name__ == '__main__':
    run()
